import React, { useState, useEffect } from 'react'
import {
  Heading, MoviesRatedParagraph, MovieRatedRow, MovieTitleRated,
  RatingStars, UserName, UserNames, WrapperWelcomeBox
} from "./Styling"
import { Link } from 'react-router-dom'
import { getLocalstorage } from "../reducers/users.js"
import { useSelector, useDispatch } from 'react-redux'


const url = "http://localhost:8080/secrets";

// Fetch data with a GET request to our MongoDB database for an individual user 
export const UserPage = () => {
  const dispatch = useDispatch()

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [moviesRated, setMoviesRated] = useState([])
  const [movieStatus, setMovieStatus] = useState([])
  const [userList, setUserList] = useState([])
  const watchStatus = "watch"

  const accessToken = window.localStorage.getItem("accessToken")
  const userId = window.localStorage.getItem("userId")

  //Funkar att rendera om sidan när man loggar in men sparade filmer syns inte...
  // const accessToken = useSelector((state) => state.users.accessToken)
  // const userName = useSelector((state) => state.users.userName)
  // const userId = useSelector((state) => state.users.userId)

  // const userId = window.localStorage.getItem("userId")
  // const { userId } = useParams()


  //How to change user based on ID in the URL?? 

  const ratingStars = (rating) => {
    if (rating === 5) {
      return "⭐️⭐️⭐️⭐️⭐️"
    } else if (rating === 4) {
      return "⭐️⭐️⭐️⭐️"
    } else if (rating === 3) {
      return "⭐️⭐️⭐️"
    } else if (rating === 2) {
      return "⭐️⭐️"
    } else {
      return "⭐️"
    }
  }

  useEffect(() => {
    setErrorMessage("");
    fetch(url, {
      method: "GET",
      headers: { Authorization: accessToken }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("You need to sign in to view this page", JSON);
        } else {
          return res.json();
        }
      })
      .then(json => setMessage(json.secret))
      .catch(err => {
        setErrorMessage(err.message);
      });
  }, [accessToken]);

  useEffect(() => {
    fetch(`http://localhost:8080/users/${userId}/movies`)
      .then(res => res.json())
      .then(json => {
        setMoviesRated(json)
        console.log("ratedmovies:", json)
      })
  }, [])

  useEffect(() => {
    fetch(`http://localhost:8080/users/${userId}/allUsers`)
      .then(res => res.json())
      .then(json => {
        setUserList(json)
        console.log("all users:", json)

      })
  }, [])

  useEffect(() => {
    fetch(`http://localhost:8080/users/${userId}/movies?watchStatus=${watchStatus}`)
      .then(res => res.json())
      .then(json => {
        setMovieStatus(json)
        console.log("watchstatus:", json)
      })
  }, [])


  return (
    <div>
      {errorMessage && <div>{errorMessage}</div>}
      {message && (
        <WrapperWelcomeBox>
          <Heading>Welcome to your user page! </Heading>
          <br></br>
          <MoviesRatedParagraph>Movies that you have rated </MoviesRatedParagraph>
          {moviesRated[0] && (
            moviesRated.map((movie) => (
              <MovieRatedRow
                key={movie.movieId}
              >
                <Link to={`/movies/${movie.movieId}`}>
                  <MovieTitleRated>{movie.movieTitle}</MovieTitleRated>
                </Link>
                <RatingStars>{ratingStars(movie.rating)}</RatingStars>
              </MovieRatedRow>
            ))
          )}

          <div>
            <MoviesRatedParagraph>Movies on your watchlist</MoviesRatedParagraph>
            {movieStatus[0] && (
              movieStatus.map((movie) => (
                <MovieRatedRow
                  key={movie.movieId}
                >
                  <Link to={`/movies/${movie.movieId}`}>
                    <MovieTitleRated>{movie.movieTitle}</MovieTitleRated>
                    <img src={movie.movieImage} alt={movie.id} />
                  </Link>
                </MovieRatedRow>
              ))
            )}
          </div>

          <UserNames>Other users - compare ratings and watchlists</UserNames>
          {userList.map((user) => (
            <div
              key={user._id}
            >
              <Link to={`/users/${user._id}`}>
                <UserName>{user.name}</UserName>
              </Link>
            </div>
          ))}
        </WrapperWelcomeBox>
      )}
    </div>
  );
};