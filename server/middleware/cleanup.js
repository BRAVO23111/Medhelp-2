import cron from 'node-cron';
import { AppointmentModel } from '../models/AppointmentSchema.js';


// Function to setup the cleanup job
const setupCleanupJob = () => {
    // Schedule the cleanup job to run every day at midnight
    cron.schedule('0 0 * * *', async () => {
        try {
            const result = await AppointmentModel.deleteMany({
                date: { $lt: new Date() }
            });
            console.log(`Deleted ${result.deletedCount} past appointments`);
        } catch (error) {
            console.error('Error deleting past appointments:', error);
        }
    });
};

export default setupCleanupJob;
