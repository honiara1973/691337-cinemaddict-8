import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import API from './api';
import Filter from './filter';
import FilmCard from './film-card';
import FilmDetails from './film-details';
import Stats from './stats';
import StatsFilter from './stats-filter';
import chartOptions from './chart-options';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;

const FILMS_AMOUNT_PER_PAGE = 5;
const TOP_FILMS_AMOUNT = 2;
const MIN_IN_HOUR = 60;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
let allFilms;
let allFilters;
let filteredFilms;

const Filters = [
  [`All movies`, false, true],
  [`Watchlist`, true],
  [`History`, true],
  [`Favorites`, true],
  [`Stats`, false, false, true]
];

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

const searchField = document.querySelector(`.search__field`);
const mainContainer = document.querySelector(`.main`);
const filmsContainer = document.querySelector(`.films`);
const filterContainer = document.querySelector(`.main-navigation`);
const filmsListContainer = document.querySelector(`.films-list .films-list__container`);
const filmsListExtras = [...document.querySelectorAll(`.films-list--extra .films-list__container`)];
const nextPageButton = document.querySelector(`.films-list__show-more`);

const countFilmsWatched = () => {
  return allFilms.reduce((acc, it) => it.isWatched === true ?
    acc + 1 : acc, 0);
};

const countFilmsInWatchList = () => {
  return allFilms.reduce((acc, it) => it.inWatchList === true ?
    acc + 1 : acc, 0);
};

const countFilmsFavorite = () => {
  return allFilms.reduce((acc, el) => el.isFavorite === true ?
    acc + 1 : acc, 0);
};

