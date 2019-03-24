// import makeFilterElement from './make-filter';
import Filter from './filter';
import FilmCard from './film-card';
import FilmDetails from './film-details';
import getAllFilters from './filter-data';
import getAllFilms from './film-data';
import Stats from './stats';
import statsData from './stats-data';
import StatsFilter from './stats-filter';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
// import {getRandomInt} from './utils';

// const CARDS_AMOUNT_INITIAL = 7;
// const CARDS_AMOUNT_TOP = 2;
const MIN_IN_HOUR = 60;
const allFilms = getAllFilms();
const allFilters = getAllFilters();

// const Filters = [`All movies`, `Watchlist`, `History`, `Favorites`, `Stats`];

const mainContainer = document.querySelector(`.main`);
const filmsContainer = document.querySelector(`.films`);
const filterContainer = document.querySelector(`.main-navigation`);
const filmsListContainer = document.querySelector(`.films-list .films-list__container`);
const filmsListExtras = [...document.querySelectorAll(`.films-list--extra .films-list__container`)];

const Counters = {
  isWatched: 0,
  totalDuration: 0,

  genresWatched: {
    'Sci-Fi': 0,
    'Animation': 0,
    'Fantasy': 0,
    'Comedy': 0,
    'TV Series': 0,
  },

};

const renderFilter = (data) => {
  const filter = new Filter(data);

  filterContainer.appendChild(filter.render());
};

const renderStats = (data) => {
  const stats = new Stats(data);

  mainContainer.appendChild(stats.render());
  const statsContainer = document.querySelector(`.statistic`);
  const statsTextList = statsContainer.querySelector(`.statistic__text-list`);
  statsContainer.classList.remove(`visually-hidden`);

  const statsFilter = new StatsFilter();
  statsContainer.insertBefore(statsFilter.render(), statsTextList);

  const statisticCtx = document.querySelector(`.statistic__chart`);
  const BAR_HEIGHT = 50;
  statisticCtx.height = BAR_HEIGHT * 5;

  const myChart = new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: [`Sci-Fi`, `Animation`, `Fantasy`, `Comedy`, `TV Series`],
      datasets: [{
        data: [Counters.genresWatched[`Sci-Fi`], Counters.genresWatched.Animation,
          Counters.genresWatched.Fantasy, Counters.genresWatched.Comedy,
          Counters.genresWatched[`TV Series`]],
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });

  statisticCtx.innerHTML = myChart;
};

const renderFilmCard = (container, data, boolean) => {
  const film = new FilmCard(data);
  const filmDetails = new FilmDetails(data);

  container.appendChild(film.render(boolean));

  film.onComments = () => {
    document.body.appendChild(filmDetails.render());
  };

  film.onAddToWatchList = (newObject) => {
    data.state.inWatchList = newObject.state.inWatchList;
  };

  film.onMarkAsWatched = (newObject) => {
    data.state.isWatched = newObject.state.isWatched;
    Counters.isWatched = allFilms.reduce((acc, it) => it.state.isWatched === true ?
      acc + 1 : acc, 0);
    Counters.totalDuration = allFilms.reduce((acc, it) => it.state.isWatched === true ?
      acc + it.duration : acc, 0);
    statsData.isWatchedCounter = Counters.isWatched;
    statsData.totalDuration.hours = Math.floor(Counters.totalDuration / MIN_IN_HOUR);
    statsData.totalDuration.min = Counters.totalDuration % MIN_IN_HOUR;

    const filmsWatched = allFilms.filter((it) => it.state.isWatched === true);

    const countFilmGenres = (genre) => {
      Counters.genresWatched[genre] = filmsWatched.reduce((acc, it) => it.genre === genre ?
        acc + 1 : acc, 0);
      return Counters.genresWatched[genre];
    };

    Counters.genresWatched[`Sci-Fi`] = filmsWatched.reduce((acc, it) => it.genre === `Sci-Fi` ?
      acc + 1 : acc, 0);
    Counters.genresWatched.Animation = filmsWatched.reduce((acc, it) => it.genre === `Animation` ?
      acc + 1 : acc, 0);
    Counters.genresWatched.Fantasy = filmsWatched.reduce((acc, it) => it.genre === `Fantasy` ?
      acc + 1 : acc, 0);
    Counters.genresWatched.Comedy = filmsWatched.reduce((acc, it) => it.genre === `Comedy` ?
      acc + 1 : acc, 0);
    Counters.genresWatched[`TV Series`] = filmsWatched.reduce((acc, it) => it.genre === `TV Series` ?
      acc + 1 : acc, 0);

    statsData.genresWatched = Counters.genresWatched;

    const filmsWatchedMax = Math.max(...Object.values(Counters.genresWatched));

    let topGenre;

    const getTopGenre = () => {

      for (let prop in Counters.genresWatched) {
        if (Counters.genresWatched[prop] === filmsWatchedMax) {
          topGenre = prop;
        }
      }
      return topGenre;
    };

    statsData.topGenre = getTopGenre();


    console.log(statsData.topGenre);

    // console.log(data.state.isWatched);
    // console.log(Counters.totalDuration);
    console.log(Counters.genresWatched.Animation);
    console.log(statsData.genresWatched.Animation);
  };

  film.onAddToFavorite = (newObject) => {
    data.state.isFavorite = newObject.state.isFavorite;
  };

  filmDetails.onClose = (newObject) => {
    data.userComment = newObject.userComment;
    data.commentsCounter = newObject.commentsCounter;
    film.partialUpdate(data);
    document.body.removeChild(document.body.lastChild);
    filmDetails.unrender();
  };

};

