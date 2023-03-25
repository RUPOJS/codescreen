import React, { Component } from 'react';
import './style.css';
import axios from 'axios';

const filmsEndpointURL = "https://app.codescreen.com/api/assessments/films";

//Your API token. This is needed to successfully authenticate when calling the films endpoint. 
//This needs to be added to the Authorization header (using the Bearer authentication scheme) in the request you send to the films endpoint.
const apiToken = "8c5996d5-fb89-46c9-8821-7063cfbc18b1";

const config = {
  headers: { Authorization: `Bearer ${apiToken}` }
};


export default class Films extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enteredValue: "",
      directorName: "",
      showError: false,
      isDataFetched: false,
      longestFilm: null,
      averageRating: null,
      bestRatedFilm: null,
      shortestDateDiff: null,
    }
    this.handleInputTextChange = this.handleInputTextChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.getAllFilmsByDirector = this.getAllFilmsByDirector.bind(this);
    this.getBestRatedFilm = this.getBestRatedFilm.bind(this);
    this.getLongestFilm = this.getLongestFilm.bind(this);
    this.getAverageRating = this.getAverageRating.bind(this);
    this.getShortestNumberOfDaysBetweenFilmReleases = this.getShortestNumberOfDaysBetweenFilmReleases.bind(this);
    this.dateDiffInDays = this.dateDiffInDays.bind(this);
  };

  componentDidMount() {
  };

  handleInputTextChange = (event) => {
    console.log(event.target.value);
    this.setState({ enteredValue: event.target.value });
    // setEnteredValue(event.target.value);
  };

  handleFormSubmit = (event) => {
    event.preventDefault();
    this.setState({ showError: false });
    if (this.state.enteredValue === ``) {
      this.setState({ showError: true });
      return;
    }
    this.setState({ directorName: this.state.enteredValue });
    this.getAllFilmsByDirector(this.state.enteredValue);
  };

  dateDiffInDays = (a, b) => {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }


  getAllFilmsByDirector = (directorName) => {
    const self = this;
    axios.get(filmsEndpointURL + `?directorName=` + directorName, config)
      .then(function (response) {
        console.log(response);
        let films = response.data || ``;
        const bestRatedFilm = self.getBestRatedFilm(films);
        const longestFilm = self.getLongestFilm(films);
        const averageRating = self.getAverageRating(films);
        const shortestDateDiff = self.getShortestNumberOfDaysBetweenFilmReleases(films);
        self.setState({
          isDataFetched: true,
          longestFilm: longestFilm,
          averageRating: averageRating,
          bestRatedFilm: bestRatedFilm,
          shortestDateDiff: shortestDateDiff,
        })
      })
      .catch(function (error) {
        console.log(error);
      })
  };
  /**
    * Retrieves the name of the best rated film from the given list of films.
    * If the given list of films is empty, this method should return "N/A".
  */
  getBestRatedFilm(films) {
    if (!films || films === `` || !films.length) {
      return `N/A`;
    }
    return films.sort((a, b) => b.rating - a.rating)[0][`name`];
  };

  /**
    * Retrieves the length of the film which has the longest running time from the given list of films.
    * If the given list of films is empty, this method should return "N/A".
    * 
    * The return value from this function should be in the form "{length} mins"
    * For example, if the duration of the longest film is 120, this function should return "120 mins".
  */
  getLongestFilm(films) {
    if (!films || films === `` || !films.length) {
      return `N/A`;
    }
    return films.sort((a, b) => b.length - a.length)[0][`length`] + ` mins`;
  }

  /**
    * Retrieves the average rating for the films from the given list of films, rounded to 1 decimal place.
    * If the given list of films is empty, this method should return 0.
  */
  getAverageRating(films) {
    if (!films || films === `` || !films.length) {
      return `N/A`;
    }
    let averageArr = [];
    averageArr = films.map(film => {
      return film.rating;
    });
    return Number((averageArr.reduce((acc, current) => acc + current, 0) / averageArr.length).toFixed(1));
  }

  /**
    * Retrieves the shortest number of days between any two film releases from the given list of films.
    * 
    * If the given list of films is empty, this method should return "N/A".
    * If the given list contains only one film, this method should return 0.
    * Note that no director released more than one film on any given day.
    * 
    * For example, if the given list is composed of the following 3 entries
    *
    * {
    *    "name": "Batman Begins",
    *    "length": 140,
    *
    *    "rating": 8.2,
    *    "releaseDate": "2006-06-16",
    *    "directorName": "Christopher Nolan"
    * },
    * {
    *    "name": "Interstellar",
    *    "length": 169,
    *    "rating": 8.6,
    *    "releaseDate": "2014-11-07",
    *    "directorName": "Christopher Nolan"
    * },
    * {
    *   "name": "Prestige",
    *   "length": 130,
    *   "rating": 8.5,
    *   "releaseDate": "2006-11-10",
    *   "directorName": "Christopher Nolan"
    * }
    *
    * then this method should return 147, as Prestige was released 147 days after Batman Begins.
  */
  getShortestNumberOfDaysBetweenFilmReleases(films) {
    if (!films || films === `` || !films.length) {
      return `N/A`;
    }
    if (films.length === 1) {
      return 0;
    }
    let releaseDateArr = films.map(film => {
      return new Date(film.releaseDate);
    }).sort((a, b) => +new Date(a) - +new Date(b));
    let diffDateArr = [];
    releaseDateArr.forEach((item, index) => {
      if (index === 0) {
        diffDateArr.push(Math.abs(this.dateDiffInDays(item, releaseDateArr[index + 1])))
      } else if (index === releaseDateArr.length - 1) {
        diffDateArr.push(Math.abs(this.dateDiffInDays(item, releaseDateArr[index - 1])))
      } else {
        diffDateArr.push(Math.abs(Math.min(this.dateDiffInDays(item, releaseDateArr[index + 1]), this.dateDiffInDays(item, releaseDateArr[index - 1]))));
      }
    })
    return diffDateArr.sort((a, b) => a - b)[0];
    //TODO Implement
  }

  render() {
    return (
      <>
        <div className="films-analysis-form-container">
          <form name="input-form" id="input-form" onSubmit={this.handleFormSubmit}>
            <input type="text" className={`${this.state.showError ? `director-name-input-box validation-error-input` : `director-name-input-box`}`} id="input-box" name="input-box" placeholder="Enter director name" onChange={this.handleInputTextChange} />
            {this.state.showError && <small className="film-analysis-validation-err">Please enter a valid value</small>}
            <input type="submit" className="submit-button" value="SUBMIT" />
          </form>
        </div>
        {this.state.isDataFetched && <div className="film-analysis-result-container stats-boxes">
          <div className="stats-box  film-analysis-result-card best-rated-film">
            <div className="stats-box-heading">Best Rated film</div>
            <div className="stats-box-info" id="best-rated-film">{this.state.bestRatedFilm}</div>
          </div>
          <div className="stats-box film-analysis-result-card longest-film">
            <div className="stats-box-heading">Longest film duration</div>
            <div className="stats-box-info" id="longest-film">{this.state.longestFilm}</div>
          </div>
          <div className="stats-box film-analysis-result-card average-rating">
            <div className="stats-box-heading">Average rating</div>
            <div className="stats-box-info" id="average-rating">{this.state.averageRating}</div>
          </div>
          <div className="stats-box film-analysis-result-card shortest-release-date-diff">
            <div className="stats-box-heading">Shortest days between release</div>
            <div className="stats-box-info" id="shortest-days">{this.state.shortestDateDiff}</div>
          </div>
        </div>}
      </>
    )
  }

}
