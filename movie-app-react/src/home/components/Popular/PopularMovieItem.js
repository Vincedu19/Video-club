import React from "react";
import "./PopularMovieItem.css";

const PopularMovieItem = (props) => {
  return (
    <>
      <li className="container-infos-img">
        <img src={props.image} alt="" />
        {props. rank > 0 ? <span className={props.rank > 5 ? "green" : "red"}>{props.rank}</span> : <span className="red">N.C</span>}
      </li>
    </>
  );
};

export default PopularMovieItem;
