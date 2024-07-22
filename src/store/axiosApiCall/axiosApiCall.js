import axios from './axiosConfig'; // Adjust path to your axiosConfig file

export const postData = (text, lang) => {
  const data = { text, lang };
  console.log(text, lang,'text, lang')
  return async (dispatch) => {
    dispatch({ type: 'POST_DATA_REQUEST' });

    try {
      const response = await axios.post('/translate',data); // Adjust endpoint as per your API

      dispatch({
        type: 'POST_DATA_SUCCESS',
        payload: response.data, // Optional: If your API returns data on success
      });
    } catch (error) {
      dispatch({
        type: 'POST_DATA_FAILURE',
        error: error.message, // Optional: Pass specific error message or data
      });
    }
  };
};