import API from './api';
import Filter from './filter';
import FilmCard from './film-card';
import FilmDetails from './film-details';
import getAllFilters from './filter-data';
// import getAllFilms from './film-data';
import Stats from './stats';
import statsData from './stats-data';
import StatsFilter from './stats-filter';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import chartOptions from './my-chart';

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle/`;

const MIN_IN_HOUR = 60;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
let allFilms;
const allFilters = getAllFilters();

const mainContainer = document.querySelector(`.main`);
const filmsContainer = document.querySelector(`.films`);
const filterContainer = document.querySelector(`.main-navigation`);
const filmsListContainer = document.querySelector(`.films-list .films-list__container`);
const filmsListExtras = [...document.querySelectorAll(`.films-list--extra .films-list__container`)];

const Counters = {
  isWatched: 0,
  totalDuration: 0,

  genresWatched: {
    'Sci-Fi': 0,
    'Animation': 0,
    'Fantasy': 0,
    'Comedy': 0,
    'TV Series': 0,
  },
  yourRank: {
    'Sci-Fighter': `Sci-Fi`,
    'Animation-Fan': `Animation`,
    'Fantasy-Fan': `Fantasy`,
    'Comedy-Lover': `Comedy`,
    'TV-Series-Maniac': `TV Series`,
  },
};

const renderFilter = (data) => {
  const filter = new Filter(data);

  filterContainer.appendChild(filter.render());
};

const renderStats = (data) => {
  const stats = new Stats(data);

  mainContainer.appendChild(stats.render());
  const statsContainer = document.querySelector(`.statistic`);
  const statsTextList = statsContainer.querySelector(`.statistic__text-list`);
  statsContainer.classList.remove(`visually-hidden`);

  const statsFilter = new StatsFilter();
  statsContainer.insertBefore(statsFilter.render(), statsTextList);

  const statisticCtx = document.querySelector(`.statistic__chart`);
  const BAR_HEIGHT = 50;
  statisticCtx.height = BAR_HEIGHT * 5;

  const myChart = new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: [`Sci-Fi`, `Animation`, `Fantasy`, `Comedy`, `TV Series`],
      datasets: [{
        data: [Counters.genresWatched[`Sci-Fi`], Counters.genresWatched.Animation,
          Counters.genresWatched.Fantasy, Counters.genresWatched.Comedy,
          Counters.genresWatched[`TV Series`]],
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: chartOptions,
  });

  statisticCtx.innerHTML = myChart;
};
// ниже для рендера карточки надо заменить вероятно data на другое во избежании путаницы. Может card.
const renderFilmCard = (container, data, boolean) => {
  const film = new FilmCard(data);
  const filmDetails = new FilmDetails(data);

  container.appendChild(film.render(boolean));

  film.onComments = () => {
    document.body.appendChild(filmDetails.render());
  };

  film.onAddToWatchList = (newObject) => {
    data.inWatchList = newObject.inWatchList;
  };

  film.onMarkAsWatched = (newObject) => {
    data.isWatched = newObject.isWatched;
    console.log(data.isWatched);
    Counters.isWatched = allFilms.reduce((acc, it) => it.isWatched === true ?
      acc + 1 : acc, 0);
    Counters.totalDuration = allFilms.reduce((acc, it) => it.isWatched === true ?
      acc + it.duration : acc, 0);

    const filmsWatched = allFilms.filter((it) => it.isWatched === true);
    const countFilmGenres = (genre) => {
      Counters.genresWatched[genre] = filmsWatched.reduce((acc, it) => it.genre === genre ?
        acc + 1 : acc, 0);
      return Counters.genresWatched[genre];
    };
    Object.keys(Counters.genresWatched).forEach((it) => countFilmGenres(it));

    const filmsWatchedMax = Math.max(...Object.values(Counters.genresWatched));
    let topGenre;
    const getTopGenre = () => {

      for (let prop in Counters.genresWatched) {
        if (Counters.genresWatched[prop] === filmsWatchedMax) {
          topGenre = prop;
        }
      }
      return topGenre;
    };

    let yourRank;
    const getYourRank = () => {

      for (let prop in Counters.yourRank) {
        if (Counters.yourRank[prop] === topGenre) {
          yourRank = prop;
        }
      }
      return yourRank;
    };

    statsData.isWatchedCounter = Counters.isWatched;
    statsData.totalDuration.hours = Math.floor(Counters.totalDuration / MIN_IN_HOUR);
    statsData.totalDuration.min = Counters.totalDuration % MIN_IN_HOUR;
    statsData.genresWatched = Counters.genresWatched;
    statsData.topGenre = getTopGenre();
    statsData.yourRank = getYourRank();
  };

  film.onAddToFavorite = (newObject) => {
    data.isFavorite = newObject.isFavorite;
  };

  filmDetails.onClose = (newObject) => {
    data.userComment = newObject.userComment;
    data.commentsCounter = newObject.commentsCounter;
    film.partialUpdate(data);
    document.body.removeChild(document.body.lastChild);
    filmDetails.unrender();
/*Из демки учебного:
    editTaskComponent.onSubmit = (newObject) => {
      task.title = newObject.title;
      task.tags = newObject.tags;
      task.color = newObject.color;
      task.repeatingDays = newObject.repeatingDays;
      task.dueDate = newObject.dueDate;

      api.updateTask({id: task.id, data: task.toRAW()})
        .then((newTask) => {
          taskComponent.update(newTask);
          taskComponent.render();

          tasksContainer.replaceChild(taskComponent.element, editTaskComponent.element);

          editTaskComponent.unrender();
        });
*/



  };

};

const createFilterElements = () => {
  allFilters
  .forEach((it) => renderFilter(it));
};

/*
const getFilmCards = (container, filmsList, boolean) => {
  filmsList.forEach((it) => renderFilmCard(container, it, boolean));
};
*/


const getFilmCards = (container, boolean) => {
  api.getFilms()
  .then((it) => {
    allFilms = it;
    console.log(allFilms);
    allFilms.forEach((el) => renderFilmCard(container, el, boolean));
  });
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
      return allFilms.filter((it) => it.inWatchList === true);

    case `history`:
      return allFilms.filter((it) => it.isWatched === true);

    case `favorites`:
      return allFilms.filter((it) => it.isFavorite === true);

    default:
      return [];
  }
};

const init = () => {
  createFilterElements();

  /*
  api.getFilms().then((tasks) => {
    renderTasks(tasks);
  });
   */

  getFilmCards(filmsListContainer, true);
  // filmsListExtras.forEach((it) => getFilmCards(it, allFilms.slice(0, 2), false));

  filterContainer.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    const newFilter = evt.target;
    const currentFilter = filterContainer.querySelector(`.main-navigation__item--active`);
    currentFilter.classList.remove(`main-navigation__item--active`);
    newFilter.classList.add((`main-navigation__item--active`));

    while (filmsListContainer.firstChild) {
      filmsListContainer.removeChild(filmsListContainer.firstChild);
    }

    const statsContainer = document.querySelector(`.statistic`);
    if (statsContainer) {
      mainContainer.removeChild(mainContainer.lastChild);
    }

    if (filmsContainer.classList.contains(`visually-hidden`)) {
      filmsContainer.classList.remove(`visually-hidden`);
    }

    const filterCaption = getEventFilter(evt);

    if (filterCaption === `stats`) {
      filmsContainer.classList.add(`visually-hidden`);
      renderStats(statsData);
    }

    const filteredFilms = filterFilms(allFilms, filterCaption);
    console.log(filterCaption); //выдает название фильтра правильно
    console.log(filteredFilms); //выдает кликнутый фильм
    getFilmCards(filmsListContainer, filteredFilms, true);//это надо переписать, не работает
  });
};

init();
