export type Locale = "es" | "en";

type SectionDict = {
  label: string;
  eyebrow: string;
  title1: string;
  title2: string;
  body: string;
  cta: string;
};

export type Dict = {
  nav: {
    login: string;
    menu: string;
    changeLang: string;
    home: string;
    projects: string;
  };
  bottomBar: { sound: string; scroll: string; chat: string };
  sections: {
    integral: SectionDict;
    terreno: SectionDict;
    monitoreo: SectionDict;
    ia: SectionDict;
    alertas: SectionDict;
    respuesta: SectionDict;
    control: SectionDict;
    decisiones: SectionDict;
  };
  closing: {
    eyebrow: string;
    title1: string;
    title2: string;
    body: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  footer: { tagline: string; rights: string };
  projectsPage: {
    title1: string;
    title2: string;
    intro: string;
    howTo: string;
    cards: {
      scroll: { title: string; body: string };
      drag: { title: string; body: string };
      click: { title: string; body: string };
    };
    enter: string;
    listTitle: string;
    listSubtitle: string;
    bottomBar: {
      filters: string;
      openList: string;
      back: string;
    };
    panel: {
      country: string;
      region: string;
      vertical: string;
      scale: string;
      cameras: string;
      requestInfo: string;
    };
  };
};

export const dictionaries: Record<Locale, Dict> = {
  es: {
    nav: {
      login: "Login",
      menu: "Menú",
      changeLang: "Idioma",
      home: "Inicio",
      projects: "Proyectos",
    },
    bottomBar: {
      sound: "Sonido off",
      scroll: "Scroll para explorar",
      chat: "Hablar con un asesor",
    },
    sections: {
      integral: {
        label: "Plataforma",
        eyebrow: "01 / Seguridad integral",
        title1: "Seguridad integral",
        title2: "conectada en tiempo real.",
        body: "Centraliza cámaras, personal, alertas, evidencia y operación para que cada evento tenga contexto, trazabilidad y respuesta. ARS conecta vigilancia, tecnología, operadores y clientes en una sola plataforma.",
        cta: "Conocer la plataforma",
      },
      terreno: {
        label: "Operación",
        eyebrow: "02 / Operación en campo",
        title1: "Del terreno",
        title2: "a la plataforma.",
        body: "La seguridad empieza en el territorio: guardas, rondas, accesos, zonas críticas y novedades. Cada punto de vigilancia, cámara, zona y operador se convierte en parte activa de la operación.",
        cta: "Ver operación en campo",
      },
      monitoreo: {
        label: "Monitoreo",
        eyebrow: "03 / Central de monitoreo",
        title1: "Una central que",
        title2: "entiende lo que ocurre.",
        body: "La central de monitoreo no solo observa: prioriza, interpreta y coordina. ARS ayuda a los operadores a visualizar eventos, priorizar riesgos y coordinar respuestas con mayor velocidad.",
        cta: "Ver capacidades",
      },
      ia: {
        label: "Inteligencia",
        eyebrow: "04 / IA aplicada a la seguridad",
        title1: "IA para detectar,",
        title2: "priorizar y actuar.",
        body: "La IA detecta eventos relevantes y siempre opera como apoyo del equipo humano. Personas, vehículos, placas, rostros autorizados o restringidos, zonas ROI, cruces de línea, permanencia, EPP y eventos críticos.",
        cta: "Ver capacidades de IA",
      },
      alertas: {
        label: "Alertas",
        eyebrow: "05 / Alertas con evidencia",
        title1: "Alertas que llegan",
        title2: "con contexto.",
        body: "Cada alerta debe tener prueba visual, ubicación, cámara, hora, evento y trazabilidad. Snapshots, clips, historial y datos del evento para actuar con información, no con suposiciones.",
        cta: "Ver alertas en acción",
      },
      respuesta: {
        label: "Respuesta",
        eyebrow: "06 / Respuesta coordinada",
        title1: "De la alerta",
        title2: "a la acción.",
        body: "ARS conecta la central con el personal en campo, supervisores y responsables. Comunicación, seguimiento y respuesta operativa para cerrar el ciclo de seguridad.",
        cta: "Ver flujo de respuesta",
      },
      control: {
        label: "Control",
        eyebrow: "07 / Clientes · sedes · zonas",
        title1: "Una plataforma",
        title2: "para múltiples operaciones.",
        body: "ARS permite operar múltiples clientes, sedes, zonas, cámaras y servicios desde una sola arquitectura. Organiza clientes, sedes, zonas, cámaras, reglas IA, operadores y reportes bajo una estructura clara y escalable.",
        cta: "Ver arquitectura multisede",
      },
      decisiones: {
        label: "Decisiones",
        eyebrow: "08 / Reportes y confianza",
        title1: "Más control. Más evidencia.",
        title2: "Mejores decisiones.",
        body: "La seguridad integral termina en información útil para gerencia, auditoría y mejora continua. Convierte la operación diaria en indicadores, trazabilidad, reportes y decisiones estratégicas.",
        cta: "Ver reportes ejecutivos",
      },
    },
    closing: {
      eyebrow: "Cierre del ciclo",
      title1: "Una sola plataforma.",
      title2: "Toda tu seguridad.",
      body: "ARS Intelligence se integra con tu operación actual sin reemplazar tu hardware. Conectamos cámaras, guardas, NVRs y sistemas existentes en menos de 48 horas y entregamos un tablero único para gerencia, supervisión y respuesta.",
      ctaPrimary: "Solicitar demo",
      ctaSecondary: "Ver capacidades de la plataforma",
    },
    footer: {
      tagline: "La forma simple de hacer que todo funcione.",
      rights: "Todos los derechos reservados.",
    },
    projectsPage: {
      title1: "Una red",
      title2: "que ya está operando.",
      intro:
        "ARS Intelligence opera centrales inteligentes en Colombia y Perú, conectando cámaras y sensores en una sola red de decisión.",
      howTo: "Cómo usar el mapa",
      cards: {
        scroll: { title: "Scroll", body: "Acerca y aleja el mapa" },
        drag: { title: "Arrastra", body: "Mueve el mapa con el mouse" },
        click: { title: "Click", body: "Ver detalles del proyecto" },
      },
      enter: "Entrar al mapa",
      listTitle: "Presencia ARS",
      listSubtitle: "Ciudades operativas en Latinoamérica",
      bottomBar: {
        filters: "Filtros",
        openList: "Abrir lista de proyectos",
        back: "Volver",
      },
      panel: {
        country: "País",
        region: "Departamento / Región",
        vertical: "Verticales",
        scale: "Escala",
        cameras: "cámaras",
        requestInfo: "Solicitar información",
      },
    },
  },
  en: {
    nav: {
      login: "Login",
      menu: "Menu",
      changeLang: "Language",
      home: "Home",
      projects: "Projects",
    },
    bottomBar: {
      sound: "Sound off",
      scroll: "Scroll to explore",
      chat: "Talk to an advisor",
    },
    sections: {
      integral: {
        label: "Platform",
        eyebrow: "01 / Integrated security",
        title1: "Integrated security,",
        title2: "connected in real time.",
        body: "Centralize cameras, personnel, alerts, evidence and operations so every event has context, traceability and response. ARS connects surveillance, technology, operators and clients on a single platform.",
        cta: "Discover the platform",
      },
      terreno: {
        label: "Field ops",
        eyebrow: "02 / Field operations",
        title1: "From the ground",
        title2: "to the platform.",
        body: "Security starts on the ground: guards, patrols, access points, critical zones and incidents. Every watch point, camera, zone and operator becomes an active part of the operation.",
        cta: "See field operations",
      },
      monitoreo: {
        label: "Monitoring",
        eyebrow: "03 / Operations center",
        title1: "An operations center",
        title2: "that understands what's happening.",
        body: "The operations center doesn't just watch — it prioritizes, interprets and coordinates. ARS helps operators visualize events, rank risks and coordinate response with greater speed.",
        cta: "See capabilities",
      },
      ia: {
        label: "Intelligence",
        eyebrow: "04 / AI applied to security",
        title1: "AI to detect,",
        title2: "prioritize and act.",
        body: "AI detects relevant events and always operates as support to the human team. People, vehicles, plates, authorized or restricted faces, ROI zones, line-cross, dwell time, PPE and critical events.",
        cta: "See AI capabilities",
      },
      alertas: {
        label: "Alerts",
        eyebrow: "05 / Alerts with evidence",
        title1: "Alerts that arrive",
        title2: "with full context.",
        body: "Every alert needs visual proof, location, camera, time, event and traceability. Snapshots, clips, history and event data so your team acts on information — not assumptions.",
        cta: "See alerts in action",
      },
      respuesta: {
        label: "Response",
        eyebrow: "06 / Coordinated response",
        title1: "From the alert",
        title2: "to the action.",
        body: "ARS connects the operations center with field personnel, supervisors and decision makers. Communication, tracking and operational response to close the security loop.",
        cta: "See response flow",
      },
      control: {
        label: "Control",
        eyebrow: "07 / Clients · sites · zones",
        title1: "One platform",
        title2: "for many operations.",
        body: "ARS lets you operate multiple clients, sites, zones, cameras and services from a single architecture. Organize clients, sites, zones, cameras, AI rules, operators and reports under a clear, scalable structure.",
        cta: "See multi-site architecture",
      },
      decisiones: {
        label: "Decisions",
        eyebrow: "08 / Reports and trust",
        title1: "More control. More evidence.",
        title2: "Better decisions.",
        body: "Integrated security ends in actionable information for management, audit and continuous improvement. Turn daily operations into KPIs, traceability, reports and strategic decisions.",
        cta: "See executive reports",
      },
    },
    closing: {
      eyebrow: "Closing the loop",
      title1: "One platform.",
      title2: "All your security.",
      body: "ARS Intelligence integrates with your existing operation without replacing your hardware. We connect cameras, guards, NVRs and existing systems in under 48 hours and deliver a single dashboard for management, supervision and response.",
      ctaPrimary: "Request demo",
      ctaSecondary: "See platform capabilities",
    },
    footer: {
      tagline: "The simple way to make everything work.",
      rights: "All rights reserved.",
    },
    projectsPage: {
      title1: "A network",
      title2: "already in operation.",
      intro:
        "ARS Intelligence runs intelligent operations centers across Colombia and Peru, connecting cameras and sensors into a single decision network.",
      howTo: "How to use the map",
      cards: {
        scroll: { title: "Scroll", body: "Zoom in and out of the map" },
        drag: { title: "Drag", body: "Move the map around" },
        click: { title: "Click", body: "View project details" },
      },
      enter: "Enter the map",
      listTitle: "ARS presence",
      listSubtitle: "Operating cities across Latin America",
      bottomBar: {
        filters: "Filters",
        openList: "Open project list",
        back: "Back",
      },
      panel: {
        country: "Country",
        region: "Region / State",
        vertical: "Verticals",
        scale: "Scale",
        cameras: "cameras",
        requestInfo: "Request information",
      },
    },
  },
};

export const sectionKeys = [
  "integral",
  "terreno",
  "monitoreo",
  "ia",
  "alertas",
  "respuesta",
  "control",
  "decisiones",
] as const;

export type SectionKey = (typeof sectionKeys)[number];
