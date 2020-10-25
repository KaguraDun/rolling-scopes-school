class Quote {
  constructor(blockquote, figcaption) {
    this.blockquote = document.querySelector(blockquote);
    this.figcaption = document.querySelector(figcaption);
  }

  async getQuote() {
    const url = `https://favqs.com/api/qotd`;
    const res = await fetch(url);
    const data = await res.json();
    this.blockquote.textContent = data.quote["body"];
    this.figcaption.textContent = data.quote["author"];
  }
}
