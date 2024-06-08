import { atom } from 'recoil';

// Define Recoil atom for selected doctor ID
export const selectedDoctorIdState = atom({
  key: 'selectedDoctorId',
  default: null,
});

export const userState = atom({
  key: 'userState',
  default: {
    id: '',
    token: '',
    role: '',
  },
});