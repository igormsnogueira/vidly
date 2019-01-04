import httpService from "./httpService";

const apiEndpoint = "/movies";
function movieUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getMovies() {
  return httpService.get(apiEndpoint);
}
export function getMovie(movieId) {
  return httpService.get(movieUrl(movieId));
}
export function saveMovie(movie) {
  if (movie._id) {
    const body = { ...movie };
    delete body._id; //fazemos isso pois o backend nao quer receber um dado com id, ja tem na url, nao pode ter um id na url e por algum motivo outro no objeto que vai pro banco
    return httpService.put(movieUrl(movie._id), body);
  }
  return httpService.post(apiEndpoint, movie);
}
export function deleteMovie(movieId) {
  return httpService.delete(movieUrl(movieId));
}
