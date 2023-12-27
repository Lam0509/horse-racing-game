require('dotenv').config();

export const Configuration = () => ({
  signedMessage: process.env.signedMessage,
  security: {
    jwtSecret: process.env.JWT_SECRET,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
  },
});
