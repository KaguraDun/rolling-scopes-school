export default function renderElement(tagName, classList, parentName, innerText) {
  const element = document.createElement(tagName);

  classList.forEach((className) => {
    element.classList.add(className);
  });

  if (innerText) element.textContent = innerText;
  parentName.append(element);

  return element;
}
