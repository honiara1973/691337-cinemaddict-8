import {getRandomInt} from './utils';

const Filters = [
  [`All movies`, false, false, true],
  [`Watchlist`, true, false],
  [`History`, true, false],
  [`Favorites`, true, false],
  [`Stats`, false, true]
];

const getAllFilters = () => {

  const filters = [];

  for (let el of Filters) {
    const [caption, hasCounter, isAdditional, isActive = false] = el;

    const filter = {
      caption,
      hasCounter,
      isAdditional,
      isActive,
      counter: getRandomInt(1, 40),
    };

    filters.push(filter);
  }

  return filters;
};

export default getAllFilters;
