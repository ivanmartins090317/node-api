require("dotenv").config;
const secret = process.env.JWT_TOKEN;
const jwt = require("jsonwebtoken");
const user = require("../app/routes/models/user");

const withAuth = (req, res, next) => {
  const token = req.header("x-acesso-token");
  if (!token) {
    res.status(401).jsaon({ error: "Unauthorized: No token provided" });
  } else {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(401).send("Unauthorized: invalid token");
      } else {
        req.email = decoded.email;
        user
          .findOne({ email: decoded.email })
          .then((user) => {
            req.user = user;
            next();
          })
          .catch((err) => {
            res.status(401).send(err);
          });
      }
    });
  }
};

module.exports = withAuth;