const getFilterCounter = (caption) => {
  switch (caption) {
    case `Watchlist`:
      return countFilmsInWatchList();

    case `History`:
      return countFilmsWatched();

    case `Favorites`:
      return countFilmsFavorite();

    default:
      return ``;
  }
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

const getAllFilters = () => {
  const filters = [];

  for (let el of Filters) {
    const [caption, hasCounter, isActive = false, isAdditional = false] = el;

    const filter = {
      caption,
      hasCounter,
      isActive,
      isAdditional,
      counter: getFilterCounter(caption),
    };

    filters.push(filter);
  }
  return filters;
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

const renderFilter = (data) => {
  const filter = new Filter(data);
  filterContainer.appendChild(filter.render());
};

const renderStats = (data) => {
  statsCounters.filmsWatched = countFilmsWatched();
  statsCounters.totalDuration.hours = Math.floor(allFilms.reduce((acc, it) => it.isWatched === true ?
    acc + it.duration : acc, 0) / MIN_IN_HOUR);

  statsCounters.totalDuration.minutes = allFilms.reduce((acc, it) => it.isWatched === true ?
    acc + it.duration : acc, 0) % MIN_IN_HOUR;

  const filmsWatched = allFilms.filter((it) => it.isWatched === true);

  const countFilmGenres = (genre) => {
    statsCounters.genresWatched[genre] = filmsWatched
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
      labels: Object.keys(statsCounters.genresWatched),
      datasets: [{
        data: Object.values(statsCounters.genresWatched),
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
    if (document.querySelector(`.film-details`)) {
      document.body.removeChild(document.body.lastChild);
    }
    document.body.appendChild(filmDetails.render());
  };

  film.onAddToWatchList = (newObject) => {
    filmData.inWatchList = newObject.inWatchList;
    document.querySelector(`a[href=watchlist] .main-navigation__item-count`)
    .innerHTML = countFilmsInWatchList();
  };

  film.onMarkAsWatched = (newObject) => {
    filmData.isWatched = newObject.isWatched;
    document.querySelector(`a[href=history] .main-navigation__item-count`)
    .innerHTML = countFilmsWatched();
  };

  film.onAddToFavorite = (newObject) => {
    filmData.isFavorite = newObject.isFavorite;
    document.querySelector(`a[href=favorites] .main-navigation__item-count`)
    .innerHTML = countFilmsFavorite();
  };

  filmDetails.onSendComment = (newObject) => {
    const commentLabel = document.querySelector(`.film-details__comment-label`);
    const commentInput = document.querySelector(`.film-details__comment-input`);
    commentInput.disabled = true;
    commentInput.style.border = null;
    filmData.userComment = newObject.userComment;
    filmData.commentsCounter = newObject.commentsCounter;
    film.partialUpdate(filmData);
    api.updateFilm({id: filmData.id, data: filmData.toRAW()})
    .then((newFilmData) => {
      commentInput.disabled = false;
      film.update(newFilmData);
      filmDetails.partialUpdate(`comments`);
    })
    .catch(() => {
      filmDetails.shake(commentLabel);
      commentInput.style.border = `3px solid red`;
      commentInput.disabled = false;
    });
  };

  filmDetails.onVoting = (newObject) => {
    const ratingScoreContainer = document.querySelector(`.film-details__user-rating-score`);
    filmData.userScore = newObject.userScore;
    api.updateFilm({id: filmData.id, data: filmData.toRAW()})
    .then((newFilmData) => {
      filmDetails.partialUpdate(`score`);
      film.update(newFilmData);
    })
    .catch(() => {
      filmDetails.shake(ratingScoreContainer);
    });
  };

  filmDetails.onClose = () => {
    document.body.removeChild(document.body.lastChild);
    filmDetails.unrender();
  };
};

const createFilterElements = () => {
  allFilters
  .forEach((it) => renderFilter(it));
};

const createFilmCards = (container, boolean, prop) => {
  if (prop) {
    allFilms
       .slice()
       .sort((a, b) => {
         return b[prop] - a[prop];
       })
       .slice(0, TOP_FILMS_AMOUNT)
       .forEach((it) => renderFilmCard(container, it, boolean));
  } else {
    allFilms.forEach((it, i) => {
      if (i < FILMS_AMOUNT_PER_PAGE) {
        renderFilmCard(container, it, boolean);
      }
    });
  }
};

const init = () => {

  api.getFilms()
  .then((it) => {
    allFilms = it;
    countFilmsWatched();
    countFilmsInWatchList();
    countFilmsFavorite();
    allFilters = getAllFilters();
    createFilterElements();
    createFilmCards(filmsListContainer, true);
    createFilmCards(filmsListExtras[0], false, `rating`);
    createFilmCards(filmsListExtras[1], false, `commentsCounter`);
    filteredFilms = filterFilms(allFilms, `all`);
  });

  let currentPageNumber = 0;
  nextPageButton.addEventListener(`click`, () => {

    while (filmsListContainer.firstChild) {
      filmsListContainer.removeChild(filmsListContainer.firstChild);
    }

    currentPageNumber += 1;
    const startNumber = FILMS_AMOUNT_PER_PAGE * currentPageNumber;
    const endNumber = startNumber + FILMS_AMOUNT_PER_PAGE;


    if (endNumber >= filteredFilms.length) {
      nextPageButton.classList.add(`visually-hidden`);
      currentPageNumber = 0;
    }

    filteredFilms
    .slice(startNumber, endNumber)
    .forEach((it) => renderFilmCard(filmsListContainer, it, true));
  });

  searchField.addEventListener(`keyup`, (evt) => {
    const searchString = evt.target.value;

    while (filmsListContainer.firstChild) {
      filmsListContainer.removeChild(filmsListContainer.firstChild);
    }

    allFilms
    .filter((it) => it.name.includes(searchString) ||
    it.name.toLowerCase().includes(searchString))
    .forEach((it) => {
      renderFilmCard(filmsListContainer, it, true);
    });
  });


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
      renderStats(statsCounters);
    }

    filteredFilms = filterFilms(allFilms, filterCaption);

    if (filteredFilms.length > FILMS_AMOUNT_PER_PAGE &&
    nextPageButton.classList.contains(`visually-hidden`)) {
      nextPageButton.classList.remove(`visually-hidden`);
    }

    if (filteredFilms.length <= FILMS_AMOUNT_PER_PAGE &&
      !nextPageButton.classList.contains(`visually-hidden`)) {
      nextPageButton.classList.add(`visually-hidden`);
    }

    filteredFilms.forEach((it, i) => {
      if (i < FILMS_AMOUNT_PER_PAGE) {
        renderFilmCard(filmsListContainer, it, true);
      }
    });
  });
};

init();


