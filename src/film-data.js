import {getRandomFrac, compareRandom, getRandomInt, getRandomElement} from './utils';

const Films = [
  [`Shindler's List`, `1993`, `epic drama`, `2h 00m`],
  [`The Matrix`, `1999`, `science fiction`, `2h 05m`],
  [`The Dark Knight`, `2008`, `superhero`, `2h 10m`],
  [`Titanic`, `1997`, `disaster drama`, `2h 15m`],
  [`Jurassic Park`, `1993`, `fiction adventure`, `2h 20m`],
  [`Gladiator`, `2000`, `historical drama`, `2h 25m`],
  [`Star Wars`, `1977`, `epic space opera`, `2h 30m`],
  [`The Shawshank Redemption`, `1994`, `drama`, `2h 35m`],
  [`The Godfather`, `1972`, `crime`, `2h 40m`],
  [`Back to the Future`, `1985`, `comic science fiction`, `2h 45m`],
  [`The Silence of the Lambs`, `1991`, `thriller`, `2h 50m`],
  [`Casablanca`, `1942`, `drama`, `2h 55m`],
  [`Psycho`, `1960`, `horror`, `3h 00m`],
  [`The Green Mile`, `1999`, `fantasy drama`, `3h 05m`],
  [`Alien`, `1979`, `horror`, `3h 10m`]
];

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
    const [name, year, genre, duration] = el;
    const film = {
      name,
      year,
      genre,
      duration,
      rating: getRandomFrac(5, 10),
      descr: textForDescr
      .split(`.`)
      .map((it) => it.replace(`/n  `, ``))
      .slice()
      .sort(compareRandom)
      .slice(0, getRandomInt(0, 3))
      .join(`.`),
      comments: getRandomInt(0, 100),
      poster: getRandomElement(Posters),
    };
    films.push(film);
  }

  return films;
};

export default getAllFilms;
