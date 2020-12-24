export default function renderElement(tagName, classList, parentElement, innerText) {
  const element = document.createElement(tagName);

  classList.forEach((className) => {
    element.classList.add(className);
  });

  if (innerText) element.textContent = innerText;
  parentElement.append(element);

  return element;
}
