// Génère le site statique d'Auger Électrique dans ./site
// Usage : node build.mjs  (génère ./docs, publié par GitHub Pages)
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "docs");
const SITE = "https://augerelectrique.ca";
const TEL = "819-333-5500";
const TEL_LINK = "tel:+18193335500";
const ADDR = "440, 2e rue Est, La Sarre (Québec) J9Z 2J3";
const MAPS = "https://www.google.com/maps/search/?api=1&query=440+2e+rue+Est+La+Sarre+QC+J9Z+2J3";
const FB = "https://www.facebook.com/ElectricienLaSarre";
const YEAR = new Date().getFullYear();

const ICONS = {
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  shop: '<path d="M3 9l1.5-5h15L21 9M3 9h18v11H3zM9 20v-6h6v6"/>',
  factory: '<path d="M3 21V10l6 4V10l6 4V4h6v17zM7 17h2M12 17h2M17 17h2"/>',
  plug: '<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4"/>',
  flame: '<path d="M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-6 6-6 10-1-1-2-2-2-4-1 2-1 4-1 6 0 4 3 7 7 7z"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  pin: '<path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
};
const icon = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

const SERVICES = [
  ["home", "Résidentiel", "Auger Électrique peut répondre à tous vos besoins électriques résidentiels, que ce soit pour des projets de construction neuve ou de réparation. Vous n’avez qu’à nous contacter pour une évaluation juste de vos besoins."],
  ["shop", "Commercial", "Entrées électriques, mises à la terre, paratonnerres, chauffage, éclairage, câblage : Auger Électrique offre un éventail de services électriques pour les commerces de La Sarre et des environs."],
  ["factory", "Industriel", "Fort d’une expertise spécialisée dans le domaine industriel, Auger Électrique répond avec précision et efficacité à chaque projet électrique, avec des solutions adaptées et durables."],
  ["plug", "Borne de recharge", "Notre équipe possède toute l’expertise pour l’installation électrique complète de votre borne de recharge résidentielle pour véhicule électrique."],
  ["flame", "Chauffage", "Il existe plusieurs façons de chauffer une pièce. Une consultation avec votre maître électricien permet de bien évaluer vos besoins et de vous proposer le type de chauffage approprié."],
];

const SHORT = {"Résidentiel":"Construction neuve, rénovation et réparation pour la maison.","Commercial":"Entrées électriques, mises à la terre, éclairage et câblage pour les commerces.","Industriel":"Des solutions précises, adaptées et durables pour l’industrie.","Borne de recharge":"Installation électrique complète de votre borne pour véhicule électrique.","Chauffage":"Conseils et installation du type de chauffage adapté à vos besoins."};

const FAQ = [
  ["Quels services proposez-vous?", "Nous offrons une gamme complète de services électriques, comprenant l’installation, la réparation, l’entretien et la mise à niveau de systèmes électriques résidentiels, commerciaux et industriels."],
  ["Êtes-vous agréés et assurés?", "Oui, nous sommes dûment agréés et assurés pour exercer nos activités d’électriciens professionnels. Vous pouvez avoir confiance en notre expertise et notre engagement en matière de sécurité."],
  ["Comment puis-je obtenir une soumission?", `Il vous suffit de nous appeler au ${TEL}. Nous serons ravis de discuter de vos besoins et de vous fournir une estimation détaillée, gratuitement.`],
  ["Quels sont vos délais d’intervention?", "Nos délais varient selon la nature et l’urgence de chaque projet. Nous nous efforçons toujours de répondre rapidement à vos demandes et de respecter les délais convenus."],
  ["Quelle est votre zone de service?", "Nous sommes basés à La Sarre et desservons également les régions environnantes en Abitibi-Ouest. Contactez-nous pour vérifier si nous couvrons votre emplacement."],
];

// Données structurées : entreprise locale (aide Google à afficher l'entreprise dans les recherches locales)
const BUSINESS = {
  "@type": "Electrician",
  "@id": `${SITE}/#entreprise`,
  name: "Auger Électrique inc.",
  url: `${SITE}/`,
  logo: `${SITE}/img/og-auger.png`,
  image: `${SITE}/img/og-auger.png`,
  telephone: "+1-819-333-5500",
  priceRange: "$$",
  foundingDate: "2016",
  address: { "@type": "PostalAddress", streetAddress: "440, 2e rue Est", addressLocality: "La Sarre", addressRegion: "QC", postalCode: "J9Z 2J3", addressCountry: "CA" },
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:00" }],
  areaServed: ["La Sarre", "Abitibi-Ouest", "Abitibi-Témiscamingue"],
  sameAs: [FB],
  knowsAbout: ["Électricité résidentielle", "Électricité commerciale", "Électricité industrielle", "Entrée électrique", "Panneau électrique", "Borne de recharge", "Chauffage électrique", "Éclairage"],
};

