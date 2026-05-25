export type Article = {
  id_article:       string;
  titre:            string;
  description:      string | null;
  contenu_brut:     string | null;
  url_origine:      string;
  vignette:         string | null;
  date_publication: string;
  zone:             string | null;
  pays:             string | null;
  nom_source:       string;
  resume_auto:      string | null;
  score_confiance:  number | null;
  entites_nommees:  {
    organisations: string[];
    personnes:     string[];
    lieux:         string[];
  } | null;
  categories:       string[];
};

export type ArticlesResponse = {
  articles: Article[];
  total:    number;
  limit:    number;
  offset:   number;
};
