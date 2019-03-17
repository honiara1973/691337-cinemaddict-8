import Component from './component';
import * as moment from 'moment';
import {minToHours} from './utils';

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
    this._controls = false;
    this._commentsCounter = data.commentsCounter;

    this._onCommentsButtonClick = this._onCommentsButtonClick.bind(this);
  }

  _onCommentsButtonClick() {
    if (typeof this._commentsCounter === `function`) {
      this._commentsCounter();
    }
  }

  set onComments(fn) {
    this._commentsCounter = fn;
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
        <span class="film-card__year">${moment(this._releaseDate).format(`YYYY`)}</span>
        <span class="film-card__duration">
        ${minToHours(this._duration)}</span>
        ${this._genre
        .map((it) =>
          `<span class="film-card__genre">${it}</span>`)
        .join(``)}
      </p>
      <img src="${this._poster}" alt="" class="film-card__poster">
      ${this._controls ? `
        <p class="film-card__description">
         ${this._descr}</p>
         ` : ``}
      <button class="film-card__comments">${this._commentsCounter} comments</button>
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

  partialUpdate(data) {
    this._element.querySelector(`.film-card__comments`).
    innerHTML = `${data.commentsCounter} comments`;
  }

  render(boolean) {
    this.hasControls = boolean;
    return super.render();
  }

  createListeners() {
    this._element.querySelector(`.film-card__comments`)
    .addEventListener(`click`, this._onCommentsButtonClick);
  }

}

export default FilmCard;
