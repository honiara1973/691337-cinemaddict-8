import API from './api';
import Filter from './filter';
import FilmCard from './film-card';
import FilmDetails from './film-details';
import renderStats from './stats-controller';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;

const FILMS_AMOUNT_PER_PAGE = 5;
const TOP_FILMS_AMOUNT = 2;
const WATCHED_AMOUNT_LOW = 10;
const WATCHED_AMOUNT_HIGH = 20;
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

const searchField = document.querySelector(`.search__field`);
const mainContainer = document.querySelector(`.main`);
const filmsContainer = document.querySelector(`.films`);
const filterContainer = document.querySelector(`.main-navigation`);
const filmsListContainer = document.querySelector(`.films-list .films-list__container`);
const filmsListExtras = [...document.querySelectorAll(`.films-list--extra .films-list__container`)];
const nextPageButton = document.querySelector(`.films-list__show-more`);
const rankField = document.querySelector(`.profile__rating`);
const footerStatistik = document.querySelector(`.footer__statistics p`);

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

const getUserRank = () => {
  const watchedAmount = countFilmsWatched();
  let userRank;
  if (watchedAmount <= WATCHED_AMOUNT_LOW) {
    userRank = `novice`;
  } else if (watchedAmount > WATCHED_AMOUNT_LOW && watchedAmount < WATCHED_AMOUNT_HIGH) {
    userRank = `fan`;
  } else {
    userRank = `movie buff`;
  }
  return userRank;
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
    console.log(filmData.inWatchList);
    filmData.inWatchList = newObject.inWatchList;
    api.updateFilm({id: filmData.id, data: filmData.toRAW()})
    .then((newFilmData) => {
      film.updateControls(newFilmData);
      filmDetails.updateControls(newFilmData);
      document.querySelector(`a[href=watchlist] .main-navigation__item-count`)
    .innerHTML = countFilmsInWatchList();
      console.log(newFilmData.inWatchList);
    });
  };

  film.onMarkAsWatched = (newObject) => {
    console.log(filmData.isWatched);
    filmData.isWatched = newObject.isWatched;
    api.updateFilm({id: filmData.id, data: filmData.toRAW()})
    .then((newFilmData) => {
      film.updateControls(newFilmData);
      filmDetails.updateControls(newFilmData);
      document.querySelector(`a[href=history] .main-navigation__item-count`)
    .innerHTML = countFilmsWatched();
      updateRankField(getUserRank());
      console.log(newFilmData.isWatched);
    });
  };

  film.onAddToFavorite = (newObject) => {
    console.log(filmData.isFavorite);
    filmData.isFavorite = newObject.isFavorite;
    api.updateFilm({id: filmData.id, data: filmData.toRAW()})
    .then((newFilmData) => {
      film.updateControls(newFilmData);
      filmDetails.updateControls(newFilmData);
      document.querySelector(`a[href=favorites] .main-navigation__item-count`)
    .innerHTML = countFilmsFavorite();
      console.log(newFilmData.isFavorite);
    });
  };

  filmDetails.onSendComment = (newObject) => {
    const commentLabel = document.querySelector(`.film-details__comment-label`);
    const commentInput = document.querySelector(`.film-details__comment-input`);
    commentInput.disabled = true;
    commentInput.style.border = null;
    filmData.comments = [...filmData.comments].concat(newObject.userComment);
    console.log(filmData.comments);
    //filmData.userComment = newObject.userComment;
    //filmData.commentsCounter = newObject.commentsCounter;
    film.partialUpdate(filmData);
    api.updateFilm({id: filmData.id, data: filmData.toRAW()})
    .then((newFilmData) => {
      console.log(newFilmData);
      commentInput.disabled = false;
      //film.update(newFilmData);
      film.partialUpdate(newFilmData);
      filmDetails.update(newFilmData);
      filmDetails.partialUpdate(`comments`);
    })
    .catch(() => {
      filmDetails.shake(commentLabel);
      commentInput.style.border = `3px solid red`;
      commentInput.disabled = false;
    });
  };

  filmDetails.onUndoComment = (newObject) => {
    filmData.comments = newObject;
    console.log(filmData.comments);
    //film.partialUpdate(filmData);
    api.updateFilm({id: filmData.id, data: filmData.toRAW()})
    .then((newFilmData) => {
      film.partialUpdate(newFilmData);
      filmDetails.update(newFilmData);
      //film.update(newFilmData);
      //film.partialUpdate(newFilmData);
      filmDetails.partialUpdate(`undoComment`);
    });
  };

  filmDetails.onVoting = (newScore) => {
    const ratingScoreContainer = document.querySelector(`.film-details__user-rating-score`);
    filmData.userScore = newScore;
    api.updateFilm({id: filmData.id, data: filmData.toRAW()})
    .then((newFilmData) => {
      filmDetails.update(newFilmData);
      filmDetails.partialUpdate(`score`);
      //film.update(newFilmData);
    })
    .catch(() => {
      filmDetails.shake(ratingScoreContainer);
    });
  };

  filmDetails.onClose = (newObject) => {
    filmData.inWatchList = newObject.inWatchList;
    filmData.isWatched = newObject.isWatched;
    filmData.isFavorite = newObject.isFavorite;
    api.updateFilm({id: filmData.id, data: filmData.toRAW()})
    .then((newFilmData) => {
      film.updateControls(newFilmData);
      filmDetails.updateControls(newFilmData);
      document.querySelector(`a[href=watchlist] .main-navigation__item-count`)
    .innerHTML = countFilmsInWatchList();
      document.querySelector(`a[href=history] .main-navigation__item-count`)
    .innerHTML = countFilmsWatched();
      document.querySelector(`a[href=favorites] .main-navigation__item-count`)
    .innerHTML = countFilmsFavorite();
      updateRankField(getUserRank());
      console.log(newFilmData.isWatched);
      document.body.removeChild(document.body.lastChild);
      filmDetails.unrender();
    });
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

const updateRankField = (content) => {
  rankField.innerHTML = content;
};

const updateFooterStatistik = (content) => {
  footerStatistik.innerHTML = `${content} movies inside`;
};

const init = () => {

  api.getFilms()
  .then((it) => {
    allFilms = it;
    console.log(allFilms);
    console.log(allFilms[0].watchedDate);
    countFilmsWatched();
    countFilmsInWatchList();
    countFilmsFavorite();
    allFilters = getAllFilters();
    createFilterElements();
    createFilmCards(filmsListContainer, true);
    createFilmCards(filmsListExtras[0], false, `rating`);
    createFilmCards(filmsListExtras[1], false, `commentsCounter`);
    updateFooterStatistik(allFilms.length);
    updateRankField(getUserRank());
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
    filteredFilms = filterFilms(allFilms, filterCaption);

    if (filterCaption === `stats`) {
      filmsContainer.classList.add(`visually-hidden`);
      const filteredFilmsStats = filterFilms(allFilms, `history`);
      console.log(filteredFilmsStats);
      renderStats(filteredFilmsStats);
    }

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


