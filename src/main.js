import makeFilterElement from './make_filter';
import makeCardElement from './make_card';

const CARDS_AMOUNT_INITIAL = 7;
const CARDS_AMOUNT_TOP = 2;

const Filters = [`All movies`, `Watchlist`, `History`, `Favorites`, `Stats`];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min;

const filterContainer = document.querySelector(`.main-navigation`);
const filmsListContainer = document.querySelector(`.films-list .films-list__container`);
const filmsListExtras = [...document.querySelectorAll(`.films-list--extra .films-list__container`)];

const addCards = (container, amount, controls) => {

  for (let i = 0; i < amount; i++) {
    container.insertAdjacentHTML(`beforeEnd`, makeCardElement(controls));
  }

};

const init = () => {
  Filters.forEach((it) =>
    filterContainer.insertAdjacentHTML(`beforeEnd`, makeFilterElement(it, getRandomInt(1, 20))));
  addCards(filmsListContainer, CARDS_AMOUNT_INITIAL);
  filmsListExtras.forEach((it) => addCards(it, CARDS_AMOUNT_TOP, false));
};

init();

filterContainer.addEventListener(`click`, () => {

  while (filmsListContainer.firstChild) {
    filmsListContainer.removeChild(filmsListContainer.firstChild);
  }

  addCards(filmsListContainer, getRandomInt(1, 10));
});
