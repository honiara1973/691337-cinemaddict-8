import Component from './component';

const RATING_SCORES = [`1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`];

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
    this._comments = data.comments;
    this._poster = data.poster;
    this._onClose = null;
    this._userComment = data.userComment;
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
  }

  _processForm(formData) {
    const entry = {
      userComment: ``,
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

  _onCloseButtonClick() {

    const formData = new FormData(this._element.querySelector(`.film-details__inner`));
    const newData = this._processForm(formData);
    if (typeof this._onClose === `function`) {
      this._onClose(newData);
    }
    this.update(newData);
  }

  set onClose(fn) {
    this._onClose = fn;
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

        <p class="film-details__age">${this._age}</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${this._name}</h3>
            <p class="film-details__title-original">Original: ${this._originalName}</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">${this._rating}</p>
            <p class="film-details__user-rating">Your rate 8</p>
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
            <td class="film-details__cell">${this._releaseDate}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${this._duration}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${this._country}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Genres</td>
            <td class="film-details__cell">
            ${this._genre
            .map((it) =>
              `<span class="film-details__genre">${it}</span>`)
            .join(``)}
            </td>
          </tr>
        </table>

        <p class="film-details__film-description">${this._descr}
        </p>
      </div>
    </div>

    <section class="film-details__controls">
      <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
      <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

      <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" checked>
      <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

      <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
      <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
    </section>

    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments
      <span class="film-details__comments-count">${this._comments}</span>
      </h3>

      <ul class="film-details__comments-list">
        <li class="film-details__comment">
          <span class="film-details__comment-emoji">😴</span>
          <div>
            <p class="film-details__comment-text">So long-long story, boring!</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">Tim Macoveev</span>
              <span class="film-details__comment-day">3 days ago</span>
            </p>
          </div>
        </li>
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
          placeholder="← Select reaction, add comment here" name="comment">
          ${this._userComment}</textarea>
        </label>
      </div>
    </section>

    <section class="film-details__user-rating-wrap">
      <div class="film-details__user-rating-controls">
        <span class="film-details__watched-status film-details__watched-status--active">Already watched</span>
        <button class="film-details__watched-reset" type="button">undo</button>
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
          value="${it}" id="rating-${it}">
          <label class="film-details__user-rating-label" for="rating-${it}">${it}</label>
         `).join(``)}
          </div>

        </section>
      </div>
    </section>
  </form>
</section>`.trim();
  }

  createListeners() {
    this._element.querySelector(`.film-details__close-btn`)
    .addEventListener(`click`, this._onCloseButtonClick);
  }

  removeListeners() {
    this._element.querySelector(`.film-details__close-btn`)
    .removeEventListener(`click`, this._onCloseButtonClick);
  }

  update(data) {
    this._userComment = data.userComment;
  }

  static createMapper(target) {
    return {
      comment: (value) => (target.userComment = value),
    };
  }

}

export default FilmDetails;
