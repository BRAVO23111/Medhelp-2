// atoms/appointmentAtom.js
import { atom, selector } from 'recoil';
import axios from 'axios';

export const appointmentsState = atom({
  key: 'appointmentsState', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export const fetchAppointmentsSelector = selector({
  key: 'fetchAppointmentsSelector',
  get: async ({ get }) => {
    try {
      const userId = window.localStorage.getItem('userId');
      const response = await axios.get(`https://medhelp-2.onrender.com/appointment/user/${userId}/appointments`);
      const currentAppointments = response.data.filter(appointment => new Date(appointment.date) >= new Date());
      return currentAppointments;
    } catch (error) {
      throw error;
    }
  },
});
