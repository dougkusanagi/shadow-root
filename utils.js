export function isUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

export async function fetchPage({ page = 0 }) {
  const url = `pages/${page}/index.html`;
  const response = await fetch(url);
  return await response.text();
}

export function downloadStringAsFile({
  content = "",
  filename = "yourTextFile.txt",
}) {
  const blob = new Blob([content], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function normalize_html(html) {
  let html_string = html.replace(
    '<script type="module" src="/@vite/client"></script>',
    ""
  );

  return html_string;
}

export function htmlFromShadowDom({ dom }) {
  return dom.querySelector("#shadow_root_container").innerHTML;
}
