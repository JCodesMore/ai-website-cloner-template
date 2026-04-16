"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

export type LangCode = "en" | "zh" | "hi" | "es" | "fr" | "ar" | "bn" | "ru" | "pt" | "de" | "ja";

export const LANGUAGES: { code: LangCode; name: string; nativeName: string; rtl?: boolean }[] = [
  { code: "en", name: "English",    nativeName: "English" },
  { code: "zh", name: "Chinese",    nativeName: "中文" },
  { code: "hi", name: "Hindi",      nativeName: "हिन्दी" },
  { code: "es", name: "Spanish",    nativeName: "Español" },
  { code: "fr", name: "French",     nativeName: "Français" },
  { code: "ar", name: "Arabic",     nativeName: "العربية", rtl: true },
  { code: "bn", name: "Bengali",    nativeName: "বাংলা" },
  { code: "ru", name: "Russian",    nativeName: "Русский" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "de", name: "German",     nativeName: "Deutsch" },
  { code: "ja", name: "Japanese",   nativeName: "日本語" },
];

type Translations = {
  dashboard: string;
  inbox: string;
  issues: string;
  routines: string;
  goals: string;
  approvals: string;
  agents: string;
  org: string;
  skills: string;
  costs: string;
  activity: string;
  settings: string;
  search: string;
  newIssue: string;
  newAgent: string;
  newGoal: string;
  newRoutine: string;
  work: string;
  company: string;
  projects: string;
  save: string;
  saved: string;
  cancel: string;
  models: string;
  apis: string;
};

