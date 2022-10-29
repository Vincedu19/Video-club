import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../shared/components/FormElement/Input/Input";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import Button from "../../shared/components/FormElement/Button/Button";
import ImageUpload from "../../shared/components/FormElement/Image/ImageUpload";
import "./FormMovie.css";

const NewMovie = () => {
  const authCtx = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
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
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const movieSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("year", formState.inputs.year.value);
      formData.append("director", formState.inputs.director.value);
      formData.append("country", formState.inputs.country.value);
      formData.append("image", formState.inputs.image.value);
      formData.append("creator", authCtx.userId);
      await sendRequest(
        "http://localhost:5000/api/movies",
        "POST",
        formData,
        {Authorization: 'Bearer ' + authCtx.token}
      );

      navigate("/" + authCtx.userId + "/movies");
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className="movie-form" onSubmit={movieSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <div className="form-title">
          <h1>Ajouter un film à ma liste🎬</h1>
        </div>
        <Input
          id="title"
          element="input"
          type="text"
          label="Titre :"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Veuillez entrer un titre valide"
          onInput={inputHandler}
        />
        <ImageUpload
          center
          id="image"
          onInput={inputHandler}
          errorText="Veuillez ajouter l'image du film"
        />
        <Input
          id="director"
          element="input"
          type="text"
          label="Réalisateur :"
          validators={[VALIDATOR_MINLENGTH(1)]}
          errorText="Le nom du réalisateur doit contenir au moins 1 caratères"
          onInput={inputHandler}
        />
        <Input
          id="year"
          element="input"
          type="text"
          label="Année :"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Renseignez l'année de sortie"
          onInput={inputHandler}
        />
        <Input
          id="country"
          element="input"
          type="text"
          label="Pays de production :"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Renseignez le pays de production"
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Synopsis :"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Le résumé du film doit contenir au moins 5 caractères"
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid} primary>
          Ajouter ce film
        </Button>
      </form>
    </>
  );
};

export default NewMovie;
