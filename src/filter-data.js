import {getRandomInt} from './utils';

const Filters = [
  [`All movies`, false, true],
  [`Watchlist`, true],
  [`History`, true],
  [`Favorites`, true],
  [`Stats`, false, false, true]
];

const getAllFilters = () => {

  const filters = [];

  for (let el of Filters) {
    const [caption, hasCounter, isActive = false, isAdditional = false] = el;

    const filter = {
      caption,
      hasCounter,
      isActive,
      isAdditional,
      counter: getRandomInt(1, 40),
    };

    filters.push(filter);
  }

  return filters;
};

export default getAllFilters;
