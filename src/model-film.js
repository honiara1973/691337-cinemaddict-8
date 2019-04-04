class ModelFilm {
  constructor(data) {
    this.id = data[`id`];
    this.name = data[`film_info`][`title`] || ``;
    this.genre = data[`film_info`][`genre`] || ``;
    this.duration = data[`film_info`][`runtime`] || ``;
    this.originalName = data[`film_info`][`alternative_title`] || ``;
    this.descr = data[`film_info`][`description`] || ``;
    this.actors = data[`film_info`][`actors`] || [];
    this.age = data[`film_info`][`age_rating`] || ``;
    this.director = data[`film_info`][`director`] || ``;
    this.writers = data[`film_info`][`writers`] || [];
    this.releaseDate = data[`film_info`][`release`][`date`] || ``;
    this.country = data[`film_info`][`release`][`release_country`] || ``;
    this.rating = data[`film_info`][`total_rating`] || ``;
    this.comments = data[`comments`] || [];
    this.comments.author = data[`comments`][`author`] || ``;
    this.comments.comment = data[`comments`][`comment`] || ``;
    this.comments.date = data[`comments`][`date`] || ``;
    this.comments.emotion = data[`comments`][`emotion`] || ``;
    this.poster = data[`film_info`][`poster`];
    this.commentsCounter = data[`comments`].length;
    this.isWatched = data[`user_details`][`already_watched`];
    this.inWatchList = data[`user_details`][`watchlist`];
    this.isFavorite = data[`user_details`][`favorite`];
    this.userScore = Math.floor(data[`user_details`][`personal_rating`]);
  }

  toRAW() {
    return {
      'id': this.id,
      'user_details': {
        'already_watched': this.isWatched,
        'watchlist': this.inWatchList,
        'favorite': this.isFavorite,
        'personal_rating': this.userScore,
      },
      'comments': this.comments,
    };
  }

  static parseFilm(data) {
    return new ModelFilm(data);
  }

  static parseFilms(data) {
    return data.map(ModelFilm.parseFilm);
  }

}

export default ModelFilm;
