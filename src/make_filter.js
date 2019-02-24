export default (caption, amount = 0) => {

  if (caption === `All movies`) {
    return `
    <a href="#all" class="main-navigation__item main-navigation__item--active">
    ${caption}</a>
    `;
  }

  if (caption === `Stats`) {
    return `
    <a href="#stats" class="main-navigation__item main-navigation__item--additional">
    ${caption}</a>
    `;
  }

  return `
    <a href="#${caption.toLowerCase()}" class="main-navigation__item">
    ${caption}
    <span class="main-navigation__item-count">
    ${amount}</span></a>
    `;

};
