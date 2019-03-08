import makeFilterElement from './make-filter';
import FilmCard from './film-card';
import FilmDetails from './film-details';
import getAllFilms from './film-data';
import {getRandomInt} from './utils';

const CARDS_AMOUNT_INITIAL = 7;
const CARDS_AMOUNT_TOP = 2;

const Filters = [`All movies`, `Watchlist`, `History`, `Favorites`, `Stats`];

const filterContainer = document.querySelector(`.main-navigation`);
const filmsListContainer = document.querySelector(`.films-list .films-list__container`);
const filmsListExtras = [...document.querySelectorAll(`.films-list--extra .films-list__container`)];

const renderFilmCard = (container, data, boolean) => {
  const film = new FilmCard(data);
  const filmDetails = new FilmDetails(data);

  container.appendChild(film.render(boolean));

  film.onComments = () => {
    document.body.appendChild(filmDetails.render());
  };

  filmDetails.onClose = () => {
    document.body.removeChild(document.body.lastChild);
  };
};

const getFilmCards = (container, amount, boolean) => {
  getAllFilms().
  forEach((it, i) => {
    if (i < amount) {
      renderFilmCard(container, it, boolean);
    }
  });
};

const init = () => {
  Filters.forEach((it) =>
    filterContainer.insertAdjacentHTML(`beforeEnd`, makeFilterElement(it, getRandomInt(1, 20))));
  getFilmCards(filmsListContainer, CARDS_AMOUNT_INITIAL, true);
  filmsListExtras.forEach((it) => getFilmCards(it, CARDS_AMOUNT_TOP, false));
};

init();

filterContainer.addEventListener(`click`, () => {

  while (filmsListContainer.firstChild) {
    filmsListContainer.removeChild(filmsListContainer.firstChild);
  }

  getFilmCards(filmsListContainer, getRandomInt(1, 10), true);
});
