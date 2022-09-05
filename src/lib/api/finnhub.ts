import axios from 'axios';

const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;

const auth =
  import.meta.env.NODE_ENV === 'production'
    ? {
        headers: {
          'X-Finnhub-Token': apiKey,
        },
      }
    : {
        params: {
          token: apiKey,
        },
      };

const finnHub = axios.create({
  baseURL: 'https://finnhub.io/api/v1',
  ...auth,
});

export default finnHub;
