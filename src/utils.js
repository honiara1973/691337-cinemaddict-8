const MESSAGE_SHOW_INTERVAL = 3000;

export const getRandomInt = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min;
export const getRandomFrac = (min, max) => (Math.random() * (max - min) + min).toFixed(1);
export const getRandomElement = (array) => array[getRandomInt(0, array.length - 1)];
export const compareRandom = (a, b) => Math.random(a, b) - 0.5;

export const onLoad = (message) => {

  const messageElement = document.createElement(`div`);

  messageElement.style =
  `z-index: 100; margin: 300 auto; text-align: center;`;
  messageElement.style.position = `fixed`;
  messageElement.style.left = 0;
  messageElement.style.right = 0;
  messageElement.style.fontSize = `30px`;

  messageElement.textContent = message;

  document.body.insertAdjacentElement(`afterbegin`, messageElement);

  setTimeout(() => {
    document.body.removeChild(messageElement);
  }, MESSAGE_SHOW_INTERVAL);

};
