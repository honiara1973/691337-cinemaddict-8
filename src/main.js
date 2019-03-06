import makeFilterElement from './make-filter';
import FilmCard from './film-card';
import getAllFilms from './film-data';
import {getRandomInt} from './utils';

const CARDS_AMOUNT_INITIAL = 7;
const CARDS_AMOUNT_TOP = 2;

const Filters = [`All movies`, `Watchlist`, `History`, `Favorites`, `Stats`];

const filterContainer = document.querySelector(`.main-navigation`);
const filmsListContainer = document.querySelector(`.films-list .films-list__container`);
const filmsListExtras = [...document.querySelectorAll(`.films-list--extra .films-list__container`)];

const renderFilmCard = (container, data) => {
  const film = new FilmCard(data);
  container.appendChild(film.render());
};

const getFilmCards = (container, amount) => {
  getAllFilms().
  forEach((it, i) => {
    if (i < amount) {
      renderFilmCard(container, it);
    }
  });
};

const init = () => {
  Filters.forEach((it) =>
    filterContainer.insertAdjacentHTML(`beforeEnd`, makeFilterElement(it, getRandomInt(1, 20))));
  getFilmCards(filmsListContainer, CARDS_AMOUNT_INITIAL);
  filmsListExtras.forEach((it) => getFilmCards(it, CARDS_AMOUNT_TOP));
};

init();

filterContainer.addEventListener(`click`, () => {

  while (filmsListContainer.firstChild) {
    filmsListContainer.removeChild(filmsListContainer.firstChild);
  }

  getFilmCards(filmsListContainer, getRandomInt(1, 10));
});


/* const addCards = (container, amount, controls) => {
  getAllFilms()
  .reduce((acc, it) => acc.length < amount ? [...acc,
    container.insertAdjacentHTML(`beforeEnd`, makeCardElement(it, controls))] : acc, []);
};
*/

/* const init = () => {
  Filters.forEach((it) =>
    filterContainer.insertAdjacentHTML(`beforeEnd`, makeFilterElement(it, getRandomInt(1, 20))));
  addCards(filmsListContainer, CARDS_AMOUNT_INITIAL);
  filmsListExtras.forEach((it) => addCards(it, CARDS_AMOUNT_TOP, false));
};

*/


