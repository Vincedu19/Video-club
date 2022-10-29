import React, {useEffect, useState} from "react";
import MoviesList from "../components/MoviesList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useParams} from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";


const UserMovies = () => {
  const [loadedMovies, setLoadedMovies] = useState();
  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  const userId = useParams().userid;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/movies/user/${userId}`
        );
        setLoadedMovies(responseData.movies);
      
      } catch (err) {}
    };
    fetchMovies();
  }, [sendRequest, userId]);

  const movieDeletedHandler = deletedMovieId => {
    setLoadedMovies(prevMovies =>
      prevMovies.filter(movie => movie.id !== deletedMovieId)
    );
    
  };
   
  return (
    <>
      <ErrorModal error={error} onClear={clearError}/>
      {isLoading && <LoadingSpinner/>}
      {!isLoading && loadedMovies && <MoviesList items={loadedMovies} onDeleteMovie={movieDeletedHandler} />}
    </>
  );
};

export default UserMovies;
