import * as moment from 'moment';
import Component from './component';

const RATING_SCORES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const ENTER_KEYCODE = 13;
const ESC_KEYCODE = 27;
const ANIMATION_DURATION = 100;
const ANIMATION_AMOUNT = 10;

class FilmDetails extends Component {
  constructor(data) {
    super();
    this._name = data.name;
    this._originalName = data.originalName;
    this._releaseDate = data.releaseDate;
    this._genre = data.genre;
    this._duration = data.duration;
    this._age = data.age;
    this._country = data.country;
    this._director = data.director;
    this._writers = data.writers;
    this._actors = data.actors;
    this._rating = data.rating;
    this._descr = data.descr;
    this._commentsCounter = data.commentsCounter;
    this._comments = data.comments;
    this._poster = data.poster;
    this._isWatched = data.isWatched;
    this._inWatchList = data.inWatchList;
    this._isFavorite = data.isFavorite;
    this._onClose = null;
    this._onSendComment = null;
    this._onUndoComment = null;
    this._onVoting = null;
    this._userComment = {};
    this._userScore = data.userScore;

    this._onAddComment = this._onAddComment.bind(this);
    this._onDeleteComment = this._onDeleteComment.bind(this);
    this._onAddScore = this._onAddScore.bind(this);
    this._onEscEvent = this._onEscEvent.bind(this);
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onChangeToWatchList = this._onChangeToWatchList.bind(this);
    this._onChangeWatched = this._onChangeWatched.bind(this);
    this._onChangeToFavorite = this._onChangeToFavorite.bind(this);
  }

  _chooseEmotion(emotion) {
    switch (emotion) {

      case `grinning`:
        return `😀`;

      case `neutral-face`:
        return `😐`;

      case `sleeping`:
        return `😴`;

      default:
        return ``;
    }
  }

  _processControls() {
    const entry = {
      isWatched: this._isWatched,
      inWatchList: this._inWatchList,
      isFavorite: this._isFavorite,
    };
    return entry;
  }

