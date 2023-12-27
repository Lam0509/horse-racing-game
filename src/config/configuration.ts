require('dotenv').config();

export const Configuration = () => ({
  signedMessage: process.env.signedMessage,
  mongo: {
    uri: process.env.MONGO_URI,
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'nosecret',
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || '1y',
  },
});
