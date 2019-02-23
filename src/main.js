import makeFilterElement from './make_filter';
import makeCardElement from './make_card';

const CARDS_AMOUNT_INITIAL = 7;
const CARDS_AMOUNT_TOP = 2;

const Filters = [
  [`All movies`, 0], [`Watchlist`, 13], [`History`, 4], [`Favorites`, 8], [`Stats`, 0]
];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min;

const filterContainer = document.querySelector(`.main-navigation`);
Filters.forEach(([first, second]) =>
  filterContainer.insertAdjacentHTML(`beforeEnd`, makeFilterElement(first, second)));

const filmsList = document.querySelector(`.films-list`);
const filmsListContainer = filmsList.querySelector(`.films-list__container`);

const filmsListExtras = Array.from(document.querySelectorAll(`.films-list--extra`))
.map((it) => it.querySelector(`.films-list__container`));

const addCards = (container, amount, controls) => {

  for (let i = 0; i < amount; i++) {
    container.insertAdjacentHTML(`beforeEnd`, makeCardElement(controls));
  }

};

addCards(filmsListContainer, CARDS_AMOUNT_INITIAL);
filmsListExtras.forEach((it) => addCards(it, CARDS_AMOUNT_TOP, false));

filterContainer.addEventListener(`click`, () => {

  while (filmsListContainer.firstChild) {
    filmsListContainer.removeChild(filmsListContainer.firstChild);
  }

  addCards(filmsListContainer, getRandomInt(1, 10));
});
