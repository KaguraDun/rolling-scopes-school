export default function getRSSNews() {
  return fetch(
    'https://cors-anywhere.herokuapp.com/https://www.ecdc.europa.eu/en/taxonomy/term/2942/feed',
    {
      headers: { Origin: window.location.origin },
    },
  )
    .then((response) => response.text())
    .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
    .then((data) => {
      const items = data.querySelectorAll('item');
      let html = '';
      items.forEach((el) => {
        html += `
        <article class="news__item">
          <p class="pubDate">${el.querySelector('pubDate').innerHTML}</p>
            <a href="${el.querySelector('link').innerHTML}" 
            target="_blank" rel="noopener" class="news_link">
              ${el.querySelector('title').innerHTML}
            </a>
        </article>
      `;
      });
      return html;
    });
}
