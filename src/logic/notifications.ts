import { toast } from 'react-toastify';

export function popup(msg: string, type: 'error' | 'info' | 'success') {
  toast[type](msg);
}
