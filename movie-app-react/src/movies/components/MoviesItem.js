import React, { useState, useContext } from "react";
import Button from "../../shared/components/FormElement/Button/Button";
import Modal from "../../shared/components/UIElements/Modal";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./MoviesIte.css";

const MoviesItem = (props) => {
  const AuthCtx = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const showDeleteWarningMopdal = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/movies/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: 'Bearer ' + AuthCtx.token
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <>
     
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Confirmation"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button primary onClick={cancelDeleteHandler}>
              Annuler
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              Supprimer
            </Button>
          </>
        }
      >
        <p>Voulez vous vraiment supprimer ce film ?</p>
      </Modal>
    
      <li className="movie-item">
        <div className="movie-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="movie-item__image">
            <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
          </div>
          <div className="movie-item__info">
            <h1>{props.title}</h1>
            <h3>{props.director}</h3>
            <span>{`${props.year} / ${props.country}`}</span>
            <p>{props.description}</p>
            <div className="movie-item__actions">
              {AuthCtx.userId === props.creatorId && (
                <Button to={`/movies/${props.id}`} primary>
                  MODIFIER
                </Button>
              )}
              {AuthCtx.userId === props.creatorId && (
                <Button danger onClick={showDeleteWarningMopdal}>
                  SUPPRIMER
                </Button>
              )}
            </div>
          </div>
        </div>
      </li>
    </>
  );
};

export default MoviesItem;
