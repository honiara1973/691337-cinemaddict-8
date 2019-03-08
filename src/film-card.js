import makeFilmCard from './make-card';

class FilmCard {
  constructor(data) {
    this._name = data.name;
    this._year = data.year;
    this._genre = data.genre;
    this._duration = data.duration;
    this._rating = data.rating;
    this._descr = data.descr;
    this._poster = data.poster;
    this._element = null;
    this._controls = false;
    this._comments = data.comments;
  }

  _onCommentsButtonClick() {
    if (typeof this._comments === `function`) {
      this._comments();
    }
  }

  set onComments(fn) {
    this._comments = fn;
  }

  set hasControls(boolean) {
    this._controls = boolean;
  }

  get template() {
    return `
    <article
     ${this._controls ?
    `class="film-card"
    ` : `
    class="film-card film-card--no-controls"
    `}>
      <h3 class="film-card__title">${this._name}</h3>
      <p class="film-card__rating">${this._rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${this._year}</span>
        <span class="film-card__duration">${this._duration}</span>
        <span class="film-card__genre">${this._genre}</span>
      </p>
      <img src="${this._poster}" alt="" class="film-card__poster">
      ${this._controls ? `
        <p class="film-card__description">
         ${this._descr}</p>
         ` : ``}
      <button class="film-card__comments">${this._comments} comments</button>
      ${this._controls ? `
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
      ` : ``}
    </article>
    `.trim();
  }

  render(boolean) {
    this.hasControls = boolean;
    this._element = makeFilmCard(this.template);
    this.bind();
    return this._element;
  }

  bind() {
    this._element.querySelector(`.film-card__comments`)
    .addEventListener(`click`, this._onCommentsButtonClick.bind(this));
  }
}

export default FilmCard;