function page({ path, title, description, current, body, extraLd = [] }) {
  const depth = path.split("/").filter(Boolean).length;
  const r = depth ? "../".repeat(depth) : "./"; // chemins relatifs : fonctionne partout
  const url = SITE + path;
  const ld = { "@context": "https://schema.org", "@graph": [BUSINESS, { "@type": "WebPage", "@id": url + "#page", url, name: title, description, inLanguage: "fr-CA", about: { "@id": BUSINESS["@id"] } }, ...extraLd] };
  const nav = [["", "Accueil"], ["services/", "Services"], ["realisations/", "Réalisations"], ["contact/", "Contact"]]
    .map(([p, l]) => `<li><a href="${r}${p}"${current === l ? ' aria-current="page"' : ""}>${l}</a></li>`).join("");
  return `<!doctype html>
<html lang="fr-CA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="geo.region" content="CA-QC">
<meta name="geo.placename" content="La Sarre">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_CA">
<meta property="og:site_name" content="Auger Électrique inc.">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/img/og-auger.png">
<link rel="icon" type="image/png" href="${r}img/og-auger.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${r}style.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<div class="topbar"><div class="wrap">
  <span>Urgence : <a href="${TEL_LINK}">${TEL}</a></span>
  <span>440, 2e rue Est, La Sarre (Québec)</span>
  <span>Du lundi au vendredi, 8 h à 17 h</span>
</div></div>
<header class="site"><div class="wrap">
  <a class="logo" href="${r}"><img src="${r}img/logo_Auger_Electrique_2018.png" alt="Auger Électrique inc." width="601" height="308"></a>
  <button class="menu-toggle" aria-expanded="false" aria-controls="menu">Menu</button>
  <nav id="menu" aria-label="Menu principal"><ul>${nav}</ul></nav>
  <a class="btn head-cta" href="${TEL_LINK}">Estimation</a>
</div></header>
<main>
${body}
</main>
<section class="cta"><div class="wrap">
  <h2>Un projet électrique? Une urgence?</h2>
  <p>Appelez-nous pour une estimation gratuite.</p>
  <a class="btn" href="${TEL_LINK}">${TEL}</a>
</div></section>
<footer class="site"><div class="wrap">
  <div class="cols">
    <div>
      <img src="${r}img/logo_Auger_Electrique_2018.png" alt="Auger Électrique inc." width="160" height="82" loading="lazy">
      <p>Entrepreneur électricien à La Sarre depuis 2016.</p>
      <img class="cmeq" src="${r}img/01-Logo_CMEQ_RGB_300DPI-white-284w.webp" alt="Membre de la Corporation des maîtres électriciens du Québec (CMEQ)" width="140" height="44" loading="lazy">
    </div>
    <div>
      <h4>Nous joindre</h4>
      <ul>
        <li><a href="${TEL_LINK}">${TEL}</a></li>
        <li><a href="${MAPS}" rel="noopener" target="_blank">${ADDR}</a></li>
        <li>Lundi au vendredi, 8 h à 17 h</li>
        <li><a href="${FB}" rel="noopener" target="_blank">Facebook</a></li>
      </ul>
    </div>
    <div>
      <h4>Nos services</h4>
      <ul>${SERVICES.map(([, t]) => `<li><a href="${r}services/">${t}</a></li>`).join("")}</ul>
    </div>
  </div>
  <div class="bottom">
    <span>© ${YEAR} Auger Électrique inc. Tous droits réservés.</span>
    <a href="${r}cookie-policy-ca/">Politique de confidentialité</a>
  </div>
</div></footer>
<script>
  const b=document.querySelector('.menu-toggle'),n=document.getElementById('menu');
  b.addEventListener('click',()=>{const o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)});
</script>
</body>
</html>
`;
}

