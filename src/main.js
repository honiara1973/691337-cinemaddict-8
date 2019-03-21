// import makeFilterElement from './make-filter';
import Filter from './filter';
import FilmCard from './film-card';
import FilmDetails from './film-details';
import getAllFilters from './filter-data';
import getAllFilms from './film-data';
import {getRandomInt} from './utils';

const CARDS_AMOUNT_INITIAL = 7;
const CARDS_AMOUNT_TOP = 2;
const allFilms = getAllFilms();
const allFilters = getAllFilters();

// const Filters = [`All movies`, `Watchlist`, `History`, `Favorites`, `Stats`];

const filterContainer = document.querySelector(`.main-navigation`);
const filmsListContainer = document.querySelector(`.films-list .films-list__container`);
const filmsListExtras = [...document.querySelectorAll(`.films-list--extra .films-list__container`)];

const renderFilter = (data) => {
  const filter = new Filter(data);

  filterContainer.appendChild(filter.render());

  filter.onFilter = () => {
    while (filmsListContainer.firstChild) {
      filmsListContainer.removeChild(filmsListContainer.firstChild);
    }
    getFilmCards(filmsListContainer, getRandomInt(1, 10), false);
  };

};

const renderFilmCard = (container, data, boolean) => {
  const film = new FilmCard(data);
  const filmDetails = new FilmDetails(data);

  container.appendChild(film.render(boolean));

  film.onComments = () => {
    document.body.appendChild(filmDetails.render());
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

const getFilmCards = (container, amount, boolean) => {
  allFilms
  .forEach((it, i) => {
    if (i < amount) {
      renderFilmCard(container, it, boolean);
    }
  });
};

const init = () => {
  createFilterElements();
  console.log(filterContainer.children);
  console.log(filterContainer.firstChild);
  console.log(getAllFilters());

  getFilmCards(filmsListContainer, CARDS_AMOUNT_INITIAL, true);
  filmsListExtras.forEach((it) => getFilmCards(it, CARDS_AMOUNT_TOP, false));

  /*filterContainer.addEventListener(`click`, (evt) => {
    const newFilter = evt.target;
    const currentFilter = filterContainer.querySelector(`.main-navigation__item--active`);
    currentFilter.classList.remove(`main-navigation__item--active`);
    newFilter.classList.add((`main-navigation__item--active`));

    console.log(newFilter);
    while (filmsListContainer.firstChild) {
      filmsListContainer.removeChild(filmsListContainer.firstChild);
    }
    getFilmCards(filmsListContainer, getRandomInt(1, 10), false);
  });
  */

};

init();
