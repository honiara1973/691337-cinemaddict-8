export const getRandomInt = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min;
export const getRandomFrac = (min, max) => (Math.random() * (max - min) + min).toFixed(1);
export const getRandomElement = (array) => array[getRandomInt(0, array.length - 1)];
export const compareRandom = (a, b) => Math.random(a, b) - 0.5;
export const minToHours = (num) => {
  const hours = Math.floor(num / 60);
  const minutes = num % 60;
  return `${hours}h ${minutes}m`;
};
