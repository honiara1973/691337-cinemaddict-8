export const getRandomInt = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min;
export const getRandomFrac = (min, max) => (Math.random() * (max - min) + min).toFixed(1);
export const getRandomElement = (array) => array[getRandomInt(0, array.length - 1)];
export const compareRandom = (a, b) => Math.random(a, b) - 0.5;

