import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCloudUploadOutline, IoDocumentOutline, IoCloseOutline, IoEyeOutline, IoTrashOutline } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../config/config';
import { Button } from "./ui/button";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const response = await api.get('/prescription/files');
      setUploadedFiles(response.data.files);
    } catch (err) {
      toast.error('Failed to fetch uploaded files');
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteUploadedFile = async (filename) => {
    try {
      await api.delete(`/prescription/delete/${filename}`);
      toast.success('File deleted successfully');
      fetchUploadedFiles();
    } catch (err) {
      toast.error('Failed to delete file');
    }
  };

  const viewFile = (url) => {
    window.open(url, '_blank');
  };

  const uploadFiles = async () => {
    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/prescription/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
      });

      await Promise.all(uploadPromises);
      toast.success('Files uploaded successfully!');
      setFiles([]);
      fetchUploadedFiles();
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const isPdf = ext === 'pdf';
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(ext);

    return (
      <IoDocumentOutline 
        className={`h-6 w-6 ${isPdf ? 'text-red-500' : isImage ? 'text-blue-500' : 'text-gray-500'}`}
      />
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleChange}
          accept="image/jpeg,image/png,image/gif,application/pdf"
          multiple
        />
        <button
          onClick={handleButtonClick}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:from-blue-600 hover:to-indigo-700 transition"
        >
          <IoCloudUploadOutline className="inline-block h-6 w-6 mr-2" />
          Upload Files
        </button>

        <AnimatePresence>
          {files.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-6 space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Selected Files</h3>
                {files.map((file, index) => (
                  <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-md">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.name)}
                      <span className="text-sm font-medium text-gray-700">{file.name}</span>
                    </div>
                    <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-gray-500">
                      <IoCloseOutline className="h-5 w-5" />
                    </button>
                  </motion.div>
                ))}
                <button onClick={uploadFiles} disabled={uploading} className={`w-full mt-4 py-2 rounded-lg font-medium text-white transition ${uploading ? 'bg-gray-400' : 'bg-indigo-500 hover:bg-indigo-600'}`}>
                  {uploading ? 'Uploading...' : 'Upload Files'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {uploadedFiles.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Uploaded Files</h3>
            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-3 bg-white rounded-lg shadow">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.filename)}
                    <span className="text-sm font-medium text-gray-700">{file.filename}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => viewFile(file.url)}
                      variant="ghost"
                      size="icon"
                      className="text-blue-500 hover:text-blue-600"
                      title="View file"
                    >
                      <IoEyeOutline className="h-5 w-5" />
                    </Button>
                    <Button
                      onClick={() => deleteUploadedFile(file.filename)}
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      title="Delete file"
                    >
                      <IoTrashOutline className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </motion.div>
    </div>
  );
};

export default FileUpload;
