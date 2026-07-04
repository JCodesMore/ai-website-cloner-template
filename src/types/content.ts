export interface ProfileStat {
  value: string;
  label: string;
}

export interface Profile {
  name: string;
  title: string;
  shortTitle: string;
  tagline: string;
  location: string;
  email: string;
  whatsapp: string;
  stats: ProfileStat[];
}

export interface CareerEntry {
  period: string;
  role: string;
  org: string;
  tags: string[];
  highlights: string[];
}

export interface Organization {
  org: string;
  role: string;
}

export interface Education {
  degree: string;
  school: string;
  period: string;
}

export interface AiTool {
  name: string;
  desc: string;
  tag?: string;
}

export interface CompetencyLevel {
  name: string;
  level: "Expert" | "Advanced";
}

export interface LanguageSkill {
  name: string;
  level: string;
}

export interface EventItem {
  name: string;
  date: string;
  stat: string;
  role: string;
  desc: string;
}

export interface EventSeries {
  series: string;
  items: EventItem[];
}

export interface PortfolioContent {
  profile: Profile;
  career: CareerEntry[];
  organizations: Organization[];
  education: Education;
  aiTools: AiTool[];
  coreCompetencies: CompetencyLevel[];
  toolsPlatforms: string[];
  softSkills: string[];
  languages: LanguageSkill[];
  events: EventSeries[];
}
