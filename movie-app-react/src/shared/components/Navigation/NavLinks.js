import React, {useContext} from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";

const NavLinks = () => {
  const authCtx = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/users">Tous les profiles</NavLink>
      </li>
      {authCtx.isLoggedIn && <li>
        <NavLink to={`/${authCtx.userId}/movies`}>Mes films</NavLink>
      </li>}
      {authCtx.isLoggedIn && <li>
        <NavLink to="/movies/new">Ajouter un film</NavLink>
      </li>}
      {!authCtx.isLoggedIn && <li>
        <NavLink to="/auth">Se connecter</NavLink>
      </li>}
      {authCtx.isLoggedIn && <li className="logout-link" onClick={authCtx.logout}>
        Se deconnecter
      </li>}
    </ul>
  );
};

export default NavLinks;
