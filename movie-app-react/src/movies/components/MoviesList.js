import React from "react";
import MoviesItem from "./MoviesItem";
import Button from "../../shared/components/FormElement/Button/Button";

import "./MoviesList.css";

const MoviesList = (props) => {

  if (props.items.length === 0) {
    return (
      <div className="movie-list-null center">
        <h2>Aucun films enregistrés.</h2>
     </div>
    );
  } else {
    return (
      <div className="movie-container">
        <div className="title-container center">
          <h2>
            Il y a <span className="number">{props.items.length}</span>{" "}
            {props.items.length > 1 ? "films enregistrés" : "film enregistré"}
          </h2>
        </div>
        <ul className="movie-list">
          {props.items
            .sort((a, b) => {
              if (a.title < b.title) {
                return -1;
              }
              if (a.title > b.title) {
                return 1;
              }
              return 0;
            })
            .map((movie) => (
              <MoviesItem
                key={movie.id}
                id={movie.id}
                image={movie.image}
                title={movie.title}
                director={movie.director}
                year={movie.year}
                country={movie.country}
                description={movie.description}
                creatorId={movie.creator}
                onDelete={props.onDeleteMovie}
              />
            ))}
        </ul>
      </div>
    );
  }
};

export default MoviesList;
