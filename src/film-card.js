import Component from './component';
import * as moment from 'moment';

const MIN_IN_HOUR = 60;

class FilmCard extends Component {
  constructor(data) {
    super();
    this._name = data.name;
    this._releaseDate = data.releaseDate;
    this._genre = data.genre;
    this._duration = data.duration;
    this._rating = data.rating;
    this._descr = data.descr;
    this._poster = data.poster;
    this._commentsCounter = data.commentsCounter;
    this._onControls = false;
    this._isWatched = data.isWatched;
    this._inWatchList = data.inWatchList;
    this._isFavorite = data.isFavorite;

    this._onCommentsButtonClick = this._onCommentsButtonClick.bind(this);
    this._onAddToWatchList = this._onAddToWatchList.bind(this);
    this._onMarkAsWatched = this._onMarkAsWatched.bind(this);
    this._onAddToFavorite = this._onAddToFavorite.bind(this);
  }

  _processControls() {
    const entry = {
      isWatched: this._isWatched,
      inWatchList: this._inWatchList,
      isFavorite: this._isFavorite,
    };
    return entry;
  }

  _onCommentsButtonClick() {
    if (typeof this._commentsCounter === `function`) {
      this._commentsCounter();
    }
  }

  _onAddToWatchList(evt) {
    evt.preventDefault();
    this._inWatchList = !this._inWatchList;
    const newData = this._processControls();
    if (typeof this._onAddToWatchList === `function`) {
      this._onAddToWatchList(newData);
    }
    this.update(newData);
  }

  _onMarkAsWatched(evt) {
    evt.preventDefault();
    this._isWatched = !this._isWatched;
    const newData = this._processControls();
    if (typeof this._onMarkAsWatched === `function`) {
      this._onMarkAsWatched(newData);
    }
    this.update(newData);
  }

  _onAddToFavorite(evt) {
    evt.preventDefault();
    this._isFavorite = !this._isFavorite;
    const newData = this._processControls();
    if (typeof this._onAddToFavorite === `function`) {
      this._onAddToFavorite(newData);
    }
    this.update(newData);
  }

  set onComments(fn) {
    this._commentsCounter = fn;
  }

  set onAddToWatchList(fn) {
    this._onAddToWatchList = fn;
  }

  set onMarkAsWatched(fn) {
    this._onMarkAsWatched = fn;
  }

  set onAddToFavorite(fn) {
    this._onAddToFavorite = fn;
  }

  set hasControls(boolean) {
    this._onControls = boolean;
  }

  get template() {
    return `
    <article
     ${this._onControls ?
    `class="film-card"
    ` : `
    class="film-card film-card--no-controls"
    `}>
      <h3 class="film-card__title">${this._name}</h3>
      <p class="film-card__rating">${this._rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${moment(this._releaseDate).format(`YYYY`)}</span>
        <span class="film-card__duration">
        ${Math.floor(this._duration / MIN_IN_HOUR)}h ${this._duration % MIN_IN_HOUR}m
        </span>
        ${this._genre.join(`, `)}
       </p>
      <img src="${this._poster}" alt="" class="film-card__poster">
      ${this._onControls ? `
        <p class="film-card__description">
         ${this._descr}</p>
         ` : ``}
      <button class="film-card__comments">${this._commentsCounter} comments</button>
      ${this._onControls ? `
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">
        Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">
        Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">
        Mark as favorite</button>
      </form>
      ` : ``}
    </article>
    `.trim();
  }

  partialUpdate(data) {
    this._element.querySelector(`.film-card__comments`).
    innerHTML = `${data.commentsCounter} comments`;
  }

  render(boolean) {
    this.hasControls = boolean;
    return super.render();
  }

  update(data) {
    this._inWatchList = data.inWatchList;
    this._isWatched = data.isWatched;
    this._isFavorite = data.isFavorite;

  }

  createListeners() {
    this._element.querySelector(`.film-card__comments`)
    .addEventListener(`click`, this._onCommentsButtonClick);

    if (this._onControls) {
      this._element.querySelector(`.film-card__controls-item--add-to-watchlist`)
    .addEventListener(`click`, this._onAddToWatchList);
      this._element.querySelector(`.film-card__controls-item--mark-as-watched`)
    .addEventListener(`click`, this._onMarkAsWatched);
      this._element.querySelector(`.film-card__controls-item--favorite`)
    .addEventListener(`click`, this._onAddToFavorite);
    }
  }
}

export default FilmCard;
