import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./home/pages/Home";
import Users from "./user/pages/Users";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import NewMovie from "./movies/pages/NewMovie";
import UserMovies from "./movies/pages/UserMovies";
import UpdateMovie from "./movies/pages/UpdateMovie";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import Footer from "../src/shared/components/Footer/Footer";

function App() {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
      <>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/:userid/movies" element={<UserMovies />} />
        <Route path="/movies/new" element={<NewMovie />} />
        <Route path="/movies/:movieid" element={<UpdateMovie />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </>
    );
  } else {
    routes = (
      <>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/:userid/movies" element={<UserMovies />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate replace to="/auth" />} />
      </>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <MainNavigation />
      <main>
        <Routes>{routes}</Routes>
      </main>
      <Footer />
    </AuthContext.Provider>
  );
}

export default App;
