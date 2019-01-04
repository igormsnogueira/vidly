import React, { Component } from "react";
import { getGenres } from "../services/fakeGenreService";

class Genre extends Component {
  state = {
    genres: getGenres(),
    currentGenre: getGenres()[0]
  };
  handleGenre = genre => {
    this.setState({ currentGenre: genre });
  };
  render() {
    const { genres, currentGenre } = this.state;
    console.log(currentGenre);
    return (
      <ul className="list-group">
        <li
          className="list-group-item"
          onClick={() => this.handleGenre(genres)}
        >
          All genres
        </li>
        {genres.map(genre => (
          <li
            key={genre.name}
            className={
              genre._id === currentGenre._id
                ? "list-group-item active"
                : "list-group-item"
            }
            onClick={() => this.handleGenre(genre)}
          >
            {genre.name}
          </li>
        ))}
      </ul>
    );
  }
}

export default Genre;
