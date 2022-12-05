const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

function decodeToken(token) {
  return jwt.decode(token.replace("Bearer ", ""));
}

function verifyJWTToken(token) {
  return jwt.verify(token,jwtSecret);
}

function getJWTToken(data) {
  const token = `Bearer ${jwt.sign(data, jwtSecret)}`;
  return token;
}

module.exports = { decodeToken, getJWTToken, verifyJWTToken };
