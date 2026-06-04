export type QuizStepType = "question" | "rate" | "s1";

export interface QuizOption {
  label: string;
  subLabel?: string;
}

export interface QuizStep {
  id: number;
  type: QuizStepType;
  question?: string;
  ratingLabel?: string;
  ratingMin?: string;
  ratingMax?: string;
  options?: QuizOption[];
  title?: string;
  titleHighlight?: string;
  description?: string;
  image?: string;
  video?: string;
  nextStep?: number | null;
}

export const QUIZ_STEPS: QuizStep[] = [
  {
    id: 0,
    type: "question",
    question: "Selecione seu objetivo principal",
    options: [
      { label: "Melhorar a função erétil" },
      { label: "Melhorar o controle da ejaculação" },
      { label: "Potencializar o bem-estar sexual", subLabel: "(Melhorar ambas as opções acima)" },
    ],
    nextStep: 1,
  },
  {
    id: 1,
    type: "question",
    question: "Qual dessas opções melhor descreve o seu problema?",
    options: [
      { label: "Dificuldade em alcançar a ereção" },
      { label: "Dificuldade em manter a ereção" },
      { label: "Ambas" },
      { label: "Prefiro não responder" },
    ],
    nextStep: 3,
  },
  {
    id: 3,
    type: "question",
    question: "Com que frequência você tem problemas de ereção?",
    options: [
      { label: "Nunca" },
      { label: "Raramente" },
      { label: "Com frequência" },
      { label: "O tempo todo" },
      { label: "Prefiro não responder" },
    ],
    nextStep: 5,
  },
  {
    id: 5,
    type: "question",
    question: "Você consegue ter relações sexuais duas vezes seguidas?",
    options: [
      { label: "Sim, mas preciso me esforçar bastante" },
      { label: "Não consigo" },
      { label: "Prefiro não responder" },
    ],
    nextStep: 6,
  },
  {
    id: 6,
    type: "s1",
    title: "A Qualidade da Ereção depende da força dos",
    titleHighlight: "Músculos do Assoalho Pélvico (MAP)",
    video: "https://quiz.kegel-plan.me/video/video_ED_s1.mp4",
    description:
      "Músculos do Assoalho Pélvico (MAP) mais fortes ajudam a preencher e reter mais sangue no órgão masculino, o que leva a ereções mais intensas e duradouras.",
    nextStep: 7,
  },
  {
    id: 7,
    type: "question",
    question: "Com que frequência você tem ereções matinais?",
    options: [
      { label: "Nunca" },
      { label: "Raramente" },
      { label: "Com frequência" },
      { label: "O tempo todo" },
      { label: "Prefiro não responder" },
    ],
    nextStep: 8,
  },
  {
    id: 8,
    type: "rate",
    question: "Qual é a intensidade de sua ereção durante a masturbação?",
    ratingLabel: "Classifique de 1 a 5",
    ratingMin: "Não é intensa",
    ratingMax: "Muito intensa",
    nextStep: 9,
  },
  {
    id: 9,
    type: "question",
    question: "Você experimenta disfunção erétil com uma parceira, mas não durante a masturbação?",
    options: [
      { label: "Sim" },
      { label: "Não" },
      { label: "Prefiro não responder" },
    ],
    nextStep: 10,
  },
  {
    id: 10,
    type: "question",
    question: "Há quanto tempo você sofre de disfunção erétil?",
    options: [
      { label: "Menos de 1 ano" },
      { label: "1 a 3 anos" },
      { label: "Mais de 3 anos" },
      { label: "Prefiro não responder" },
    ],
    nextStep: null, // null = fim do quiz → vai para /pt-br/enter-email
  },
];

export const TOTAL_SECTIONS = 4;

export function getStepById(id: number): QuizStep | undefined {
  return QUIZ_STEPS.find((s) => s.id === id);
}

export function getStepProgress(id: number): number {
  const totalSteps = QUIZ_STEPS.length;
  const idx = QUIZ_STEPS.findIndex((s) => s.id === id);
  if (idx < 0) return 0;
  return Math.round(((idx + 1) / totalSteps) * 100);
}

export function getSectionIndex(id: number): number {
  if (id <= 5) return 0;
  if (id <= 10) return 1;
  if (id <= 15) return 2;
  return 3;
}

export const QUIZ_FLOW: number[] = QUIZ_STEPS.map((s) => s.id);

export const SOURCES = [
  {
    authors: "G. Dorey, M. Speakman, R. Feneley, A. Swinkels, C. Dunn, and P. Ewings, (2004).",
    title:
      '"Randomised controlled trial of pelvic floor muscle exercises and manometric biofeedback for erectile dysfunction."',
    journal: "British Journal of General Practice",
    detail: "2004 Nov;54(508):819-25 PMID:15527607",
  },
  {
    authors:
      "H. A. Feldman, I. Goldstein, D. G. Hatzichristou, R. J. Krane, and J. B. McKinlay, (1994).",
    title:
      '"Impotence and its medical and psychosocial correlates: results of the Massachusetts Male Aging Study."',
    journal: "The Journal of Urology",
    detail: "1994 Jan;151(1):54-61 PMID:8254833",
  },
  {
    authors: "M. Crowdis, S. W. Leslie, and S. Nazir, (2023).",
    title: '"Premature Ejaculation"',
    journal: "StatPearls Publishing",
    detail: "2023 May 30. PMID: 31536307",
  },
];
