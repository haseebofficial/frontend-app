import React from "react";
import { getAppLocale } from "i18n";
import locales, { availableLocales } from "i18n/locales";
import { Helmet } from "react-helmet";
import { useAlternateLangUrls } from "app_page/app_page_route";

export default function LayoutHelmet({
  description="Interpreters Travel", 
  title="Interpreters Travel", 
  keywords,
  pageLocales=availableLocales,
  children
}) {
  let locale = getAppLocale();
  let dir = locale === locales.ar ? "rtl" : "";
  let alternateLangUrls = useAlternateLangUrls(pageLocales);
  let defaultLangUrl = alternateLangUrls.en;

  return (
    <Helmet>
      <html lang={locale}/>
      <body className={`lang-${locale}`} dir={dir}/>

      <title>{title}</title>
      <meta content={title} property="og:title"/>
      <meta content={description} name="description"/>
      <meta content={description} property="og:description"/>

      {defaultLangUrl ?
        <link href={defaultLangUrl} hrefLang="x-default" rel="alternate"/>
        :
        null
      }
      {Object.entries(alternateLangUrls).map(([locale, url]) =>
        <link href={url} hrefLang={locale} rel="alternate" key={locale}/>
      )}
      {keywords ?
        <meta content={keywords} name="keywords"/>
        :
        null
      }

      {children}
    </Helmet>
  );
}

export function fullTitle(addition) {
  return `${addition} | Interpreters Travel`;
}