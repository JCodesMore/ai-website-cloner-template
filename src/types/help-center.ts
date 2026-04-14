export interface HelpLink {
  text: string;
  href: string;
}

export interface TopicCategory {
  title: string;
  titleHref: string;
  iconSrc: string;
  iconAlt: string;
  items: HelpLink[];
  viewAllHref: string;
}

export interface FooterLink extends HelpLink {}