const DICT: Record<LangCode, Translations> = {
  en: {
    dashboard: "Dashboard", inbox: "Inbox", issues: "Issues", routines: "Routines",
    goals: "Goals", approvals: "Approvals", agents: "Agents", org: "Org",
    skills: "Skills", costs: "Costs", activity: "Activity", settings: "Settings",
    search: "Search...", newIssue: "New Issue", newAgent: "New Agent",
    newGoal: "New Goal", newRoutine: "New Routine",
    work: "Work", company: "Company", projects: "Projects",
    save: "Save Changes", saved: "Saved ✓", cancel: "Cancel",
    models: "Models", apis: "APIs",
  },
  zh: {
    dashboard: "仪表板", inbox: "收件箱", issues: "任务", routines: "例行程序",
    goals: "目标", approvals: "审批", agents: "智能体", org: "组织",
    skills: "技能", costs: "费用", activity: "活动", settings: "设置",
    search: "搜索...", newIssue: "新任务", newAgent: "新智能体",
    newGoal: "新目标", newRoutine: "新例行程序",
    work: "工作", company: "公司", projects: "项目",
    save: "保存更改", saved: "已保存 ✓", cancel: "取消",
    models: "模型", apis: "API接口",
  },
  hi: {
    dashboard: "डैशबोर्ड", inbox: "इनबॉक्स", issues: "कार्य", routines: "रूटीन",
    goals: "लक्ष्य", approvals: "अनुमोदन", agents: "एजेंट", org: "संगठन",
    skills: "कौशल", costs: "लागत", activity: "गतिविधि", settings: "सेटिंग",
    search: "खोजें...", newIssue: "नया कार्य", newAgent: "नया एजेंट",
    newGoal: "नया लक्ष्य", newRoutine: "नई रूटीन",
    work: "कार्य", company: "कंपनी", projects: "प्रोजेक्ट",
    save: "परिवर्तन सहेजें", saved: "सहेजा गया ✓", cancel: "रद्द करें",
    models: "मॉडल", apis: "एपीआई",
  },
  es: {
    dashboard: "Panel", inbox: "Bandeja de entrada", issues: "Tareas", routines: "Rutinas",
    goals: "Objetivos", approvals: "Aprobaciones", agents: "Agentes", org: "Organización",
    skills: "Habilidades", costs: "Costos", activity: "Actividad", settings: "Configuración",
    search: "Buscar...", newIssue: "Nueva tarea", newAgent: "Nuevo agente",
    newGoal: "Nuevo objetivo", newRoutine: "Nueva rutina",
    work: "Trabajo", company: "Empresa", projects: "Proyectos",
    save: "Guardar cambios", saved: "Guardado ✓", cancel: "Cancelar",
    models: "Modelos", apis: "APIs",
  },
  fr: {
    dashboard: "Tableau de bord", inbox: "Boîte de réception", issues: "Tâches", routines: "Routines",
    goals: "Objectifs", approvals: "Approbations", agents: "Agents", org: "Organisation",
    skills: "Compétences", costs: "Coûts", activity: "Activité", settings: "Paramètres",
    search: "Rechercher...", newIssue: "Nouvelle tâche", newAgent: "Nouvel agent",
    newGoal: "Nouvel objectif", newRoutine: "Nouvelle routine",
    work: "Travail", company: "Entreprise", projects: "Projets",
    save: "Enregistrer", saved: "Enregistré ✓", cancel: "Annuler",
    models: "Modèles", apis: "API",
  },
  ar: {
    dashboard: "لوحة التحكم", inbox: "صندوق الوارد", issues: "المهام", routines: "الروتين",
    goals: "الأهداف", approvals: "الموافقات", agents: "الوكلاء", org: "الهيكل التنظيمي",
    skills: "المهارات", costs: "التكاليف", activity: "النشاط", settings: "الإعدادات",
    search: "بحث...", newIssue: "مهمة جديدة", newAgent: "وكيل جديد",
    newGoal: "هدف جديد", newRoutine: "روتين جديد",
    work: "عمل", company: "شركة", projects: "مشاريع",
    save: "حفظ التغييرات", saved: "تم الحفظ ✓", cancel: "إلغاء",
    models: "النماذج", apis: "واجهات برمجية",
  },
  bn: {
    dashboard: "ড্যাশবোর্ড", inbox: "ইনবক্স", issues: "কাজ", routines: "রুটিন",
    goals: "লক্ষ্য", approvals: "অনুমোদন", agents: "এজেন্ট", org: "সংগঠন",
    skills: "দক্ষতা", costs: "খরচ", activity: "কার্যক্রম", settings: "সেটিংস",
    search: "খুঁজুন...", newIssue: "নতুন কাজ", newAgent: "নতুন এজেন্ট",
    newGoal: "নতুন লক্ষ্য", newRoutine: "নতুন রুটিন",
    work: "কাজ", company: "কোম্পানি", projects: "প্রকল্প",
    save: "পরিবর্তন সংরক্ষণ করুন", saved: "সংরক্ষিত ✓", cancel: "বাতিল",
    models: "মডেল", apis: "API",
  },
  ru: {
    dashboard: "Панель", inbox: "Входящие", issues: "Задачи", routines: "Рутины",
    goals: "Цели", approvals: "Одобрения", agents: "Агенты", org: "Организация",
    skills: "Навыки", costs: "Затраты", activity: "Активность", settings: "Настройки",
    search: "Поиск...", newIssue: "Новая задача", newAgent: "Новый агент",
    newGoal: "Новая цель", newRoutine: "Новая рутина",
    work: "Работа", company: "Компания", projects: "Проекты",
    save: "Сохранить", saved: "Сохранено ✓", cancel: "Отмена",
    models: "Модели", apis: "API",
  },
  pt: {
    dashboard: "Painel", inbox: "Caixa de entrada", issues: "Tarefas", routines: "Rotinas",
    goals: "Objetivos", approvals: "Aprovações", agents: "Agentes", org: "Organização",
    skills: "Habilidades", costs: "Custos", activity: "Atividade", settings: "Configurações",
    search: "Pesquisar...", newIssue: "Nova tarefa", newAgent: "Novo agente",
    newGoal: "Novo objetivo", newRoutine: "Nova rotina",
    work: "Trabalho", company: "Empresa", projects: "Projetos",
    save: "Salvar alterações", saved: "Salvo ✓", cancel: "Cancelar",
    models: "Modelos", apis: "APIs",
  },
  de: {
    dashboard: "Dashboard", inbox: "Posteingang", issues: "Aufgaben", routines: "Routinen",
    goals: "Ziele", approvals: "Genehmigungen", agents: "Agenten", org: "Organisation",
    skills: "Fähigkeiten", costs: "Kosten", activity: "Aktivität", settings: "Einstellungen",
    search: "Suchen...", newIssue: "Neue Aufgabe", newAgent: "Neuer Agent",
    newGoal: "Neues Ziel", newRoutine: "Neue Routine",
    work: "Arbeit", company: "Unternehmen", projects: "Projekte",
    save: "Speichern", saved: "Gespeichert ✓", cancel: "Abbrechen",
    models: "Modelle", apis: "APIs",
  },
  ja: {
    dashboard: "ダッシュボード", inbox: "受信箱", issues: "タスク", routines: "ルーティン",
    goals: "目標", approvals: "承認", agents: "エージェント", org: "組織",
    skills: "スキル", costs: "コスト", activity: "アクティビティ", settings: "設定",
    search: "検索...", newIssue: "新しいタスク", newAgent: "新しいエージェント",
    newGoal: "新しい目標", newRoutine: "新しいルーティン",
    work: "作業", company: "会社", projects: "プロジェクト",
    save: "変更を保存", saved: "保存済み ✓", cancel: "キャンセル",
    models: "モデル", apis: "API",
  },
};

interface I18nCtx {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: Translations;
}

const I18nContext = createContext<I18nCtx>({
  lang: "en",
  setLang: () => {},
  t: DICT.en,
});

export const useI18n = () => useContext(I18nContext);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  // Load persisted language on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("lang") as LangCode | null;
      if (stored && stored in DICT) {
        setLangState(stored);
        const rtl = LANGUAGES.find((x) => x.code === stored)?.rtl ?? false;
        document.documentElement.dir = rtl ? "rtl" : "ltr";
      }
    }
  }, []);

  const setLang = useCallback((l: LangCode) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", l);
    }
    const rtl = LANGUAGES.find((x) => x.code === l)?.rtl ?? false;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, []);

  return (
    <I18nContext.Provider value={{ lang, setLang, t: DICT[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}
