import API from './api';
import Filter from './filter';
import FilmCard from './film-card';
import FilmDetails from './film-details';
import getAllFilters from './filter-data';
import Stats from './stats';
import StatsFilter from './stats-filter';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import chartOptions from './my-chart';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;

const MIN_IN_HOUR = 60;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
let allFilms;
const allFilters = getAllFilters();

const mainContainer = document.querySelector(`.main`);
const filmsContainer = document.querySelector(`.films`);
const filterContainer = document.querySelector(`.main-navigation`);
const filmsListContainer = document.querySelector(`.films-list .films-list__container`);
const filmsListExtras = [...document.querySelectorAll(`.films-list--extra .films-list__container`)];

const Counters = {
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

const renderFilter = (data) => {
  const filter = new Filter(data);

  filterContainer.appendChild(filter.render());
};

const renderStats = (data) => {
  Counters.filmsWatched = allFilms.reduce((acc, it) => it.isWatched === true ?
    acc + 1 : acc, 0);

  Counters.totalDuration.hours = Math.floor(allFilms.reduce((acc, it) => it.isWatched === true ?
    acc + it.duration : acc, 0) / MIN_IN_HOUR);

  Counters.totalDuration.minutes = allFilms.reduce((acc, it) => it.isWatched === true ?
    acc + it.duration : acc, 0) % MIN_IN_HOUR;

  const filmsWatched = allFilms.filter((it) => it.isWatched === true);

  const countFilmGenres = (genre) => {
    Counters.genresWatched[genre] = filmsWatched
    .reduce((acc, it) => [...it.genre].includes(genre) ?
      acc + 1 : acc, 0);
    return Counters.genresWatched[genre];
  };

  Object.keys(Counters.genresWatched).forEach((it) => countFilmGenres(it));

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

  let rank;
  const getYourRank = () => {

    for (let prop in Counters.ranks) {
      if (Counters.ranks[prop] === topGenre) {
        rank = prop;
      }
    }
    return rank;
  };

  Counters.topGenre = getTopGenre();
  Counters.yourRank = getYourRank();

  const stats = new Stats(data);

  mainContainer.appendChild(stats.render());
  const statsContainer = document.querySelector(`.statistic`);
  const statsTextList = statsContainer.querySelector(`.statistic__text-list`);
  statsContainer.classList.remove(`visually-hidden`);

  const statsFilter = new StatsFilter();
  statsContainer.insertBefore(statsFilter.render(), statsTextList);

  const statisticCtx = document.querySelector(`.statistic__chart`);
  const BAR_HEIGHT = 60;
  statisticCtx.height = BAR_HEIGHT * 5;

  const myChart = new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(Counters.genresWatched),
      datasets: [{
        data: Object.values(Counters.genresWatched),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: chartOptions,
  });

  statisticCtx.innerHTML = myChart;
};

const renderFilmCard = (container, filmData, boolean) => {
  const film = new FilmCard(filmData);
  const filmDetails = new FilmDetails(filmData);

  container.appendChild(film.render(boolean));

  film.onComments = () => {
    document.body.appendChild(filmDetails.render());
  };

  film.onAddToWatchList = (newObject) => {
    filmData.inWatchList = newObject.inWatchList;
  };

  film.onMarkAsWatched = (newObject) => {
    filmData.isWatched = newObject.isWatched;
    //console.log(filmData.isWatched);
  };

  film.onAddToFavorite = (newObject) => {
    filmData.isFavorite = newObject.isFavorite;
  };

  filmDetails.onSendComment = (newObject) => {
    filmData.userComment = newObject.userComment;
    filmData.commentsCounter = newObject.commentsCounter;
    film.partialUpdate(filmData);
    api.updateFilm({id: filmData.id, data: filmData.toRAW()})
    .then((newFilmData) => {
      film.update(newFilmData);
    });
  };

  filmDetails.onClose = () => {
    document.body.removeChild(document.body.lastChild);
    filmDetails.unrender();
  };

  /*
  filmDetails.onClose = (newObject) => {
    filmData.userComment = newObject.userComment;
    filmData.commentsCounter = newObject.commentsCounter;
    //console.log(filmData.commentsCounter);
    film.partialUpdate(filmData);
    api.updateFilm({id: filmData.id, data: filmData.toRAW()})
        .then((newFilmData) => {
          film.update(newFilmData);
          document.body.removeChild(document.body.lastChild);
          filmDetails.unrender();
        });
  };
*/
};

const createFilterElements = () => {
  allFilters
  .forEach((it) => renderFilter(it));
};

/*
const getFilmCards = (container, filmsList, boolean) => {
  filmsList.forEach((it) => renderFilmCard(container, it, boolean));
};
*/


const getFilmCards = (container, boolean) => {
  api.getFilms()
  .then((it) => {
    allFilms = it;
    console.log(allFilms);
    allFilms.forEach((el) => renderFilmCard(container, el, boolean));
  });
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
      return allFilms.filter((it) => it.inWatchList === true);

    case `history`:
      return allFilms.filter((it) => it.isWatched === true);

    case `favorites`:
      return allFilms.filter((it) => it.isFavorite === true);

    default:
      return [];
  }
};

const init = () => {
  createFilterElements();

  /*
  api.getFilms().then((tasks) => {
    renderTasks(tasks);
  });
   */

  getFilmCards(filmsListContainer, true);
  // filmsListExtras.forEach((it) => getFilmCards(it, allFilms.slice(0, 2), false));

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
      renderStats(Counters);
    }

    const filteredFilms = filterFilms(allFilms, filterCaption);
    //console.log(filterCaption); // выдает название фильтра правильно
    //console.log(filteredFilms); // выдает кликнутый фильм
    filteredFilms.forEach((el) => renderFilmCard(filmsListContainer, el, true));
    // getFilmCards(filmsListContainer, filteredFilms, true);это надо переписать, не работает
  });
};

init();
