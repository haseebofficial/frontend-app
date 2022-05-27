export default function selectLanguages(languages, yourLanguage) {
  if (yourLanguage) {
    yourLanguage = isInList(yourLanguage, languages) ? yourLanguage : "en";
    let language = firstDifferentFrom(yourLanguage, languages);

    return { yourLanguage, language };
  } else {
    let language = firstDifferentFrom("en", languages);

    return { yourLanguage: "en", language };
  }
}

function isInList(iso, languages) {
  return languages.some(l => l.iso === iso);
}

function firstDifferentFrom(iso, languages) {
  return languages.find(l => l.iso !== iso).iso;
}