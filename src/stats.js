import Component from './component';

class Stats extends Component {
  constructor(data) {
    super();
    this._filmsWatched = data.filmsWatched;
    this._totalDuration = data.totalDuration;
    this._topGenre = data.topGenre;
    this._yourRank = data.yourRank;
  }

  get template() {
    return `
    <section class="statistic visually-hidden">
    <p class="statistic__rank">Your rank <span class="statistic__rank-label">${this._yourRank}</span></p>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
         <p class="statistic__item-text watched">${this._filmsWatched}
          <span class="statistic__item-description">movies</span>
         </p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text duration">${this._totalDuration.hours}
        <span class="statistic__item-description">h</span>${this._totalDuration.min}
        <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text genre">${this._topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000">$</canvas>
    </div>
  </section>
  `.trim();
  }

  partialUpdate() {
    this._element.querySelector(`.watched`).innerHTML =
    `${this._filmsWatched} <span class="statistic__item-description">movies</span>`;
    this._element.querySelector(`.duration`).innerHTML =
    `${this._totalDuration.hours}
    <span class="statistic__item-description">h</span>
    ${this._totalDuration.min}
    <span class="statistic__item-description">m</span>`;
    this._element.querySelector(`.genre`).innerHTML = this._topGenre;
    this._element.querySelector(`.statistic__rank-label`).innerHTML = this._yourRank;
  }
}

export default Stats;
