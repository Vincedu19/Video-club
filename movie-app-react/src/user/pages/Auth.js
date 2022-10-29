import React, { useState, useContext } from "react";
import Input from "../../shared/components/FormElement/Input/Input";
import ImageUpload from "../../shared/components/FormElement/Image/ImageUpload";
import Button from "../../shared/components/FormElement/Button/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Auth.css";

const Auth = () => {
  const AuthCtx = useContext(AuthContext);
  const [isLogIn, setIsLogin] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLogIn) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        AuthCtx.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);

        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData
        );

        AuthCtx.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };

  const switchModeHandler = () => {
    if (!isLogIn) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
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
    }
    setIsLogin((prevMode) => !prevMode);
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <form className="form-auth" onSubmit={authSubmitHandler}>
        <div className="form-title">
          {isLogIn ? (
            <h1>Connectez-vous à votre compte</h1>
          ) : (
            <h1>Créez votre compte</h1>
          )}
        </div>
        {!isLogIn && (
          <Input
            element="input"
            id="name"
            type="text"
            label="Nom d'utilisateur"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Veuillez enter un nom valide"
            onInput={inputHandler}
          />
        )}
        {!isLogIn && (
          <ImageUpload
            center
            id="image"
            onInput={inputHandler}
            errorText="Veuillez ajouter une image à votre profile"
          />
        )}
        <Input
          element="input"
          id="email"
          type="email"
          label="E-mail"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Veuillez entrer un email valide"
          onInput={inputHandler}
        />
        <Input
          element="input"
          id="password"
          type="password"
          label="Mot de passe"
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText="Votre mot de passe doit comporter au moins 6 caractères"
          onInput={inputHandler}
        />
        <div className="container-btn__auth">
          <Button type="submit" disabled={!formState.isValid} primary>
            {isLogIn ? "Se connecter" : "Créer mon compte"}
          </Button>
          {isLogIn ? (
            <h5>
              Pas encore de compte ?{" "}
              <span onClick={switchModeHandler}>Céez-en un !</span>
            </h5>
          ) : (
            <h5>
              Déja un compte ?{" "}
              <span onClick={switchModeHandler}>Connectez-vous !</span>
            </h5>
          )}
        </div>
      </form>
    </>
  );
};

export default Auth;
