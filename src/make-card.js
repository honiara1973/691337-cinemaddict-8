export default (template) => {
  const newCard = document.createElement(`div`);
  newCard.innerHTML = template;
  return newCard.firstChild;
};

/* export default (film, controls = true) => {
  return `
  <article
  ${controls ? `
  class="film-card"
  ` : `
  class="film-card film-card--no-controls"
  `}>
    <h3 class="film-card__title">${film.name}</h3>
    <p class="film-card__rating">${film.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${film.year}</span>
      <span class="film-card__duration">${film.duration}</span>
      <span class="film-card__genre">${film.genre}</span>
    </p>
    <img src="${film.poster}" alt="" class="film-card__poster">
    ${controls ? `
      <p class="film-card__description">
       ${film.descr}</p>
       ` : ``}
    <button class="film-card__comments">${film.comments} comments</button>
    ${controls ? `
    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
    </form>
    ` : ``}
  </article>
  `;
};
*/
