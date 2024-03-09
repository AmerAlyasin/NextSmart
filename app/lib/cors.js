// lib/cors.js

import Cors from 'cors';

// Initializing the cors middleware
export const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow the methods you need
});

// Helper function to initialize the middleware
export default function initMiddleware(handler) {
  return (req, res) => {
    return new Promise((resolve, reject) => {
      handler(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  };
}
