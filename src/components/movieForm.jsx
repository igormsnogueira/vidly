import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getMovie, saveMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";

class MovieForm extends Form {
  state = {
    data: { title: "", genreId: "", numberInStock: "", dailyRentalRate: "" },
    genres: [],
    errors: {}
  };
  schema = {
    _id: Joi.string(),
    title: Joi.string()
      .required()
      .label("Title"),
    genreId: Joi.string()
      .required()
      .label("Genre"),
    numberInStock: Joi.number()
      .required()
      .min(0)
      .max(100)
      .label("Number in Stock"),
    dailyRentalRate: Joi.number()
      .required()
      .min(0)
      .max(10)
      .label("Daily Rental Rate")
  };
  async populateGenres() {
    const { data: genres } = await getGenres(); //pega os genres para renderizar a lista com opções dos generos 'Genre'
    this.setState({ genres }); //atualiza o state genres com os genres pegados no banco
  }
  async populateMovies() {
    try {
      const movieId = this.props.match.params.id; //pega por props o id passado na url
      if (movieId === "new") return; //se o id for new, é pq quer criar um filme novo com o formulario, logo sai da função nao precisa renderizar os dados do filme

      const { data: movie } = await getMovie(movieId); //se nao for new, eu tento buscar no banco o filme com esse id pra renderizar os dados no formulario
      this.setState({ data: this.mapToViewModel(movie) }); //atualiza o state data com um metodo que retorna os dados que chegaram do servidor organizados no formato que o data tem que estar, e só com os dados que usaremos
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found"); //se nao achar o filme com esse id, redireciono para a pagina de not found
    }
  }
  async componentDidMount() {
    //como queremos exibir os dados no formulario do filme clicado, antes temos que pegar eles no servidor
    await this.populateGenres();
    await this.populateMovies();
  }
  mapToViewModel = movie => {
    //prepara os dados que chegam do servidor com o movie, e organiza pegando apenas o que interessa e atribuindo aos atributos para atualizar o state data
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate
    };
  };
  doSubmit = async () => {
    await saveMovie(this.state.data); //'comunicação com o servidor', salvando dados atualizados, vem do fakeMovie service
    this.props.history.push("/movies"); //apos salvar é redirecionado para a pagina com a tabela de filmes
  };
  render() {
    return (
      <div>
        <h1> MovieForm </h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title")}
          {this.renderSelect("genreId", "Genre", this.state.genres)}
          {this.renderInput("numberInStock", "Number In Stock", "number")}
          {this.renderInput("dailyRentalRate", "Rate")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default MovieForm;