  _processForm(formData) {
    const entry = {
      userComment: {
        comment: ``,
        author: `You`,
        date: new Date().getTime(),
        emotion: ``,
      },

      userScore: ``,
    };
    const filmDetailsMapper = FilmDetails.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (filmDetailsMapper[property]) {
        filmDetailsMapper[property](value);
      }
    }
    return entry;
  }

  _onChangeToWatchList() {
    this._inWatchList = !this._inWatchList;

    if (this._inWatchList) {
      this.partialUpdate(`addToWatchList`);
    }
  }

  _onChangeWatched() {
    this._isWatched = !this._isWatched;

    if (this._isWatched) {
      this.partialUpdate(`addToWatched`);
    }
  }

  _onChangeToFavorite() {
    this._isFavorite = !this._isFavorite;
  }

  _onAddComment(evt) {
    if (evt.ctrlKey && evt.keyCode === ENTER_KEYCODE) {
      const formData = new FormData(this._element.querySelector(`.film-details__inner`));
      const newData = this._processForm(formData);
      this._element.querySelector(`#add-emoji`).checked = false;
      if (typeof this._onSendComment === `function`) {
        this._onSendComment(newData);
      }
      this.update(newData);
    }
  }

  _onDeleteComment() {
    this._comments.pop();
    const newData = this._comments;
    if (typeof this._onUndoComment === `function`) {
      this._onUndoComment(newData);
    }
  }

  _onAddScore(evt) {
    this._userScore = evt.target.value;
    const newData = this._userScore;
    if (typeof this._onVoting === `function`) {
      this._onVoting(newData);
    }
  }

  _onCloseButtonClick() {
    const newData = this._processControls();
    if (typeof this._onClose === `function`) {
      this._onClose(newData);
    }
  }

  _onEscEvent(evt) {
    const newData = this._processControls();
    if ((evt.keyCode === ESC_KEYCODE) && (typeof this._onClose === `function`)) {
      this._onClose(newData);
    }
  }

  set onClose(fn) {
    this._onClose = fn;
  }

  set onSendComment(fn) {
    this._onSendComment = fn;
  }

  set onUndoComment(fn) {
    this._onUndoComment = fn;
  }

  set onVoting(fn) {
    this._onVoting = fn;
  }

  _getCommentsTemplate() {
    return this._comments
    .map((it) => `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">${this._chooseEmotion(it.emotion)}</span>
    <div>
      <p class="film-details__comment-text">${it.comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${it.author}</span>
        <span class="film-details__comment-day">
        ${moment(it.date).startOf(`hour`).fromNow()}</span>
      </p>
    </div>
  </li>
    `);
  }

  get template() {
    return `
  <section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="${this._poster}" alt="${this._name}">
        <p class="film-details__age">Age: ${this._age === `` ? `0` : `${this._age}`}+</p>
      </div>
      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${this._name}</h3>
            <p class="film-details__title-original">Original: ${this._originalName}</p>
          </div>
          <div class="film-details__rating">
            <p class="film-details__total-rating">${this._rating}</p>
            <p class="film-details__user-rating">Your rate ${this._userScore}</p>
          </div>
        </div>
        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${this._director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${this._writers}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${this._actors}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">
            ${moment(this._releaseDate).format(`DD MMMM YYYY`)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${this._duration} min</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${this._country}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Genres</td>
            <td class="film-details__cell">
            ${this._genre}
          </td>
          </tr>
        </table>
        <p class="film-details__film-description">${this._descr}
        </p>
      </div>
    </div>
    <section class="film-details__controls">
      <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist"
      ${this._inWatchList === true ? `checked` : ``}>
      <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
      <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched"
      ${this._isWatched === true ? `checked` : ``}>
      <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
      <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite"
      ${this._isFavorite === true ? `checked` : ``}>
      <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
    </section>
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments
      <span class="film-details__comments-count">${this._commentsCounter}</span>
      </h3>
      <ul class="film-details__comments-list">
     ${this._getCommentsTemplate()}
      </ul>
      <div class="film-details__new-comment">
        <div>
          <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
          <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">
          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">😴</label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-neutral-face" value="neutral-face" checked>
            <label class="film-details__emoji-label" for="emoji-neutral-face">😐</label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-grinning" value="grinning">
            <label class="film-details__emoji-label" for="emoji-grinning">😀</label>
          </div>
        </div>
        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input"
          placeholder="← Select reaction, add comment here" name="comment"></textarea>
        </label>
      </div>
    </section>
    <section class="film-details__user-rating-wrap">
      <div class="film-details__user-rating-controls">
        <span class="film-details__watched-status film-details__watched-status--active">
        ${this._isWatched === true ? `already watched` : ``}</span>
        <button class="film-details__watched-reset visually-hidden" type="button">undo</button>
      </div>
      <div class="film-details__user-score">
        <div class="film-details__user-rating-poster">
          <img src="images/posters/blackmail.jpg" alt="film-poster" class="film-details__user-rating-img">
        </div>
        <section class="film-details__user-rating-inner">
          <h3 class="film-details__user-rating-title">${this._name}</h3>
          <p class="film-details__user-rating-feelings">How you feel it?</p>
          <div class="film-details__user-rating-score">
          ${RATING_SCORES
          .map((it) => `
          <input type="radio" name="score" class="film-details__user-rating-input visually-hidden"
          value="${it}" id="rating-${it}"
          ${it === this._userScore ? `checked` : ``}>
          <label class="film-details__user-rating-label" for="rating-${it}">${it}</label>
         `).join(``)}
          </div>
        </section>
      </div>
    </section>
  </form>
</section>
`.trim();
  }

  createListeners() {
    document.body
    .addEventListener(`keydown`, this._onEscEvent);
    this._element.querySelector(`.film-details__close-btn`)
    .addEventListener(`click`, this._onCloseButtonClick);
    this._element.querySelector(`.film-details__user-rating-score`)
    .addEventListener(`change`, this._onAddScore);
    this._element.querySelector(`.film-details__comment-input`)
    .addEventListener(`keydown`, this._onAddComment);
    this._element.querySelector(`.film-details__watched-reset`)
    .addEventListener(`click`, this._onDeleteComment);
    this._element.querySelector(`#watchlist`)
    .addEventListener(`click`, this._onChangeToWatchList);
    this._element.querySelector(`#watched`)
    .addEventListener(`click`, this._onChangeWatched);
    this._element.querySelector(`#favorite`)
    .addEventListener(`click`, this._onChangeToFavorite);
  }

  removeListeners() {
    document.body
    .removeEventListener(`keydown`, this._onEscEvent);
    this._element.querySelector(`.film-details__close-btn`)
    .removeEventListener(`click`, this._onCloseButtonClick);
    this._element.querySelector(`.film-details__user-rating-score`)
    .removeEventListener(`change`, this._onAddScore);
    this._element.querySelector(`.film-details__comment-input`)
    .removeEventListener(`keydown`, this._onAddComment);
    this._element.querySelector(`.film-details__watched-reset`)
    .removeEventListener(`click`, this._onDeleteComment);
    this._element.querySelector(`#watchlist`)
    .removeEventListener(`click`, this._onChangeToWatchList);
    this._element.querySelector(`#watched`)
    .removeEventListener(`click`, this._onChangeWatched);
    this._element.querySelector(`#favorite`)
    .removeEventListener(`click`, this._onChangeToFavorite);
  }

  partialUpdate(data) {
    if (data === `comments`) {
      this._element.querySelector(`.film-details__comments-count`)
    .innerHTML = this._commentsCounter;
      this._element.querySelector(`.film-details__watched-status`)
    .innerHTML = `Comment added`;
      this._element.querySelector(`.film-details__watched-reset`)
    .classList.remove(`visually-hidden`);
      this._element.querySelector(`.film-details__comments-list`)
    .innerHTML = this._getCommentsTemplate();
      this._element.querySelector(`.film-details__comment-label`)
     .innerHTML = `<textarea class="film-details__comment-input"
     placeholder="← Select reaction, add comment here" name="comment"></textarea>`;
    }

    if (data === `score`) {
      this._element.querySelector(`.film-details__user-rating`)
    .innerHTML = `Your rate ${this._userScore}`;
    }

    if (data === `undoComment`) {
      this._element.querySelector(`.film-details__comments-count`)
    .innerHTML = this._commentsCounter;
      this._element.querySelector(`.film-details__watched-status`)
      .innerHTML = `Comment deleted`;
      this._element.querySelector(`.film-details__watched-reset`)
    .classList.add(`visually-hidden`);
      this._element.querySelector(`.film-details__comments-list`)
    .innerHTML = this._getCommentsTemplate();
    }

    if (data === `addToWatchList`) {
      this._element.querySelector(`.film-details__watched-status`)
      .innerHTML = `will watch`;
    }

    if (data === `addToWatched`) {
      this._element.querySelector(`.film-details__watched-status`)
      .innerHTML = `already watched`;
    }

    this.removeListeners();
    this.createListeners();
  }

  update(data) {
    this._comments = data.comments;
    this._userScore = data.userScore;
    this._commentsCounter = data.commentsCounter;
  }

  updateControls(data) {
    this._inWatchList = data.inWatchList;
    this._isWatched = data.isWatched;
    this._isFavorite = data.isFavorite;
  }

  shake(element) {
    element.animate([
      {transform: `translateY(0px)`},
      {transform: `translateY(-30px)`}
    ], {
      duration: ANIMATION_DURATION,
      iterations: ANIMATION_AMOUNT
    });
  }

  static createMapper(target) {
    return {
      'comment': (value) => (target.userComment.comment = value),
      'score': (value) => (target.userScore = value),
      'comment-emoji': (value) => (target.userComment.emotion = value),
    };
  }
}

export default FilmDetails;
