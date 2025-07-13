{
  isLoading ? (
    <p className="text-white">Loading</p>
  ) : errorMessage ? (
    <p className="text-red-500">{errorMessage}</p>
  ) : (
    <ul>
      {movieList.map((movie) => (
        <p className="text-white">{movie.title}</p>
      ))}
    </ul>
  );
}
