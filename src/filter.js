import Component from './component';

class Filter extends Component {
  constructor(data) {
    super();
    this._caption = data.caption;
    this._hasCounter = data.hasCounter;
    this._isAdditional = data.isAdditional;
    this._counter = data.counter;
    this._isActive = data.isActive;
  }

  _captionToHref() {
    return this._caption.toLowerCase()
      .split(` `)[0];
  }

  get template() {
    return `
      <a href="${this._captionToHref()}"
      class="main-navigation__item
    ${this._isActive ? `main-navigation__item--active` : ``}
    ${this._isAdditional ? `main-navigation__item--additional` : ``}
  ">
    ${this._caption}
    ${this._hasCounter ?
    `<span class="main-navigation__item-count">${this._counter}</span>` : ``}
    </a>
    `.trim();
  }
}

export default Filter;
