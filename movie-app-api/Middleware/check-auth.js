const jwt = require("jsonwebtoken");
const HttpError = require("../Models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw new Error("Erreur lors de l'authentification");
    }
    const decodedToken = jwt.verify(token, "secret_ne_pas_partager");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Erreur lors de l'authentification", 401);
    return next(error);
  }
};
