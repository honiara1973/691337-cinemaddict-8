import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import Stats from './stats';
import StatsFilter from './stats-filter';
import ChartOptions from './chart-options';

const MIN_IN_HOUR = 60;
const MS_IN_DAY = 24 * 60 * 60 * 1000;
const MS_IN_WEEK = 7 * MS_IN_DAY;
const MS_IN_MONTH = 30 * MS_IN_DAY;
const MS_IN_YEAR = 365 * MS_IN_DAY;
const CTX_HEIGHT = 300;

const mainContainer = document.querySelector(`.main`);

const statsCounters = {
  filmsWatched: 0,
  totalDuration: {
    hours: 0,
    min: 0,
  },
  genresWatched: {
    'Sci-Fi': 0,
    'Animation': 0,
    'Comedy': 0,
    'Family': 0,
    'Adventure': 0,
    'Action': 0,
    'Drama': 0,
    'Horror': 0,
    'Thriller': 0,
  },
  ranks: {
    'Sci-Fighter': `Sci-Fi`,
    'Animation-Fan': `Animation`,
    'Comedy-Lover': `Comedy`,
    'Family-Amateur': `Family`,
    'Adventure-Lover': `Adventure`,
    'Action-Fan': `Action`,
    'Drama-Lover': `Drama`,
    'Horror-Buff': `Horror`,
    'Thriller-Fan': `Thriller`,
  },
  topGenre: ``,
  yourRank: ``,
};

const getStartDate = (filter) => {
  switch (filter) {
    case `statistic-all-time`:
      return 0;

    case `statistic-year`:
      return new Date().getTime() - MS_IN_YEAR;

    case `statistic-month`:
      return new Date().getTime() - MS_IN_MONTH;

    case `statistic-week`:
      return new Date().getTime() - MS_IN_WEEK;

    case `statistic-today`:
      return new Date().getTime() - MS_IN_DAY;

    default:
      return 0;
  }
};

const updateChartData = (chart) => {
  chart.data.datasets[0].data = Object.values(statsCounters.genresWatched);
  chart.update();
};

const getStatsCounters = (array, filter) => {
  statsCounters.filmsWatched = array.reduce((acc, it) => it.watchedDate > getStartDate(filter) ?
    acc + 1 : acc, 0);

  statsCounters.totalDuration.hours = Math.floor(array.reduce((acc, it) =>
    it.watchedDate > getStartDate(filter) ? acc + it.duration : acc, 0) / MIN_IN_HOUR);

  statsCounters.totalDuration.minutes = array.reduce((acc, it) => it.watchedDate > getStartDate(filter) ?
    acc + it.duration : acc, 0) % MIN_IN_HOUR;

  const filmsWatchedInPeriod = array.filter((it) => it.watchedDate > getStartDate(filter));

  const countFilmGenres = (genre) => {
    statsCounters.genresWatched[genre] = filmsWatchedInPeriod
      .reduce((acc, it) => [...it.genre].includes(genre) ?
        acc + 1 : acc, 0);
    return statsCounters.genresWatched[genre];
  };

  Object.keys(statsCounters.genresWatched).forEach((it) => countFilmGenres(it));

  const filmsWatchedMax = Math.max(...Object.values(statsCounters.genresWatched));
  let topGenre;
  const getTopGenre = () => {
    for (let prop in statsCounters.genresWatched) {
      if (statsCounters.genresWatched[prop] === filmsWatchedMax) {
        topGenre = prop;
      }
    }
    return topGenre;
  };

  let rank;
  const getYourRank = () => {
    for (let prop in statsCounters.ranks) {
      if (statsCounters.ranks[prop] === topGenre) {
        rank = prop;
      }
    }
    return rank;
  };

  statsCounters.topGenre = getTopGenre();
  statsCounters.yourRank = getYourRank();
};

const renderStats = (array) => {
  getStatsCounters(array);

  const stats = new Stats(statsCounters);

  mainContainer.appendChild(stats.render());
  const statsContainer = document.querySelector(`.statistic`);
  const statsTextList = statsContainer.querySelector(`.statistic__text-list`);
  statsContainer.classList.remove(`visually-hidden`);

  const statisticCtx = document.querySelector(`.statistic__chart`);
  statisticCtx.height = CTX_HEIGHT;
  const myChart = new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(statsCounters.genresWatched),
      datasets: [{
        data: Object.values(statsCounters.genresWatched),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: ChartOptions,
  });
  statisticCtx.innerHTML = myChart;

  const statsFilter = new StatsFilter();
  statsContainer.insertBefore(statsFilter.render(), statsTextList);

  document.querySelector(`.statistic__filters`)
  .addEventListener(`change`, (evt) => {
    evt.preventDefault();
    const currentStatsFilter = evt.target.id;
    getStatsCounters(array, currentStatsFilter);
    updateChartData(myChart);
    stats._filmsWatched = statsCounters.filmsWatched;
    stats._totalDuration = statsCounters.totalDuration;
    stats._topGenre = statsCounters.topGenre;
    stats._yourRank = statsCounters.yourRank;
    stats.partialUpdate();
  });
};

export default renderStats;
