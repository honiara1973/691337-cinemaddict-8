import ModelFilm from './model-film';
import {onLoad} from './utils';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const loadMessage = `Loading movies...`;
const errorMessage =
`Something went wrong while loading movies. Check your connection or try again later`;

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    onLoad(errorMessage);
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
    .then(onLoad(loadMessage))
          .then(checkStatus)
          .catch((err) => {
            console.error(`fetch error: ${err}`);
            throw err;
          });
  }
};

export default API;
