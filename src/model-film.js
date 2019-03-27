class ModelFilm {
  constructor(data) {
    this.id = data[`id`];
    this.name = data[`title`] || ``;
    this.genre = data[`genre`];
  }

  static parseFilm(data) {
    return new ModelFilm(data);
  }

  static parseFilms(data) {
    return data.map(ModelFilm.parseFilm);
  }

}

export default ModelFilm;
