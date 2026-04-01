# MISSION: Hub Web del Ecosistema Dr. Paruzzo

## CONTEXTO DEL USUARIO

Dr. Juan Ignacio Paruzzo — Medico y Licenciado en Psicologia, Argentina.
NO es programador. Opera como director creativo de agentes IA.
Dice QUE quiere, los agentes resuelven COMO.

### Ecosistema de Proyectos

| Proyecto | Que es | Stack |
|----------|--------|-------|
| **Niche Radar** (North Star) | SaaS de contenido medico automatizado basado en evidencia cientifica (PubMed). Genera contenido con voz propia → Notion CMS → redes sociales | Next.js 15, Python workers, Claude Sonnet 4.6, LangGraph, Notion API |
| **Recetas Medicas** | Sistema de recetas medicas via WhatsApp con cobro integrado | FastAPI, LangGraph, GPT-4o-mini, PostgreSQL, MercadoPago/Stripe, Twilio |
| **Buscador-Py** | CLI de generacion de contenido medico desde PubMed + Gemini | Python, Gemini AI, PubMed/NCBI, Rich CLI |
| **ClinicAI** | Backend skeleton para servicios clinicos | Flask 3.x, pytest |
| **Content Pipeline** | Pipeline de distribucion multicanal | En desarrollo |
| **Automations** | Workflows de automatizacion | En desarrollo |

### Stack Transversal
- **Modelos IA:** Claude Sonnet 4.6, GPT-4o-mini, Gemini 3.1 Pro, Perplexity
- **Orquestacion:** n8n, LangGraph, Mastra, MCP
- **Observabilidad:** Langfuse (self-hosted), Sentry
- **Infra:** Hetzner VPS, Docker, Railway, GitHub
- **Pagos:** MercadoPago, Stripe
- **Mensajeria:** Twilio/WhatsApp, Telegram
- **Seguridad:** LlamaGuard, guardrails de compliance medico, HITL gates

### Identidad de Marca
- Tono: Irreverente + preciso. Socratico con pacientes, directo con colegas.
- Estetica: Dark premium, azul/dorado, estilo Pixar 3D medico
- Posicionamiento: "Solo AI entrepreneur" — medico que usa IA para escalar impacto

### Audiencia del Hub
- Medicos curiosos por IA
- Inversores/partners potenciales
- Comunidad tech que sigue proyectos de IA aplicada
- Pacientes que quieren entender el ecosistema

## OBJETIVO POST-CLONADO

Despues de clonar Naya Studio como base visual, transformar el sitio
en una landing page hub que unifique todo el ecosistema del Dr. Paruzzo.

### Elementos a Preservar de Naya (base clonada)
- Dark mode, smooth scroll Lenis, preloader con counter
- Text reveals word-by-word con blur-in
- Navbar con blur progresivo
- Testimonial carousel 3D
- Tipografia serif elegante
- Hero cinematico

### Elementos a Integrar de IMAGA (post-clonado)
- Navegacion lateral numerada (scroll-spy)
- Seccion de servicios/proceso expandible (accordion)
- Distincion tangible/intangible
- Grid de cases/proyectos
- CTA structure

### Elementos de Polecat (inspiracion de personalidad)
- Actitud irreverente en el copy
- Ruptura de convenciones
- Concepto de "distritos" para organizar secciones tematicas

## ESTRUCTURA PROPUESTA

```
1. PRELOADER — Counter 0->100% (estilo Naya)
2. HERO — Dark, heading animado: "Dr. Paruzzo" + tagline del ecosistema
   CTA: "Explorar Ecosistema" / "Contacto"
3. ABOUT — Quien soy, por que IA + medicina, credenciales
4. ECOSYSTEM MAP — Grid visual de todos los proyectos interconectados
   (Niche Radar, Recetas, Buscador, ClinicAI, Automations)
   Cada card expandible con: que hace, stack, status
5. PROCESS/METHOD — Accordion de las etapas de mi approach
   (Research -> Synthesis -> Compliance -> Distribution -> Observability)
6. TECH STACK — Visual del stack transversal (modelos, orquestacion, infra)
7. RESULTS/CASES — Metricas, outputs, demos de los proyectos
8. CONTACT — Form + links sociales + CTA
9. FOOTER — Links, creditos, social
```

### Nav lateral numerada (1-9) con scroll-spy (estilo IMAGA)

## RESTRICCIONES

- Paleta: dark base (#0a0a0a), accent azul (#0aaeFF), accent dorado (#d4a853), blanco para texto
- Tipografia: serif elegante para headings, sans-serif para body
- Mobile-first responsive
- Performance: NO Three.js ni WebGL. Si GSAP + Lenis para animaciones
- Contenido: usar texto real del ecosistema, NO placeholders
- El sitio debe comunicar: "Este medico construyo un ecosistema de IA
  que genera contenido cientifico a escala. Es serio, es real, y funciona."
- Anti-alucinacion: si no tenes datos reales de un proyecto, pone
  "[COMPLETAR]" en vez de inventar

## DONE WHEN

- [ ] `npm run build` pasa sin errores
- [ ] El sitio se ve premium en desktop y mobile
- [ ] Todas las secciones (1-9) estan implementadas
- [ ] Nav lateral numerada funciona con scroll-spy
- [ ] Preloader animado funciona
- [ ] Text reveals con blur-in en headings
- [ ] Smooth scroll con Lenis
- [ ] Paleta dark + azul/dorado consistente
- [ ] Contenido real del ecosistema (no lorem ipsum)
