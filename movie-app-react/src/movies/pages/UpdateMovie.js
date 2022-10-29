import React, { useEffect, useState, useContext } from "react";

import { useParams, useNavigate } from "react-router-dom";
import Input from "../../shared/components/FormElement/Input/Input";
import Button from "../../shared/components/FormElement/Button/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./FormMovie.css";

const UpdateMovie = () => {
  const authCtx = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedMovies, setLoadedMovies] = useState();
  const navigate = useNavigate();


  const movieId = useParams().movieid;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      director: {
        value: "",
        isValid: false,
      },
      year: {
        value: "",
        isValid: false,
      },
      country: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/movies/${movieId}`
        );
        setLoadedMovies(responseData.movie);
        setFormData(
          {
            title: {
              value: responseData.movie.title,
              isValid: true,
            },
            director: {
              value: responseData.movie.director,
              isValid: true,
            },
            year: {
              value: responseData.movie.year,
              isValid: true,
            },
            country: {
              value: responseData.movie.country,
              isValid: true,
            },
            description: {
              value: responseData.movie.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchMovie();
  }, [sendRequest, movieId, setFormData]);

  const movieUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/movies/${movieId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          director: formState.inputs.director.value,
          year: formState.inputs.year.value,
          country: formState.inputs.country.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization : 'Bearer ' + authCtx.token
        }
        );
      
        navigate('/' + authCtx.userId + '/movies');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedMovies && !error) {
    return (
      <div className="center">
        <h2>Aucun films trouvé</h2>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedMovies && (
        <form className="movie-form" onSubmit={movieUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Titre"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Veuillez entrer un titre valide."
            onInput={inputHandler}
            initialValue={loadedMovies.title}
            initialValid={true}
          />
          <Input
            id="director"
            element="input"
            label="Réalisateur"
            validators={[VALIDATOR_MINLENGTH(2)]}
            errorText="Le nom du réalisateur doit contenir au moins 2 caratères"
            onInput={inputHandler}
            initialValue={loadedMovies.director}
            initialValid={true}
          />
          <Input
            id="year"
            element="input"
            label="Année"
            validators={[VALIDATOR_MINLENGTH(4)]}
            errorText="Vous devez entrer une anné valide"
            onInput={inputHandler}
            initialValue={loadedMovies.year}
            initialValid={true}
          />
          <Input
            id="country"
            element="input"
            label="Pays"
            validators={[VALIDATOR_MINLENGTH(2)]}
            errorText="Le nom du pays doit contenir au moins 2 caratères"
            onInput={inputHandler}
            initialValue={loadedMovies.country}
            initialValid={true}
          />
          <Input
            id="description"
            element="textArea"
            label="Synopsis"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Votre description doit contenir au moins 5 caratères"
            onInput={inputHandler}
            initialValue={loadedMovies.description}
            initialValid={true}
          />

          <Button type="submit" disabled={!formState.isValid} primary>
            Mettre à jour
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdateMovie;
