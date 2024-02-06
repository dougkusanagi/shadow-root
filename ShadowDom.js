import { isUrl } from "./utils.js";

export default class ShadowDom {
  constructor({ host }) {
    this.host = host;
    this.dom = this.host.attachShadow({ mode: "open" });

    this.previousHighlightedElement = null;
    this.dom.addEventListener("click", this.#onClick.bind(this));
    this.dom.addEventListener("mouseover", this.#onMouseOver.bind(this));
  }

  create(html) {
    const container = this.#container();
    let head = this.#parsedElement({ html, element: "head" });
    head = `<div id="shadow_root_head">${head.innerHTML}</div>`;
    let body = this.#parsedElement({ html, element: "body" });
    body = `<div id="shadow_root_body">${body.innerHTML}</div>`;
    container.innerHTML = head + body;
    this.dom.appendChild(container);
  }

  getHeadFromHTML({ html }) {
    const dom = new DOMParser().parseFromString(html, "text/html");
    return dom.getElementById("shadow_root_head");
  }

  getBodyFromHTML({ html }) {
    const dom = new DOMParser().parseFromString(html, "text/html");
    return dom.getElementById("shadow_root_body");
  }

  #onMouseOver(event) {
    if (event.target instanceof Element) {
      if (this.previousHighlightedElement) {
        this.previousHighlightedElement.style.outline = "";
        this.previousHighlightedElement.style.background = "";
      }

      event.target.style.outline = "3px solid rgba(100, 0, 180, 0.3)";
      event.target.style.background = "rgba(100, 0, 180, 0.1)";

      this.previousHighlightedElement = event.target;
    }
  }

  #onClick(event) {
    event.preventDefault();
    const element = this.#element({ event });
    this.#event(element);
  }

  #parsedElement({ html, element }) {
    const dom = new DOMParser().parseFromString(html, "text/html");
    return dom[element];
  }

  #container() {
    const container = document.createElement("div");
    container.style.cursor = "pointer";
    container.id = "shadow_root_container";

    return container;
  }

  #element({ event }) {
    return event.target;
  }

  #isContentElement(element) {
    const element_type = element.tagName;
    const not_content_elements = ["IMG", "A"];
    return !not_content_elements.includes(element_type);
  }

  #event(element) {
    const element_type = element.tagName;

    if (this.#isContentElement(element)) {
      // this.#textElement(element);
      element.contentEditable = true;
    }

    if (element_type === "IMG") {
      this.#imageElement(element);
    }

    if (element_type === "A") {
      this.#linkElement(element);
    }
  }

  #linkElement(element) {
    const old_href = element.href;
    const new_href = window.prompt(
      "VOCÊ ESTÁ EDITANDO UM LINK.\nDigite o novo link: ",
      old_href
    );

    if (!new_href) {
      return;
    }

    if (!isUrl(new_href)) {
      alert("O link informado é inválido");
      return;
    }

    element.href = new_href;
  }

  #textElement(element) {
    const old_text = element.innerHTML;
    const new_text = window.prompt(
      "VOCÊ ESTÁ EDITANDO UM TEXTO.\nDigite o novo texto: ",
      old_text
    );

    if (new_text) {
      element.innerHTML = new_text;
    }
  }

  #imageElement(element) {
    const old_src = element.src;
    const new_src = window.prompt(
      "VOCÊ ESTÁ EDITANDO UMA IMAGEM.\nDigite o novo link da imagem: ",
      old_src
    );

    if (!new_src || !isUrl(new_src)) {
      alert("O link informado é inválido");
      return;
    }

    if (element.parentElement.tagName === "FIGURE") {
      element.parentElement.innerHTML = `<img src="${new_src}" alt="${element.alt}" />`;
    } else {
      element.src = new_src;
    }
  }
}
