const fs = require('fs');
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../Models/http-error");
const Movie = require("../Models/movie");
const User = require("../Models/user");

//Fonction qui affiche un film => récupère l'ID film
const getMoviesById = async (req, res, next) => {
  const movieId = req.params.mid;

  let movie;
  try {
    movie = await Movie.findById(movieId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }

  // if (!movie) {
  //   const error = new HttpError(
  //     "Could not find place for the provided id.",
  //     404
  //   );
  //   return next(error);
  // }

  res.json({ movie: movie.toObject({ getters: true }) });
};

//Fonction qui affiche tout les films d'un utilisateur => récupère l'ID utilisateur
const getMoviesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let places;
  let userWithMovies;
  try {
    userWithMovies = await User.findById(userId).populate("movies");
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later.",
      500
    );
    return next(error);
  }

  // if (!userWithMovies || userWithMovies.movies.length === 0) {
  //   return next(
  //     new HttpError("Could not find places for the provided user id.", 404)
  //   );
  // }

  res.json({
    movies: userWithMovies.movies.map((movie) =>
      movie.toObject({ getters: true })
    ),
  });
};

const createMovie = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Tout les champs ne sont pas correctement remplis.", 422)
    );
  }
  
  const { title, description, year, director, country, creator } = req.body;
  const createdMovie = new Movie({
    title,
    description,
    image: req.file.path,
    year,
    director,
    country,
    creator,
  });

 

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdMovie.save({ session: sess });
    user.movies.push(createdMovie);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ movie: createdMovie });
};

const updateMovie = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      HttpError("Tout les champs ne sont pas correctement remplis.", 422)
    );
  }
  const { title, description, director, year, country } = req.body;
  const movieId = req.params.mid;

  let movie;

  try {
    movie = await Movie.findById(movieId);
  } catch (err) {
    const error = new HttpError("Impossible de trouver un film ", 500);
    return next(error);
  }

  if(movie.creator.toString() !== req.userData.userId){
    const error = new HttpError("Vous n'êtes pas autorisé à modifier cette fiche", 401);
    return next(error);
  }

  movie.title = title;
  movie.director = director;
  movie.year = year;
  movie.country = country;
  movie.description = description;

  try {
    await movie.save();
  } catch (err) {
    const error = new HttpError("Impossible de mettre le film à jour.", 500);
    return next(error);
  }
  res.status(200).json({ movie: movie.toObject({ getters: true }) });
};

const deleteMovie = async (req, res, next) => {
  const movieId = req.params.mid;

  let movie;
  try {
    movie = await Movie.findById(movieId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  if (!movie) {
    const error = new HttpError("Could not find place for this id.", 404);
    return next(error);
  }

  if(movie.creator.id !== req.userData.userId){
    const error = new HttpError("Vous n'êtes pas autorisé à éffacé cette fiche", 401);
    return next(error);
  }

  const imagePath = movie.image;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await movie.remove({ session: sess });
    movie.creator.movies.pull(movie);
    await movie.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, err => {
    console.log(err)
  });

  res.status(200).json({ message: "Deleted place." });
};

exports.getMoviesById = getMoviesById;
exports.getMoviesByUserId = getMoviesByUserId;
exports.createMovie = createMovie;
exports.updateMovie = updateMovie;
exports.deleteMovie = deleteMovie;
