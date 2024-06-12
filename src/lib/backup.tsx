import axiosInstance from './axios';

export const getAllBackups = async () => {
  const response = await axiosInstance.get('/backup');
  return response.data;
};

export const createBackup = async () => {
  const response = await axiosInstance.post('/backup');
  return response.data;
};

export const downloadBackup = async (folderName: string) => {
  const response = await axiosInstance.get(`/backup/download/${folderName}`, {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${folderName}.zip`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const restoreBackup = async (folderName: string) => {
  const response = await axiosInstance.post('/backup/restore', {
    fileName: folderName,
  });
  return response.data;
};
