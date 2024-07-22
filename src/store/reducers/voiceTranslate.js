const initialState = {
    loading: false,
    error: null,
    data: null,
  };
  
  const voiceTranslate = (state = initialState, action) => {
    switch (action.type) {
      case 'POST_DATA_REQUEST':
        return {
          ...state,
          loading: true,
          error: null,
        };
      case 'POST_DATA_SUCCESS':
        return {
          ...state,
          loading: false,
          data: action.payload,
        };
      case 'POST_DATA_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.error,
        };
      default:
        return state;
    }
  };
  
  export default voiceTranslate;