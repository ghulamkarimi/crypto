import { toast } from "react-toastify";

// Einheitliche Optik und Position kommen aus dem ToastContainer (App.tsx) und index.css
const options = { autoClose: 4000, pauseOnHover: true, closeOnClick: true } as const;

export const NotificationService = {
  success(message: string) {
    toast.success(message, options);
  },
  error(message: string) {
    toast.error(message, { ...options, autoClose: 6000 });
  },
  info(message: string) {
    toast.info(message, options);
  },
};
