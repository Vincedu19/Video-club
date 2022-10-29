const express = require("express");
const { check } = require("express-validator");


const moviesController = require("../Controllers/movies-controller");
const fileUpload = require("../Middleware/file-upload");
const checkAuth = require("../Middleware/check-auth");

const router = express.Router();

router.get("/:mid", moviesController.getMoviesById);

router.get("/user/:uid", moviesController.getMoviesByUserId);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single('image'),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    
  ],
  moviesController.createMovie
);

router.patch(
  "/:mid",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    
  ],
  moviesController.updateMovie
);

router.delete("/:mid", moviesController.deleteMovie);

module.exports = router;
