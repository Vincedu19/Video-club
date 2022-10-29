import React, {useContext} from "react";
import Button from "../../shared/components/FormElement/Button/Button";
import { AuthContext } from "../../shared/context/auth-context";
import Herobg from "../../assets/hero.jpg";
import "./Hero.css";

const Hero = () => {
  const AuthCtx = useContext(AuthContext);
  return (
    <div className="container-hero">
      <div
        className="container-hero-img-infos"
        style={{ backgroundImage: `url(${Herobg})` }}
      >
        <div className="infos">
          <h1 className="infos-text">
            Créer ton compte et répertories<br/> tous les films que tu as vus.
          </h1>
          {!AuthCtx.isLoggedIn && <Button to="/auth" primary>Je crée mon compte</Button>}
        </div>
      </div>
    </div>
  );
};

export default Hero;
