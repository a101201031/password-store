export const ENV = {
  API_URL:
    process.env.NODE_ENV === 'production'
      ? 'https://server.alwayscoding.app'
      : 'http://localhost:8000/dev',
};
