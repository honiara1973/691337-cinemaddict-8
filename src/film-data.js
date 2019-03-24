import {getRandomFrac, compareRandom, getRandomInt, getRandomElement} from './utils';

const MS_IN_WEEK = 7 * 24 * 60 * 60 * 1000;

const Films = [
  [`Shindler's List`, `1993-01-01`],
  [`The Matrix`, `1999-02-02`],
  [`The Dark Knight`, `2008-03-03`],
  [`Titanic`, `1997-04-04`],
  [`Jurassic Park`, `1993-05-05`],
  [`Gladiator`, `2000-06-06`],
  [`Star Wars`, `1977-07-07`],
  [`The Shawshank Redemption`, `1994-08-08`],
  [`The Godfather`, `1972-09-09`],
  [`Back to the Future`, `1985-10-10`],
  [`The Silence of the Lambs`, `1991-11-11`],
  [`Casablanca`, `1942-12-12`],
  [`Psycho`, `1960-01-01`],
  [`The Green Mile`, `1999-02-02`],
  [`Alien`, `1979-03-03`]
];

const Directors = [`Francis Ford Coppola`, `Quentin Tarantino`, `Martin Scorsese`];

const Posters = [
  `./images/posters/moonrise.jpg`,
  `./images/posters/accused.jpg`,
  `./images/posters/blackmail.jpg`,
  `./images/posters/blue-blazes.jpg`,
  `./images/posters/fuga-da-new-york.jpg`,
  `./images/posters/three-friends.jpg`];

const Comments = [`So long-long story, boring!`, `It was very exciting movie`,
  `My children were chocked by this movie`];

const textForDescr = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at
fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex,
convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris,
condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel
aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.
Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.
`;

const getAllFilms = () => {

  const films = [];

  for (let el of Films) {
    const [name, releaseDate] = el;

    const film = {
      name,
      originalName: name,
      releaseDate,
      genre: getRandomElement([`Sci-Fi`, `Animation`, `Fantasy`, `Comedy`, `TV Series`]),
      duration: getRandomInt(120, 240),
      age: getRandomElement([`5+`, `10+`, `18+`]),
      country: getRandomElement([`USA`, `Canada`, `France`]),

      director: getRandomElement(Directors),
      writers: getRandomElement(Directors),
      actors: getRandomElement([`Brad Pitt`, `Harrison Ford`, `Keanu Reeves`]),
      rating: getRandomFrac(5, 9),
      descr: textForDescr
      .split(`.`)
      .map((it) => it.replace(`/n  `, ``))
      .slice()
      .sort(compareRandom)
      .slice(0, getRandomInt(0, 3))
      .join(`.`),
      comments: {
        text: getRandomElement(Comments),
        author: getRandomElement([`John Smith`, `Tony Williams`, `Alex Brown`]),
        day: new Date(getRandomInt(Date.now() - MS_IN_WEEK, Date.now())),
      },
      commentsCounter: getRandomInt(0, 100),
      poster: getRandomElement(Posters),

      userComment: {
        text: ``,
        author: `You`,
        day: new Date(),
      },

      userScore: ``,

      state: {
        isWatched: false,
        inWatchList: false,
        isFavorite: false,
      },
    };

    films.push(film);
  }

  return films;
};

export default getAllFilms;
