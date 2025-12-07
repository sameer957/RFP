import axiosInstance from '../AxiosInstance';

export const GetMethod = async (url: string) => {
  try {
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    console.error('Cannot perform action, Try Again', error);
  }
};
