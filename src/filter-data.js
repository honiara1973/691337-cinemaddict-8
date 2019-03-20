import {getRandomInt} from './utils';

const Filters = [
  [`All movies`, false, false],
  [`Watchlist`, true, false],
  [`History`, true, false],
  [`Favorites`, true, false],
  [`Stats`, false, true]
];

const getAllFilters = () => {

  const filters = [];

  for (let el of Filters) {
    const [caption, hasCounter, isAdditional] = el;

    const filter = {
      caption,
      hasCounter,
      isAdditional,
      counter: getRandomInt(1, 40),
    };

    filters.push(filter);
  }

  return filters;
};

export default getAllFilters;
