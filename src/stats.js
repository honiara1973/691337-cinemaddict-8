import Component from './component';
// import MyChart from './my-chart';

class Stats extends Component {
  constructor(data) {
    super();
    this._isWatchedCounter = data.isWatchedCounter;
    this._totalDuration = data.totalDuration;
    this._topGenre = data.topGenre;
  }

  get template() {
    return `
    <section class="statistic">
    <p class="statistic__rank">Your rank <span class="statistic__rank-label">Sci-Fighter</span></p>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
  <p class="statistic__item-text">${this._isWatchedCounter}
  <span class="statistic__item-description">movies</span>
  </p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${this._totalDuration.hours}
        <span class="statistic__item-description">h</span>${this._totalDuration.min}
        <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${this.topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>
`.trim();
  }
}

export default Stats;
