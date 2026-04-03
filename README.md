# Portfolio React con Vite

Esta aplicación es un portfolio personal de Valentín Garzaniti construido con React + Vite.

## Estructura actual

- `src/components` - componentes UI: `Navbar`, `Hero`, `About`, `Projects`, `Contact`, `Layout`
- `src/pages` - rutas: `home`, `about`, `projects`, `contact`, `notfound`
- `src/styles` - CSS compartido/componentes
- `src/data/projects.js` - datos de proyectos usados en `Projects` (actualmente CLUD2025)

## Proyecto principal

- CLUD2025 (React + Django + PostgreSQL)
- Frontend: https://clud2025.vercel.app/
- Backend: Render + neon.tech
- Credenciales de administrador (para demo local/privado): admin@gmail.com / admin123

## Routing

Se usa `react-router-dom` con:

- `/` → `Home` (Hero + About + Projects + Contact)
- `/about` → sección About
- `/projects` → sección Projects
- `/contact` → sección Contact
- `*` → página 404

## Script importantes

- `npm install`
- `npm run dev`
- `npm run build`

## Mejora de la experiencia de reclutador

- Lazy loading (React.lazy + Suspense)
- Layout con navbar/footer consistente
- Datos de proyectos separados en `src/data`
- `README` actualizado

## Dependencias

- `react` ^19
- `react-dom` ^19
- `react-router-dom` (ruteo)

---

**Siguientes pasos propuestos**

- agregar tests de componentes (Vitest + @testing-library/react)
- desplegar en Vercel/Railway
- incluir badge de cobertura en el README
