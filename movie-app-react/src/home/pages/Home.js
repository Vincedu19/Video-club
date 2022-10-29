import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import { useHttpClient } from "../../shared/hooks/http-hook";
import PopularMovieList from "../components/Popular/PopularMovieList";
import TheatersMovieList from "../components/Popular/TheatersMovieList";
import RatedMovieList from "../components/Popular/RatedMovieList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Home = (props) => {
  const { isLoading, sendRequest } = useHttpClient();
  const [popularMovies, setPopularMovies] = useState([]);
  const [theaterMovies, setTheaterMovies] = useState([]);
  const [ratedMovies, setRatedMovies] = useState([]);

  useEffect(() => {
    const getPopular = async () => {
      try {
        const responseData = await sendRequest(
          "http://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=817962a04d153a38999496d61e20943c&page=1"
        );
        setPopularMovies(responseData.results);
      } catch (err) {}
    };
    getPopular();

    const getTheater = async () => {
      const responseData = await sendRequest(
        "http://api.themoviedb.org/3/discover/movie?primary_release_date.gte=2022-10-19&primary_release_date.lte=2022-10-22&api_key=817962a04d153a38999496d61e20943c&page=1"
      );

      setTheaterMovies(responseData.results);
    };
    getTheater();

    const getRated = async () => {
      const responseData = await sendRequest(
        "http://api.themoviedb.org/3/discover/movie/?certification_country=US&certification=R&sort_by=vote_average.desc&api_key=817962a04d153a38999496d61e20943c&page=1"
      );

      setRatedMovies(responseData.results);
    };
    getRated();
  }, [sendRequest]);

  return (
    <div>
      <Hero />
      {isLoading && <LoadingSpinner />}
      {!isLoading && popularMovies && (
        <PopularMovieList title="Films Populaires" popular={popularMovies} />
      )}
      {!isLoading && theaterMovies && (
        <TheatersMovieList title="Films En Salle" theater={theaterMovies} />
      )}
      {!isLoading && ratedMovies && (
        <RatedMovieList title='Films Rated "R"' rated={ratedMovies} />
      )}
    </div>
  );
};

export default Home;
