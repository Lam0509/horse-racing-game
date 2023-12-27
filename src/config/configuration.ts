require('dotenv').config();

export const Configuration = () => ({
  signedMessage: process.env.signedMessage,
  security: {
    jwtSecret: process.env.JWT_SECRET || 'nosecret',
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || '1h',
  },
});
