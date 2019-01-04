import React, { Component } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getMovies, deleteMovie } from "../services/movieService"; //usando um get que faz requisição
import MoviesTable from "./moviesTable";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import ListGroup from "./common/listGroup";
import SearchBox from "./common/searchBox";
import { getGenres } from "../services/genreService"; //usando um get que faz requisição
import _ from "lodash"; //sera usada para implementar ordenação(sort)

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" }
  };
  async componentDidMount() {
    //lugar ideal pra fazer requisição http pra api
    const { data } = await getGenres();
    const genres = [{ _id: "", name: "All genres" }, ...data]; //fazemos isso pois temos que adicionar um genero fictio para exibir todos os generos no filtro quando selecionado
    const { data: movies } = await getMovies();
    this.setState({
      movies,
      genres
    });
  }
  handleDelete = movie => {
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter(m => m._id !== movie._id);
    this.setState({
      movies
    });
    try {
      deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie has already been deleted");
      this.setState({ movies: originalMovies });
    }
  };
  handleLike = movie => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movie };
    movies[index].liked = !movies[index].liked;
    this.setState({
      movies
    });
  };
  handlePageChange = page => {
    this.setState({ currentPage: page });
  };
  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 }); // ao selecionar um genero, a pagina atual tem que voltar pra 1
  };
  handleSearch = query => {
    //atualiza o state searchQuery que contem a string a ser buscada nos movies , coloca a pagina atual como 1, e coloca o selectedGenre como null, pra aparecer filme de qualquer genero que atenda ao selectedQuery
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };
  handleSort = sortColumn => {
    this.setState({ sortColumn }); //sortColum é pra ordenar a tabela por coluna, path é a coluna e order é se é ascendente(asc) ou descendente(desc)
  };
  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      movies: allMovies,
      selectedGenre,
      sortColumn,
      searchQuery
    } = this.state;

    let filtered = allMovies;
    if (searchQuery)
      filtered = allMovies.filter(m =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allMovies.filter(m => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]); //retorna um array com os mesmo elementos do array filtered mas ordenado pela coluna armazenada no state sortColum.path e em ordem 'asc' para ascendente ou 'dsc' para descendente que fica armazenado em sortColum.order
    const movies = paginate(sorted, currentPage, pageSize); //retorna array com os filmes a serem exibidos na pagina atual
    return { totalCounted: filtered.length, data: movies };
  };
  render() {
    const { length: count } = this.state.movies;
    const {
      pageSize,
      currentPage,
      genres,
      sortColumn,
      searchQuery
    } = this.state;
    const { user } = this.props; //para renderizar condicionalmente um item se o usuario tiver logado, recebe o user via props
    const { totalCounted, data: movies } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          {user && (
            <Link
              to="/movies/new"
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              New Movie
            </Link>
          )}
          <p>Showing {totalCounted} movies in the database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <MoviesTable
            movies={movies}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCounted}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}
export default Movies;
