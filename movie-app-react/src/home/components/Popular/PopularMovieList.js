import React, { useRef, useState, useEffect } from "react";
import PopularMovieItem from "./PopularMovieItem";
import leftArrow from "../../../assets/left-arrow.svg";
import rightArrow from "../../../assets/right-arrow.svg";
import "./PopularMovieList.css";

const PopularMovieList = (props) => {
  const imagePath = `https://image.tmdb.org/t/p/w1280`;
  const [slideNumber, setSlideNumber] = useState(0);
  const listRef = useRef();

  const handleClick = (direction) => {
    let distance = listRef.current.getBoundingClientRect().x;
    if (direction === "left" && slideNumber > 0) {
      setSlideNumber((prevslideNumber) => prevslideNumber - 1);
      listRef.current.style.transform = `translateX(${405 + distance}px)`;
    }

    if (direction === "right" && slideNumber < props.popular.length) {
      setSlideNumber((prevslideNumber) => prevslideNumber + 1);
      listRef.current.style.transform = `translateX(${-405 + distance}px)`;
    }
  };

  return (
    <div className="movie-List">
      <span className="list-title">{props.title}</span>
      <div className="container-list-icon">
        <img
          src={leftArrow}
          alt="icone retour arrière"
          className="sliderarrow left"
          onClick={() => handleClick("left")}
        />
        <ul className="container-popular-movies" ref={listRef}>
          {props.popular.map((movie) => {
            return (
              <PopularMovieItem
                key={movie.id}
                id={movie.id}
                image={imagePath + movie.poster_path}
                rank={movie.vote_average}
              />
            );
          })}
        </ul>
        <img
          src={rightArrow}
          alt="icone vers l'avant"
          className="sliderarrow right"
          onClick={() => handleClick("right")}
        />
      </div>
    </div>
  );
};

export default PopularMovieList;
