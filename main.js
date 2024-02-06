import ShadowDom from "./ShadowDom.js";
import {
  fetchPage,
  normalize_html,
  downloadStringAsFile,
  htmlFromShadowDom,
} from "./utils.js";

alert("carregou");
document.addEventListener("DOMContentLoaded", async () => {
  const host = document.querySelector("#host");
  const html = await fetchPage({ page: 1 });
  const shadow_dom = new ShadowDom({ host });
  shadow_dom.create(normalize_html(html));

  document.getElementById("saveCopy").addEventListener("click", () => {
    const content = htmlFromShadowDom({ dom: shadow_dom.dom });

    downloadStringAsFile({ content, filename: "new_index.html" });
  });
});
