# Respaldo de Conversación - Proyecto Incomparables

## Resumen del Proyecto
Sitio web para "Los Incomparables de Manuel Vargas" - Grupo Norteño con 35 años de trayectoria.

## Repositorio
- Template: ai-website-cloner-template (de JCodesMore)
- Deploy: https://github.com/pmailprueba-apps/incomparables-web
- URL Final: https://pmailprueba-apps.github.io/incomparables-web/

## Tecnologías
- Next.js 16 (App Router, React 19, TypeScript)
- Tailwind CSS v4
- shadcn/ui
- Google Analytics GA4: AWM6NcaNRp6rTGmNUah7LQ

## Estructura del Proyecto
```
ai-website-cloner-template/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Layout con GA4 y fuentes Geist
│   │   ├── page.tsx       # Página principal completa
│   │   └── globals.css    # Estilos con tema oscuro/dorado
│   ├── components/
│   │   └── icons.tsx      # Iconos personalizados (Instagram, Facebook, TikTok, etc.)
│   └── lib/
│       └── utils.ts      # Utilidades shadcn
├── public/
│   └── images/
│       ├── logo.svg      # Logo del grupo
│       └── background-hero.jpg  # Imagen de fondo hero
├── out/                   # Build estático exportado
├── next.config.ts         # Configuración Next.js
└── package.json
```

## Secciones del Sitio
1. **Nav (fixed)** - Logo + redes sociales (Instagram, Facebook, TikTok)
2. **Hero** - Imagen de fondo con overlay, logo centrado translúcido, tagline, CTAs
3. **Sobre Nosotros** - Historia del grupo (35+ años, San Luis Potosí y USA)
4. **Servicios** - 4 cards: Fiestas Privadas, Conciertos Masivos, Eventos Corporativos, Ambientación Musical
5. **Contacto** - Teléfono (614 107 3188), Email (pmailprubea@gmail.com), Facebook
6. **QR Section** - Sección para compartir
7. **Footer** - Logo, redes sociales, copyright

## Problemas y Soluciones

### 1. Iconos no aparecían
- **Problema:** Lucide-react no tenía los iconos (Instagram, Facebook, etc.)
- **Solución:** Crear iconos SVG personalizados en `icons.tsx`

### 2. Deploy a GitHub Pages no funcionaba
- **Problema:** Next.js export genera rutas con `/` pero GitHub Pages espera `/incomparables-web/`
- **Intento 1:** Usar `basePath: "/incomparables-web"` - No funcionó bien
- **Intento 2:** Quitar basePath y servir desde root - Deploy exitoso

### 3. Logo visibilidad
- **Problema:** Logo se veía muy pequeño u opaque
- **Solución:** Centrar logo en nav, opacidad 40%, invertido a blanco

## Comandos Útiles
```bash
# Desarrollo local
cd ai-website-cloner-template && npm install && npm run dev

# Build para producción
npm run build

# Deploy (desde carpeta out/)
git add . && git commit -m "msg" && git push -f origin main
```

## Estado Actual
- Sitio deployed en GitHub Pages
- Build estático funciona
- Pendiente: verificar que todo cargue correctamente en el navegador
