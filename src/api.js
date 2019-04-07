import ModelFilm from './model-film';

const MESSAGE_SHOW_INTERVAL = 1000;
const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};
const SUCCESS_STATUS_MIN = 200;
const SUCCESS_STATUS_MAX = 299;

const LOAD_MESSAGE = `Loading movies...`;
const ERROR_MESSAGE =
`Something went wrong while loading movies.
Check your connection or try again later`;

const createMessage = (message) => {
  const messageElement = document.createElement(`div`);

  const messageContainer = document.querySelector(`.main`);

  messageElement.style =
  `z-index: 100; margin: 300 auto; text-align: center; background-color: grey;`;
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
  if (response.status >= SUCCESS_STATUS_MIN && response.status <= SUCCESS_STATUS_MAX) {
    createMessage(LOAD_MESSAGE);
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};

class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
    this._headerType = {
      'Content-Type': `application/json`
    };
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
      headers: new Headers(this._headerType)
    })
      .then(toJSON)
      .then(ModelFilm.parseFilm);
  }

  updateFilm({id, data}) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers(this._headerType)
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
            createMessage(ERROR_MESSAGE);
            // console.error(`fetch error: ${err}`);
            throw err;
          });
  }
}

export default API;
