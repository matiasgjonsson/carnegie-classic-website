#!/usr/bin/env node
// Assembles public/*.html from src/content/* + the shared header/nav/footer/scripts
// defined below, so those pieces only have to be edited in one place.
// Run with: npm run build

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const CONTENT_DIR = path.join(ROOT, "src", "content");
const PUBLIC_DIR = path.join(ROOT, "public");

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    url: "https://www.facebook.com/profile.php?id=100088572796183",
    icon: "fa-facebook-f",
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/carnegieclassic/",
    icon: "fa-instagram",
  },
];

// Order here defines the nav link order on every page.
const NAV_PAGES = [
  { id: "main", file: "index.html", label: "Main" },
  { id: "soiree", file: "soiree.html", label: "Soiree" },
  { id: "competitors", file: "competitors.html", label: "Competitors" },
  { id: "spectators", file: "spectators.html", label: "Spectators" },
  { id: "workshops", file: "workshops.html", label: "Workshops" },
  { id: "housing", file: "housing.html", label: "Housing" },
  { id: "officials", file: "officials.html", label: "Officials" },
];

const PAGES = [
  {
    id: "main",
    title: "Carnegie Classic: Dance competition open to everyone",
    cover: readContent("index-intro.html"),
    content: readContent("index.html"),
    extraFooter: readContent("index-extra-footer.html"),
    extraScripts: ["assets/js/custom.js"],
  },
  {
    id: "soiree",
    title: "Starlit Soiree - Carnegie Classic",
    content: readContent("soiree.html"),
  },
  {
    id: "competitors",
    title: "Competitor info - Carnegie Classic",
    content: readContent("competitors.html"),
    extraScripts: ["assets/js/custom.js"],
  },
  {
    id: "spectators",
    title: "Spectator info - Carnegie Classic",
    content: readContent("spectators.html"),
  },
  {
    id: "workshops",
    title: "Workshop info - Carnegie Classic",
    content: readContent("workshops.html"),
  },
  {
    id: "housing",
    title: "Housing & Local Transportation - Carnegie Classic",
    content: readContent("housing.html"),
  },
  {
    id: "officials",
    title: "Our Officials - Carnegie Classic",
    extraHeadLinks: ["assets/css/officials.css"],
    content: readContent("officials.html"),
    extraScripts: ["assets/js/officials.js"],
  },
];

function readContent(name) {
  return fs.readFileSync(path.join(CONTENT_DIR, name), "utf8").replace(/\n$/, "");
}

function renderNav(activeId) {
  const links = NAV_PAGES.map(
    (p) =>
      `\t\t<li${p.id === activeId ? ' class="active"' : ""}><a href="${p.file}">${p.label}</a></li>`
  ).join("\n");
  return `\t<nav id="nav">
\t\t<a href="index.html" class="logo">Carnegie Classic</a>
\t\t<ul class="links">
${links}
\t\t</ul>
\t</nav>`;
}

function renderFooterSocial() {
  return SOCIAL_LINKS.map(
    (s) =>
      `\t\t\t\t<li><a target="_blank" href="${s.url}" class="icon brands alt ${s.icon}"><span class="label">${s.label}</span></a></li>`
  ).join("\n");
}

function renderExtraHeadLinks(page) {
  return (page.extraHeadLinks || [])
    .map((href) => `\t\t<link rel="stylesheet" href="${href}" />`)
    .join("\n");
}

function renderScripts(page) {
  const scripts = page.extraScripts || [];
  return scripts.map((src) => `\t<script src="${src}"></script>`).join("\n");
}

function renderPage(page) {
  const extraHead = renderExtraHeadLinks(page);

  return `<!DOCTYPE html>
<html lang="en">
<head>
\t<!-- Google tag (gtag.js) -->
\t<script async src="https://www.googletagmanager.com/gtag/js?id=G-Y4Z348WHVR"></script>
\t<script>
\t\twindow.dataLayer = window.dataLayer || [];
\t\tfunction gtag(){dataLayer.push(arguments);}
\t\tgtag('js', new Date());

\t\tgtag('config', 'G-Y4Z348WHVR');
\t</script>

\t<title>${page.title}</title>
\t<meta charset="utf-8" />
\t<meta name="viewport" content="width=device-width, initial-scale=1" />
\t<link rel="stylesheet" href="assets/css/main.css" />
${extraHead ? extraHead + "\n" : ""}</head>
<body>
${page.cover ? page.cover + "\n\n" : ""}${renderNav(page.id)}

\t<main id="main">
${page.content}
\t</main>

\t<footer id="footer">
\t\t<div class="split contact">
\t\t\t<div class="alt">
\t\t\t\t<h3>Address</h3>
\t\t\t\t<p>Jared L Cohon University Center<br />
\t\t\t\t\t5032 Forbes Ave
\t\t\t\t\tPittsburgh, PA 15213</p>
\t\t\t</div>
\t\t\t<div>
\t\t\t\t<h3>Email</h3>
\t\t\t\t<p><a href="mailto:cmuclassic@gmail.com">cmuclassic@gmail.com</a></p>
\t\t\t</div>
\t\t\t<div>
\t\t\t\t<h3>Social</h3>
\t\t\t\t<ul class="icons alt">
${renderFooterSocial()}
\t\t\t\t</ul>
\t\t\t</div>
${page.extraFooter ? page.extraFooter + "\n" : ""}\t\t</div>

\t\t<div id="copyright">
\t\t\t<ul><li>&copy; CMU Ballroom Dance Club</li></ul>
\t\t</div>
\t</footer>

${renderScripts(page)}
</body>
</html>
`;
}

for (const page of PAGES) {
  const file = NAV_PAGES.find((p) => p.id === page.id).file;
  fs.writeFileSync(path.join(PUBLIC_DIR, file), renderPage(page));
  console.log(`built public/${file}`);
}
