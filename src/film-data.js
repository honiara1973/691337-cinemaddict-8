import {getRandomFrac, compareRandom, getRandomInt, getRandomElement} from './utils';

const Films = [
  [`Shindler's List`, `1993`, [`Epic drama`], `2h 00m`],
  [`The Matrix`, `1999`, [`Science fiction`], `2h 05m`],
  [`The Dark Knight`, `2008`, [`Superhero`], `2h 10m`],
  [`Titanic`, `1997`, [`Disaster drama`], `2h 15m`],
  [`Jurassic Park`, `1993`, [`Fiction`, `Adventure`], `2h 20m`],
  [`Gladiator`, `2000`, [`Historical drama`], `2h 25m`],
  [`Star Wars`, `1977`, [`Epic space`, `Opera`], `2h 30m`],
  [`The Shawshank Redemption`, `1994`, [`Drama`], `2h 35m`],
  [`The Godfather`, `1972`, [`Crime`], `2h 40m`],
  [`Back to the Future`, `1985`, [`Comic`, `Science fiction`], `2h 45m`],
  [`The Silence of the Lambs`, `1991`, [`Thriller`], `2h 50m`],
  [`Casablanca`, `1942`, [`Drama`], `2h 55m`],
  [`Psycho`, `1960`, [`Horror`], `3h 00m`],
  [`The Green Mile`, `1999`, [`Fantasy`, `drama`], `3h 05m`],
  [`Alien`, `1979`, [`Horror`], `3h 10m`]
];

const Directors = [`Francis Ford Coppola`, `Quentin Tarantino`, `Martin Scorsese`];

const Posters = [
  `./images/posters/moonrise.jpg`,
  `./images/posters/accused.jpg`,
  `./images/posters/blackmail.jpg`,
  `./images/posters/blue-blazes.jpg`,
  `./images/posters/fuga-da-new-york.jpg`,
  `./images/posters/three-friends.jpg`];

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
    const [name, releaseDate, genre, duration] = el;
    const film = {
      name,
      originalName: name,
      releaseDate,
      genre,
      duration,
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
      comments: getRandomInt(0, 100),
      poster: getRandomElement(Posters),
      userComment: ``,
    };
    films.push(film);
  }

  return films;
};

export default getAllFilms;
