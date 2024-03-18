import {async_keys, getData} from '../api/UserPreference';

// Base URL
// export const BASE_URL = 'https://mosambiindia.com/api/';
export const BASE_URL = 'https://staging.premad.in/mosambi/api/';

// Methods
export const makeRequest = async (api, params = null, post = false) => {
  try {
    const token = (await getData(async_keys.auth_token)) || null;
    // console.log('token', token);
    const url = `${BASE_URL}${api}`;
    // request info
    let requestOptions = {};

    if (post) {
      // request method type
      requestOptions.method = 'POST';

      var myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${token}`);

      // Preparing multipart/form-data
      if (params) {
        const formData = new FormData();
        for (const key in params) {
          formData.append(key, params[key]);
        }
        requestOptions.body = formData;
      }

      // request body
      if (token) {
        requestOptions.headers = myHeaders;
      }
    } else {
      // headers to prevent cache in GET request
      requestOptions.headers = {
        // 'Cache-Control': 'no-cache, no-store, must-revalidate',
        // Pragma: 'no-cache',
        // Expires: 0,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
      if (token) {
        requestOptions.headers.Authorization = `Bearer ${token}`;
      }
    }
    console.log('API-INFO---requestOptions', requestOptions);
    const response = await fetch(url, requestOptions);
    const result = await response.json();

    console.log('API-INFO', {url, requestOptions, response, result});

    return result;
  } catch (error) {
    console.log(error.message);
  }
};
