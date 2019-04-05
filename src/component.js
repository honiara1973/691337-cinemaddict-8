import makeFilmCard from './create-element';

class Component {
  constructor() {

    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }

    this._element = null;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  render() {
    this._element = makeFilmCard(this.template);
    this.createListeners();
    return this._element;
  }

  unrender() {
    this.removeListeners();
    this._element = null;
  }

  createListeners() {}
  removeListeners() {}

}

export default Component;
