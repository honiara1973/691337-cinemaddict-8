import makeFilterElement from './make-filter';
// import makeCardElement from './make-card';
import filmCard from './film-card';
import getAllFilms from './film-data';
import {getRandomInt} from './utils';

const CARDS_AMOUNT_INITIAL = 7;
const CARDS_AMOUNT_TOP = 2;

const Filters = [`All movies`, `Watchlist`, `History`, `Favorites`, `Stats`];

const filterContainer = document.querySelector(`.main-navigation`);
const filmsListContainer = document.querySelector(`.films-list .films-list__container`);
const filmsListExtras = [...document.querySelectorAll(`.films-list--extra .films-list__container`)];

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


init();
*/
const renderFilmCard = (container, data) => {
const film = new FilmCard(data);
container.appendChild(film.render());
};


const init = () => {
  Filters.forEach((it) =>  
}

filterContainer.addEventListener(`click`, () => {

  while (filmsListContainer.firstChild) {
    filmsListContainer.removeChild(filmsListContainer.firstChild);
  }

// addCards(filmsListContainer, getRandomInt(1, 10));
});
