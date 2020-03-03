import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux";
import { DropDownList } from "components/DropDownList"
import { ListImage } from "./Styling";
import { movies } from "../reducers/movies"
// Import what we need to use

const API_KEY = process.env.REACT_APP_MOVIE_API_KEY

export const MoviesList = (props) => {
  const [movies, setMovies] = useState([])
  const category = useSelector((state) => state.movies.chosenCategory)
  const [error, setError] = useState(false)
  // const [loading, setLoading] = useState(true)



  useEffect(() => {
    // setLoading(true)
    fetch(`https://api.themoviedb.org/3/movie/${category}?api_key=${API_KEY}&language=en-US`)
      .then((res) => res.json())
      .then((json) => {
        setMovies(json.results)
        console.log(json.results)
      })
    // setLoading(false)
  }, [category])

  // if (loading) {
  //   return (
  //     <div className="loading-message">Movie page is loading...</div>
  //   )
  // }

  // if(!movies) {
  //   return(
  //     <div>{error}</div>
  //   )
  // }



  const searchResult = useSelector(state => state.movies.movies)
  let movieResults = movies
  if (searchResult.length > 0) {
    movieResults = searchResult
  }
  // console.log(searchResult)
  // Fetch data from API with a GET request
  // Render a list of movies depending on what the user has written in Searchbar

  //How to fetch more results, show page 2 etc..? 
  return (
    <div className="top-movie-list">
      <DropDownList />

      <section className="movie-list">
        {movieResults.map((movie) => (
          <Link key={movie.id} to={`/movies/${movie.id}`}>
            {movie.poster_path && (
              <ListImage src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`} alt={movie.id} />
            )}
            {!movie.poster_path && (
              <p>Lägg in placeholder</p>
            )}
            <div className="hover-details">
              <h1>{movie.original_title}</h1>
              <p>Released {movie.release_date}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}