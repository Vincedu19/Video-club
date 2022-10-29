const express = require("express");
const { check } = require("express-validator");

const usersController = require("../Controllers/users-controller");
const fileUpload = require("../Middleware/file-upload");

const router = express.Router();

router.get("/", usersController.getUsers);

router.post(
  "/signup",
  fileUpload.single('image'),
  [
    check("name").not().isEmpty().isLength({ min: 3 }),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({min: 6})
  ],
  usersController.signup
);
router.post("/login", usersController.login);

module.exports = router;
