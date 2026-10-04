import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import ptBR from "./locales/pt-BR/translation.json";

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, "pt-BR": { translation: ptBR } },
    fallbackLng: "en",
    supportedLngs: ["en", "pt-BR"],
    load: "currentOnly",
  });
