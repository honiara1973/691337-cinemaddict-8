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
    this.userScore = data[`user_details`][`personal_rating`] || ``;
    this.poster = data[`film_info`][`poster`];
  }

  static parseFilm(data) {
    return new ModelFilm(data);
  }

  static parseFilms(data) {
    return data.map(ModelFilm.parseFilm);
  }

}

export default ModelFilm;
