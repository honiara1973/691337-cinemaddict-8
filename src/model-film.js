class ModelFilm {
  constructor(data) {
    this.id = data[`id`];
    this.name = data[`film_info`][`title`] || ``;
    this.genre = data[`film_info`][`genre`] || ``;
    this.duration = data[`film_info`][`runtime`] || ``;
    this.originalName = data[`film_info`][`alternative_title`] || ``;
    this.descr = data[`film_info`][`description`] || ``;
    this.actors = data[`film_info`][`actors`] || [];
    this.age = data[`film_info`][`age-rating`] || ``;
    this.director = data[`film_info`][`director`] || ``;
    this.writers = data[`film_info`][`writers`] || [];
    this.releaseDate = data[`film_info`][`release`][`date`] || ``;
    this.country = data[`film_info`][`release`][`release_country`] || ``;
    this.rating = data[`film_info`][`total_rating`] || ``;
    this.comments = data[`comments`] || [];
    this.comments.author = data[`comments`][0][`author`] || [];
    this.comments.text = data[`comments`][0][`comment`] || [];
    this.poster = data[`film_info`][`poster`];
    this.commentsCounter = data[`comments`].length;
    //this.state.isWatched = data[`user_details`][`already_watched`];
    //this.state.inWatchList = data[`user_details`][`watchlist`];
    //this.state.isFavorite = data[`user_details`][`favorite`];
    this.userScore = Math.floor(data[`user_details`][`personal_rating`]);
    this.userComment = {};
  }

  static parseFilm(data) {
    return new ModelFilm(data);
  }

  static parseFilms(data) {
    return data.map(ModelFilm.parseFilm);
  }

}

export default ModelFilm;
