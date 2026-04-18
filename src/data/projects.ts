export type Project = {
  id: number;
  title: string;
  categories: string[];
  image: string;
  href: string;
};

export const projects: Project[] = [
  { id: 1,  title: "École Paul-Bruchési",                                   categories: ["Enseignement"],                        image: "/images/projects/paul-bruchesi.jpg",     href: "#" },
  { id: 2,  title: "École Laurent-Benoît",                                  categories: ["Enseignement"],                        image: "/images/projects/laurent-benoit.jpg",    href: "#" },
  { id: 3,  title: "Centre sportif du Parc olympique",                      categories: ["Distinction","Sport et loisirs"],      image: "/images/projects/parc-olympique.jpg",    href: "#" },
  { id: 4,  title: "École Henri-Bourassa",                                  categories: ["Enseignement","Sport et loisirs"],     image: "/images/projects/henri-bourassa.jpg",    href: "#" },
  { id: 5,  title: "Complexe aquatique de Brossard",                        categories: ["Distinction","Sport et loisirs"],      image: "/images/projects/brossard.jpg",          href: "#" },
  { id: 6,  title: "École Omer-Séguin",                                     categories: ["Enseignement"],                        image: "/images/projects/omer-seguin.jpg",       href: "#" },
  { id: 7,  title: "Collège de Bois-de-Boulogne",                           categories: ["Enseignement","Intérieurs"],           image: "/images/projects/bois-de-boulogne.jpg",  href: "#" },
  { id: 8,  title: "Centre sportif de Notre-Dame-de-Grâce",                 categories: ["Distinction","Sport et loisirs"],      image: "/images/projects/notre-dame-de-grace.jpg", href: "#" },
  { id: 9,  title: "École Saint-Rémi",                                      categories: ["Enseignement"],                        image: "/images/projects/saint-remi.jpg",        href: "#" },
  { id: 10, title: "École nationale du meuble et de l'ébénisterie",         categories: ["Enseignement","Industriel"],           image: "/images/projects/enm.jpg",               href: "#" },
  { id: 11, title: "École Philippe-Labarre",                                categories: ["Enseignement"],                        image: "/images/projects/philippe-labarre.jpg",  href: "#" },
  { id: 12, title: "École de l'Équinoxe",                                   categories: ["Enseignement"],                        image: "/images/projects/equinoxe.jpg",          href: "#" },
  { id: 13, title: "Piscine Annie-Pelletier",                               categories: ["Sport et loisirs"],                   image: "/images/projects/annie-pelletier.jpg",   href: "#" },
  { id: 14, title: "Centre aquatique Desjardins de Granby",                 categories: ["Sport et loisirs"],                   image: "/images/projects/granby.jpg",            href: "#" },
  { id: 15, title: "École Westmount Park",                                  categories: ["Enseignement"],                        image: "/images/projects/westmount.jpg",         href: "#" },
  { id: 16, title: "Centre aquatique Malcolm-Knox",                         categories: ["Sport et loisirs"],                   image: "/images/projects/malcolm-knox.jpg",      href: "#" },
  { id: 17, title: "École Georges-P.-Vanier",                               categories: ["Enseignement"],                        image: "/images/projects/vanier.jpg",            href: "#" },
  { id: 18, title: "École Adélard-Desrosiers",                              categories: ["Enseignement"],                        image: "/images/projects/adelard.jpg",           href: "#" },
  { id: 19, title: "École Saint-Mathieu",                                   categories: ["Enseignement"],                        image: "/images/projects/saint-mathieu.jpg",     href: "#" },
  { id: 20, title: "École des Marguerite",                                  categories: ["Enseignement"],                        image: "/images/projects/marguerite.jpg",        href: "#" },
  { id: 21, title: "Piscine de l'école polyvalente Lavigne",                categories: ["Enseignement","Sport et loisirs"],     image: "/images/projects/lavigne.jpg",           href: "#" },
  { id: 22, title: "Complexe aquatique de Minganie",                        categories: ["Sport et loisirs"],                   image: "/images/projects/minganie.jpg",          href: "#" },
  { id: 23, title: "1699 Le Corbusier – Immeuble de bureaux",               categories: ["Bureaux"],                             image: "/images/projects/le-corbusier.jpg",      href: "#" },
  { id: 24, title: "École Rose-des-Vents",                                  categories: ["Enseignement"],                        image: "/images/projects/rose-des-vents.jpg",    href: "#" },
  { id: 25, title: "Complexe aquatique de l'Université de Sherbrooke",      categories: ["Enseignement","Sport et loisirs"],     image: "/images/projects/sherbrooke.jpg",        href: "#" },
  { id: 26, title: "Centre de services Desjardins Le 1809",                 categories: ["Bureaux","Intérieurs"],                image: "/images/projects/desjardins-1809.jpg",   href: "#" },
  { id: 27, title: "Atelier d'entretien de véhicules d'Hydro-Québec",       categories: ["Industriel"],                          image: "/images/projects/hydro-quebec.jpg",      href: "#" },
  { id: 28, title: "La Maison des Papillons",                               categories: ["Habitat"],                             image: "/images/projects/papillons.jpg",         href: "#" },
];

export const sectors = [
  "Tous les secteurs",
  "Enseignement",
  "Sport et loisirs",
  "Distinction",
  "Intérieurs",
  "Industriel",
  "Bureaux",
  "Habitat",
] as const;

export type Sector = (typeof sectors)[number];
