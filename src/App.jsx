import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount } from "./appwrite";
const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setisLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(
        query
          ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
              query
            )}`
          : "https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&page=1&sort_by=popularity.desc",
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch movies: ${res.status}`);
      }

      const data = await res.json();

      setMovieList(data.results);

      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0])
      }

    } catch (error) {
      console.error("Error fetching movies", error);
      setErrorMessage("Ocurrió un error al cargar las películas.");
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
