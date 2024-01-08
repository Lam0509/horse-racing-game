require('dotenv').config();

export const Configuration = () => ({
  signedMessage: process.env.signedMessage || 'login',
  security: {
    jwtSecret: process.env.JWT_SECRET || 'nosecret',
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || '1y',
  },
  mongo: {
    uri: process.env.MONGO_URI,
  },
  redis: {
    url: 'redis://redis:6379',
  },
});
