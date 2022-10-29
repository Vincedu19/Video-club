import React from "react";
import Avatar from "../../shared/components/UIElements/Avatar";
import { Link } from "react-router-dom";
import "./UserItem.css";

const UserItem = (props) => {
  return (
    <li className="user-item">
      <div className="user-item__content">
        <Link to={`/${props.id}/movies`}>
          <div className="user-item__image">
            <Avatar image={`http://localhost:5000/${props.image}`} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.movieCount} {props.movieCount <= 1 ? "Film" : "Films"}
            </h3>
          </div>
        </Link>
      </div>
    </li>
  );
};

export default UserItem;
