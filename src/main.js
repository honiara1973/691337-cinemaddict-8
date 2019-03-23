// import makeFilterElement from './make-filter';
import Filter from './filter';
import FilmCard from './film-card';
import FilmDetails from './film-details';
import getAllFilters from './filter-data';
import getAllFilms from './film-data';
import Stats from './stats';
import statsData from './stats-data';
// import {getRandomInt} from './utils';

// const CARDS_AMOUNT_INITIAL = 7;
// const CARDS_AMOUNT_TOP = 2;
const allFilms = getAllFilms();
const allFilters = getAllFilters();

// const Filters = [`All movies`, `Watchlist`, `History`, `Favorites`, `Stats`];

const mainContainer = document.querySelector(`.films`);
const filterContainer = document.querySelector(`.main-navigation`);
const filmsListContainer = document.querySelector(`.films-list .films-list__container`);
const filmsListExtras = [...document.querySelectorAll(`.films-list--extra .films-list__container`)];

const renderFilter = (data) => {
  const filter = new Filter(data);

  filterContainer.appendChild(filter.render());

  /*
  filter.onFilter = () => {
    while (filmsListContainer.firstChild) {
      filmsListContainer.removeChild(filmsListContainer.firstChild);
    }
    getFilmCards(filmsListContainer, getRandomInt(1, 10), false);
  };
*/
};

const renderStats = (data) => {
  const stats = new Stats(data);

  filmsListContainer.appendChild(stats.render());
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
    console.log(data.state.inWatchList);
  };

  film.onMarkAsWatched = (newObject) => {
    data.state.isWatched = newObject.state.isWatched;
    console.log(data.state.isWatched);
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
      return allFilms.filter((it) => it.rating > 8);

    default:
      return [];
  }
};

const init = () => {
  createFilterElements();
  // renderStats(statsData);

  getFilmCards(filmsListContainer, allFilms.slice(0, 6), true);
  filmsListExtras.forEach((it) => getFilmCards(it, allFilms.slice(0, 2), false));

  filterContainer.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    const newFilter = evt.target;
    console.log(newFilter);
    const currentFilter = filterContainer.querySelector(`.main-navigation__item--active`);
    currentFilter.classList.remove(`main-navigation__item--active`);
    newFilter.classList.add((`main-navigation__item--active`));

    while (filmsListContainer.firstChild) {
      filmsListContainer.removeChild(filmsListContainer.firstChild);
    }

    const filterCaption = getEventFilter(evt);

    if (filterCaption === `stats`) {
      renderStats(statsData);
    }

    const filteredFilms = filterFilms(allFilms, filterCaption);
    getFilmCards(filmsListContainer, filteredFilms, true);

    // getFilmCards(filmsListContainer, getRandomInt(1, 10), false);
  });

};

init();
