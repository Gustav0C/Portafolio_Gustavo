# SEO Setup Instructions

Después de la optimización SEO de tu portafolio, necesitas completar algunos pasos para maximizar el impacto.

## 1. Google Search Console (GSC)

### Setup Inicial
1. Ir a https://search.google.com/search-console
2. Agregar propiedad: `https://gustavocanales.dev`
3. Seleccionar método de verificación (recomendado: DNS TXT record)
4. Validar propiedad

### Una vez verificado:
1. Ir a **Sitemaps** → Agregar sitemap
   - URL: `https://gustavocanales.dev/sitemap.xml`
2. Ir a **Coverage** para verificar que todas las páginas fueron indexadas
3. Ir a **Enhancements** → **Rich Results** para verificar estructura data
4. Monitorear **Performance** → Queries para ver tráfico orgánico

## 2. Google Analytics 4 (GA4)

### Setup en tu proyecto:

1. Crear una propiedad en https://analytics.google.com
2. Obtener tu **Measurement ID** (formato: `G-XXXXXXXXXX`)
3. Actualizar `.env.local`:
   ```bash
   NEXT_PUBLIC_GA_ID=G-YOUR_MEASUREMENT_ID
   ```

4. Instalar gtag (si aún no lo hiciste):
   ```bash
   npm install @react-google-analytics/core
   ```

5. Crear archivo `/src/components/Analytics.tsx`:
   ```typescript
   'use client';
   import { useEffect } from 'react';
   import { usePathname } from 'next/navigation';
   
   export function Analytics() {
     const pathname = usePathname();
   
     useEffect(() => {
       if (process.env.NEXT_PUBLIC_GA_ID) {
         const script = document.createElement('script');
         script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
         script.async = true;
         script.onload = () => {
           window.dataLayer = window.dataLayer || [];
           function gtag(...args: any[]) {
             window.dataLayer.push(arguments);
           }
           gtag('js', new Date());
           gtag('config', process.env.NEXT_PUBLIC_GA_ID);
         };
         document.head.appendChild(script);
       }
     }, []);
   
     return null;
   }
   ```

6. Usarlo en layout.tsx:
   ```typescript
   import { Analytics } from '@/components/Analytics';
   
   export default function RootLayout(...) {
     return (
       <html>
         <Analytics />
         {/* ... resto del layout */}
       </html>
     );
   }
   ```

7. Ir a Google Analytics Dashboard → Verificar datos en 24-48 horas

## 3. Bing Webmaster Tools

1. Ir a https://www.bing.com/webmasters
2. Agregar sitio: `https://gustavocanales.dev`
3. Verificar mediante archivo HTML o meta tag
4. Enviar sitemap: `https://gustavocanales.dev/sitemap.xml`

## 4. Verificación de Google

Para mejorar trust signal:

1. En Google Search Console, ir a **Settings** → **Ownership Verification**
2. Obtener código de verificación
3. Actualizar `src/app/layout.tsx`:
   ```typescript
   export const metadata: Metadata = {
     // ...
     verification: {
       google: "YOUR_VERIFICATION_CODE_HERE",
     },
   };
   ```

## 5. Validación de Structured Data

### Test tus schemas:

1. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Pegar: `https://gustavocanales.dev`
   - Verificar que no hay errores
   - Buscar rich results disponibles (breadcrumbs, person, organization)

2. **Schema.org Validator**
   - URL: https://validator.schema.org/
   - Pegar: `https://gustavocanales.dev`
   - Verificar que todos los schemas son válidos

## 6. Performance Monitoring

### Herramientas recomendadas:

1. **Google PageSpeed Insights**
   - URL: https://pagespeed.web.dev/
   - Analizar cada página del portfolio
   - Enfocarse en Core Web Vitals
   - Buscar oportunidades de mejora

2. **Lighthouse (en DevTools)**
   - Chrome → DevTools → Lighthouse
   - Seleccionar "Desktop" y "SEO"
   - Ejecutar audit
   - Buscar puntuación 90+

3. **Google Search Console**
   - **Enhancements** → Rich Results
   - Buscar errores o warnings
   - Fix cualquier issue encontrada

## 7. Testing URLs Específicas

### Revisar indexación:

En Google Search Console, usar "URL Inspection" para cada página:
- `https://gustavocanales.dev/`
- `https://gustavocanales.dev/perfil`
- `https://gustavocanales.dev/proyectos`
- `https://gustavocanales.dev/contacto`

Verificar que:
- ✅ URL está indexada
- ✅ Robots.txt no bloquea
- ✅ No hay errores de crawling
- ✅ Canonical es correcto

## 8. Monitoreo Continuo

### Frecuencia de revisión:

| Tarea | Frecuencia | Herramienta |
|-------|-----------|-----------|
| Indexación | Semanal | Search Console |
| Performance | Mensual | PageSpeed Insights |
| Rankings | Mensual | SERP tracking tools |
| Broken links | Mensual | Screaming Frog |
| Core Web Vitals | Mensual | CrUX Dashboard |
| Rich Results | Tras actualizar | Rich Results Test |

## 9. Optimizaciones Futuras

### Blog/Content (HIGH IMPACT)
- Agregar sección de blog
- Escribir artículos sobre:
  - Tutoriales de React/Next.js
  - Case studies de proyectos
  - Tips de desarrollo
- **Impacto**: Ranking en long-tail keywords, más tráfico

### Backlinks (MEDIUM IMPACT)
- Enviar portfolio a directorios de devs
- Participar en comunidades (DevTo, HashNode)
- Outreach a tech blogs
- GitHub README profile
- **Impacto**: Authority & trust signals

### Local SEO (si aplica)
- Agregar datos locales (Argentina)
- Structured data LocalBusiness
- Google My Business (si tienes negocio)
- **Impacto**: Búsquedas locales

## 10. Troubleshooting

### ¿Por qué mi sitio no aparece en Google?
- Esperar 30 días (indexación inicial)
- Revisar robots.txt no bloquea
- Verificar sitemap en GSC
- Revisar noindex meta tag

### ¿Por qué Rich Results no aparecen?
- Validar schemas con Rich Results Test
- Revisar JSON-LD es válido
- Google necesita ver patrón consistente
- Esperar crawl de Googlebot

### ¿Cómo mejorar ranking?
1. Contenido de calidad (primero)
2. Backlinks (segundo)
3. Core Web Vitals (tercero)
4. Señales técnicas (cuarto)

## 11. Recursos Útiles

- **Google Search Central**: https://developers.google.com/search
- **Next.js SEO Guide**: https://nextjs.org/learn/seo/introduction-to-seo
- **Schema.org Documentation**: https://schema.org/
- **Search Console Help**: https://support.google.com/webmasters/

---

**Status**: ✅ Listo para deployment  
**Próximo paso**: Deploy a producción y crear GSC property