const createFilterElements = () => {
  allFilters
  .forEach((it) => renderFilter(it));
};

const getFilmCards = (container, filmsList, boolean) => {
  filmsList.forEach((it) => renderFilmCard(container, it, boolean));
};

const getEventFilter = (evt) => {
  const filterCaptions = {
    all: document.querySelector(`a[href=all]`),
    watchlist: document.querySelector(`a[href=watchlist]`),
    history: document.querySelector(`a[href=history]`),
    favorites: document.querySelector(`a[href=favorites]`),
    stats: document.querySelector(`a[href=stats]`),
  };

  let filterCaption;

  for (let prop in filterCaptions) {
    if (evt.target === filterCaptions[prop]) {
      filterCaption = prop;
    }
  }
  return filterCaption;
};

const filterFilms = (films, filterName) => {

  switch (filterName) {
    case `all`:
      return allFilms;

    case `watchlist`:
      return allFilms.filter((it) => it.state.inWatchList === true);

    case `history`:
      return allFilms.filter((it) => it.state.isWatched === true);

    case `favorites`:
      return allFilms.filter((it) => it.state.isFavorite === true);

    default:
      return [];
  }
};

const init = () => {
  createFilterElements();

  getFilmCards(filmsListContainer, allFilms.slice(0, 6), true);
  filmsListExtras.forEach((it) => getFilmCards(it, allFilms.slice(0, 2), false));

  filterContainer.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    const newFilter = evt.target;
    const currentFilter = filterContainer.querySelector(`.main-navigation__item--active`);
    currentFilter.classList.remove(`main-navigation__item--active`);
    newFilter.classList.add((`main-navigation__item--active`));

    while (filmsListContainer.firstChild) {
      filmsListContainer.removeChild(filmsListContainer.firstChild);
    }

    const statsContainer = document.querySelector(`.statistic`);
    if (statsContainer) {
      mainContainer.removeChild(mainContainer.lastChild);
    }

    if (filmsContainer.classList.contains(`visually-hidden`)) {
      filmsContainer.classList.remove(`visually-hidden`);
    }

    const filterCaption = getEventFilter(evt);

    if (filterCaption === `stats`) {
      filmsContainer.classList.add(`visually-hidden`);
      renderStats(statsData);
    }

    const filteredFilms = filterFilms(allFilms, filterCaption);
    getFilmCards(filmsListContainer, filteredFilms, true);

    // getFilmCards(filmsListContainer, getRandomInt(1, 10), false);
  });

};

init();
