import * as React from "react";
import { cn } from "../../utils/cn";
import { motion, AnimatePresence } from "framer-motion";

const FadeMenu = React.forwardRef(({ 
  trigger, 
  children, 
  align = "center", 
  className,
  triggerClassName,
  menuClassName,
  ...props 
}, ref) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef(null);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          anchorEl && !anchorEl.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [anchorEl]);

  // Handle menu positioning
  const getMenuPosition = () => {
    if (align === "left") return "left-0";
    if (align === "right") return "right-0";
    return "left-1/2 -translate-x-1/2"; // center by default
  };

  return (
    <div className={cn("relative inline-block", className)} ref={ref} {...props}>
      <div 
        onClick={handleClick}
        className={cn("cursor-pointer", triggerClassName)}
        aria-haspopup="true"
        aria-expanded={open ? "true" : "false"}
      >
        {trigger}
      </div>
      
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute z-50 mt-2 min-w-[10rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-md",
              getMenuPosition(),
              menuClassName
            )}
          >
            <div className="py-1">
              {React.Children.map(children, (child) => {
                return React.isValidElement(child)
                  ? React.cloneElement(child, {
                      onClick: (e) => {
                        child.props.onClick?.(e);
                        handleClose();
                      },
                    })
                  : child;
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

FadeMenu.displayName = "FadeMenu";

const FadeMenuItem = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex cursor-pointer items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

FadeMenuItem.displayName = "FadeMenuItem";

export { FadeMenu, FadeMenuItem };