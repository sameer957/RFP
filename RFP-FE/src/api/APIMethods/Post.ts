import axiosInstance from '../AxiosInstance';
export const PostMethod = async (url: string, payload: any) => {
  try {
    const res = await axiosInstance.post(url, payload);
    return res.data;
  } catch (error: any) {
    console.error('Cannot perform action, Try Again', error);
    return error.response;
  }
};
