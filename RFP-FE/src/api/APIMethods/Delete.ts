import axiosInstance from '../AxiosInstance';

export const DeleteMethod = async (url: string) => {
  try {
    const res = await axiosInstance.delete(url);
    return res.data;
  } catch (error) {
    console.error('Cannot perform action, Try Again', error);
  }
};
