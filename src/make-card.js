export default (template) => {
  const newCard = document.createElement(`div`);
  newCard.innerHTML = template;
  return newCard.firstChild;
};
