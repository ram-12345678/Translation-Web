import axios from 'axios';
export const axiosPostApi = async (apiUrl,params) => {
    try {
        const response = axios.post(apiUrl, {
            ...params
        })
        return response.data;
    } catch (error) {
        if (error.response) {
           console.error('FETCH_DATA_FAILURE', error.response.data );
          } else if (error.request) {
            console.error('No response received:', error.request);
          } else {
            console.error('Error setting up request:', error.message);
          }
    }
}