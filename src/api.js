import ModelFilm from './model-film';

const MESSAGE_SHOW_INTERVAL = 3000;
const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const loadMessage = `Loading movies...`;
const errorMessage =
`Something went wrong while loading movies.
Check your connection or try again later`;

const createMessage = (message) => {
  const messageElement = document.createElement(`div`);

  const messageContainer = document.querySelector(`.main`);

  messageElement.style =
  `z-index: 100; margin: 300 auto; text-align: center; background-color: red;`;
  messageElement.style.position = `fixed`;
  messageElement.style.left = 0;
  messageElement.style.right = 0;
  messageElement.style.fontSize = `24px`;

  messageElement.textContent = message;
  messageContainer.insertAdjacentElement(`afterbegin`, messageElement);

  setTimeout(() => {
    messageContainer.removeChild(messageElement);
  }, MESSAGE_SHOW_INTERVAL);
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    createMessage(loadMessage);
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};

const API = class {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({url: `movies`})
          .then(toJSON)
          .then(ModelFilm.parseFilms);
  }

  createFilm({filmData}) {
    return this._load({
      url: `movies`,
      method: Method.POST,
      body: JSON.stringify(filmData),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelFilm.parseFilm);
  }

  updateFilm({id, data}) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelFilm.parseFilm);
  }

  deleteFilm({id}) {
    return this._load({url: `movies/${id}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
          .then(checkStatus)
          .catch((err) => {
            createMessage(errorMessage);
            // console.error(`fetch error: ${err}`);
            throw err;
          });
  }
};

export default API;
