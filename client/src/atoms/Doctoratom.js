import { atom } from 'recoil';

// Define Recoil atom for selected doctor ID
export const selectedDoctorIdState = atom({
  key: 'selectedDoctorId',
  default: null,
});