const faqHtml = `<div class="faq">${FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>`;
const faqLd = { "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
const faqSection = `<section class="alt"><div class="wrap center">
  <h2>Questions fréquentes</h2>
  <p class="lead">Vous ne trouvez pas la réponse à votre question? N’hésitez pas à nous appeler.</p>
  ${faqHtml}
</div></section>`;

const pages = [
  {
    path: "/", current: "Accueil",
    title: "Électricien à La Sarre | Auger Électrique inc.",
    description: "Auger Électrique, votre électricien de confiance à La Sarre depuis 2016 : résidentiel, commercial, industriel, bornes de recharge et chauffage. Estimation gratuite.",
    extraLd: [faqLd],
    body: `<section class="hero"><div class="wrap">
  <span class="eyebrow">En affaires depuis 2016</span>
  <h1>Votre expert électricien à La Sarre</h1>
  <p>Auger Électrique est votre électricien de confiance à La Sarre et en Abitibi-Ouest, offrant une gamme complète de services pour répondre à tous vos besoins.</p>
  <div class="actions"><a class="btn" href="${TEL_LINK}">Appeler : ${TEL}</a><a class="btn outline" href="services/">Nos services</a></div>
</div></section>
<section><div class="wrap center">
  <h2>Nos services électriques</h2>
  <p class="lead">Des solutions sur mesure pour la maison, le commerce et l’industrie.</p>
  <div class="cards" style="text-align:left">
    ${SERVICES.map(([i, t, d]) => `<div class="card"><div class="ico">${icon(i)}</div><h3>${t}</h3><p>${SHORT[t]}</p></div>`).join("")}
  </div>
  <p style="margin-top:28px"><a class="btn" href="services/">Voir tous nos services</a></p>
</div></section>
<section class="alt"><div class="wrap two">
  <div>
    <h2>Pourquoi faire affaire avec nous</h2>
    <p>Auger Électrique offre des services d’entrepreneur électricien. Vous pouvez nous faire confiance pour vos travaux de réparation et d’installation résidentiels, commerciaux, agricoles, municipaux et industriels.</p>
    <ul class="checks">
      <li>Approche personnalisée et adaptée</li>
      <li>Qualité et professionnalisme</li>
      <li>Engagement envers la satisfaction client</li>
    </ul>
  </div>
  <div class="panel">
    <h3>Estimation gratuite</h3>
    <p>Choisissez Auger Électrique pour des solutions sur mesure et une satisfaction garantie.</p>
    <a class="big" href="${TEL_LINK}">${TEL}</a>
    <p>Du lundi au vendredi, de 8 h à 17 h<br>440, 2e rue Est, La Sarre</p>
  </div>
</div></section>
${faqSection}`,
  },
  {
    path: "/services/", current: "Services",
    title: "Services électriques à La Sarre | Auger Électrique inc.",
    description: "Résidentiel, commercial, industriel, entrée et panneau électrique, borne de recharge, construction, rénovation, piscine, spa, chauffage et éclairage à La Sarre.",
    extraLd: [faqLd],
    body: `<section class="hero small"><div class="wrap">
  <span class="eyebrow">Votre sécurité, notre priorité</span>
  <h1>Nos services électriques</h1>
  <p>Industriel – Commercial – Résidentiel – Entrée électrique – Panneau électrique – Borne de recharge – Construction – Rénovation – Piscine – Spa – Chauffage – Éclairage</p>
</div></section>
<section><div class="wrap">
  ${SERVICES.map(([i, t, d]) => `<div class="service"><div class="ico">${icon(i)}</div><div><h2 style="font-size:24px;margin-bottom:6px">${t}</h2><p>${d}</p></div></div>`).join("")}
  <p style="margin-top:28px"><a class="btn" href="${TEL_LINK}">Estimation gratuite : ${TEL}</a></p>
</div></section>
<section class="alt"><div class="wrap">
  <span class="eyebrow">Votre expert électricien à La Sarre</span>
  <h2>Quatre raisons de choisir Auger Électrique</h2>
  <div class="reasons">
    <div><p>En affaires depuis 2016, nous avons une solide expérience dans le domaine.</p></div>
    <div><p>Nous offrons des services électriques résidentiels, commerciaux et industriels adaptés à vos besoins.</p></div>
    <div><p>Notre équipe d’électriciens certifiés garantit des travaux sécuritaires et conformes aux normes.</p></div>
    <div><p>Notre priorité : un service de qualité supérieure et une relation de confiance avec nos clients.</p></div>
  </div>
</div></section>
${faqSection.replace('class="alt"', "")}`,
  },
  {
    path: "/realisations/", current: "Réalisations",
    title: "Réalisations | Auger Électrique inc., électricien à La Sarre",
    description: "Quelques exemples des projets électriques résidentiels, commerciaux et industriels réalisés par Auger Électrique à La Sarre et en Abitibi-Ouest.",
    body: `<section class="hero small"><div class="wrap">
  <h1>Nos réalisations</h1>
  <p>Chez Auger Électrique, nous sommes fiers des projets que nous avons réalisés au fil des années.</p>
</div></section>
<section><div class="wrap center">
  <h2>Plus à venir bientôt!</h2>
  <p class="lead">Nous ajouterons sous peu des exemples de nos travaux. En attendant, suivez nos projets récents sur notre page Facebook.</p>
  <p style="margin-top:24px"><a class="btn" href="${FB}" rel="noopener" target="_blank">Voir notre page Facebook</a></p>
</div></section>`,
  },
  {
    path: "/contact/", current: "Contact",
    title: "Contact | Auger Électrique inc., électricien à La Sarre",
    description: `Contactez Auger Électrique à La Sarre pour une soumission gratuite ou une urgence : ${TEL}. 440, 2e rue Est, La Sarre (Québec).`,
    body: `<section class="hero small"><div class="wrap">
  <span class="eyebrow">Auger Électrique inc.</span>
  <h1>Contactez-nous</h1>
  <p>Pour toute demande de renseignements ou pour obtenir une soumission gratuite, n’hésitez pas à nous appeler. Nous sommes là pour répondre à vos questions et vous aider à réaliser vos projets électriques.</p>
</div></section>
<section><div class="wrap">
  <div class="contact-grid">
    <div class="card"><div class="ico">${icon("phone")}</div><h3>Téléphone et urgence</h3><a href="${TEL_LINK}">${TEL}</a></div>
    <div class="card"><div class="ico">${icon("pin")}</div><h3>Adresse</h3><p><a href="${MAPS}" rel="noopener" target="_blank" style="font-size:17px">${ADDR}</a></p></div>
    <div class="card"><div class="ico">${icon("clock")}</div><h3>Heures d’ouverture</h3><p>Du lundi au vendredi<br>de 8 h à 17 h</p></div>
  </div>
</div></section>`,
  },
  {
    path: "/cookie-policy-ca/", current: "",
    title: "Politique de confidentialité | Auger Électrique inc.",
    description: "Politique de confidentialité d’Auger Électrique inc., conformément à la Loi 25 sur la protection des renseignements personnels dans le secteur privé au Québec.",
    body: `<section class="hero small"><div class="wrap"><h1>Politique de confidentialité</h1></div></section>
<section><div class="wrap prose">
  <p>Auger Électrique inc. s’engage à protéger la confidentialité des renseignements personnels, conformément à la <em>Loi sur la protection des renseignements personnels dans le secteur privé</em> du Québec (Loi 25).</p>
  <h2>Renseignements recueillis par ce site</h2>
  <p>Ce site Web ne comporte aucun formulaire et n’utilise aucun fichier témoin (cookie) de suivi, de statistiques ou de publicité. Nous ne recueillons donc aucun renseignement personnel par l’entremise du site.</p>
  <h2>Renseignements que vous nous transmettez</h2>
  <p>Lorsque vous communiquez avec nous par téléphone, nous pouvons recueillir votre nom, vos coordonnées et l’adresse des travaux. Ces renseignements servent uniquement à vous fournir une soumission et à réaliser les travaux demandés. Ils ne sont jamais vendus ni communiqués à des tiers, sauf si la loi l’exige.</p>
  <h2>Services tiers</h2>
  <p>Ce site affiche des polices de caractères fournies par Google Fonts. Les liens vers Google Maps et Facebook vous dirigent vers des sites externes soumis à leurs propres politiques de confidentialité.</p>
  <h2>Vos droits</h2>
  <p>Vous pouvez demander l’accès à vos renseignements personnels, leur rectification ou leur suppression, ou retirer votre consentement à leur utilisation.</p>
  <h2>Responsable de la protection des renseignements personnels</h2>
  <p>La personne responsable de la protection des renseignements personnels est la direction d’Auger Électrique inc. Pour exercer vos droits ou pour toute question :</p>
  <p><strong>Téléphone :</strong> <a href="${TEL_LINK}">${TEL}</a><br><strong>Par la poste :</strong> ${ADDR}</p>
  <p><em>Dernière mise à jour : ${new Date().toISOString().slice(0, 10)}</em></p>
</div></section>`,
  },
];

for (const p of pages) {
  const dir = join(OUT, p.path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), page(p));
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${SITE}${p.path}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`);
writeFileSync(join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
// Page 404 simple qui renvoie à l'accueil
writeFileSync(join(OUT, "404.html"), page({ path: "/", current: "", title: "Page introuvable | Auger Électrique inc.", description: "Cette page n’existe pas.", body: `<section class="hero small"><div class="wrap"><h1>Page introuvable</h1><p>La page demandée n’existe pas ou a été déplacée.</p><div class="actions"><a class="btn" href="/">Retour à l’accueil</a></div></div></section>` }).replace(/href="\.\//g, 'href="/').replace(/src="\.\//g, 'src="/').replace('<meta name="robots" content="index, follow, max-image-preview:large">', '<meta name="robots" content="noindex">'));

console.log("Site généré :", pages.length, "pages + sitemap.xml, robots.txt, 404.html");
writeFileSync(join(OUT, "CNAME"), "augerelectrique.ca\n");
writeFileSync(join(OUT, ".nojekyll"), "");
