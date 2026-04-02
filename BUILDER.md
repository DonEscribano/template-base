# BUILDER.md — Manual para Claude Code

## Tu mision

Construir la web/app de {{BUSINESS_NAME}} siguiendo este documento
y el spec JSON en `client_projects`. No improvises nada.
Cada decision esta tomada. Tu trabajo es ejecutarla perfectamente.

---

## Paso 0 — Antes de empezar

1. Lee el spec JSON completo. Dos veces.
2. Verifica que tienes todas las variables de entorno del `.env.example`
3. Si algo del spec esta incompleto, DETENTE y avisa a JARVIS
4. No continues si falta informacion critica (logo, colores, servicios)

---

## Paso 1 — Setup (Checkpoint 1)

```bash
git clone https://github.com/DonEscribano/template-base {{PROJECT_ID}}
cd {{PROJECT_ID}}
git remote set-url origin https://github.com/DonEscribano/{{PROJECT_ID}}
git push -u origin main
npm install
```

Crea el proyecto en Vercel vinculado al repo.
Crea el proyecto en Supabase segun `spec.hosting`.
Copia `.env.example` a `.env.local` y rellena con las credenciales.

Configura Sentry:
- Instala `@sentry/nextjs` (ya esta en dependencias)
- El DSN viene en `spec.integrations.sentry_dsn`
- Verifica que `sentry.client.config.ts` y `sentry.server.config.ts` tienen el DSN

Cuando el proyecto arranque localmente (`npm run dev`):
**CHECKPOINT 1 completado.**

---

## Paso 2 — Base de datos (Checkpoint 2)

Ejecuta las migraciones en Supabase:
```bash
supabase db push
```

Ejecuta `seed.sql` adaptado con los datos del spec:
- Servicios desde `spec.services[]`
- Equipo desde `spec.team[]`
- Horarios desde `spec.schedule`

Crea el usuario admin del cliente:
1. En Supabase Dashboard > Authentication > Users > Add User
2. Email: el email del cliente en `spec.client.email`
3. Password: generar uno seguro
4. En SQL Editor, asignar rol admin:
```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'
WHERE email = '{{CLIENT_EMAIL}}';
```
5. Enviar credenciales al cliente via Resend (email seguro, no plaintext)

Verifica en Supabase dashboard que las tablas tienen datos y RLS esta activo.
**CHECKPOINT 2 completado.**

---

## Paso 3 — Tema visual + Paginas (Checkpoint 3)

En `app/globals.css`, actualiza las variables CSS:
```css
:root {
  --color-primary: {{brand.colors.primary}};
  --color-secondary: {{brand.colors.secondary}};
  --color-accent: {{brand.colors.accent}};
  --color-text: {{brand.colors.text}};
  --color-background: {{brand.colors.background}};
}
```

Configura fuentes en `app/layout.tsx`:
- Heading: `{{brand.font_heading}}` (cargar desde /public/fonts/ o next/font/google)
- Body: `{{brand.font_body}}`

Construye SOLO las paginas que estan en `spec.pages[]`.
No construyas paginas que no estan en el spec.

Orden de construccion:
1. Home (Hero + Services + Testimonials + CTA + Contact)
2. Servicios (lista + detalle dinamico si aplica)
3. Equipo (solo si "equipo" en spec.pages)
4. Galeria (solo si "galeria" en spec.pages)
5. Testimonios (solo si "testimonios" en spec.pages)
6. Reservas (solo si spec.features.booking = true)
7. Contacto
8. Legal (siempre: privacidad + cookies + aviso legal)

Los textos vienen de `spec.content` y `spec.services`.
Las imagenes vienen de `/public/images/` (subidas en onboarding).

**CHECKPOINT 3 completado** cuando todas las paginas cargan sin errores.

---

## Paso 4 — Integraciones (Checkpoint 4)

Activa SOLO las integraciones con valor en `spec.integrations` distinto de null.

### WhatsApp Bot (si `spec.features.whatsapp_bot = true`)

**IMPORTANTE: Template approval de Meta**
Antes de activar recordatorios automaticos, los templates deben estar
aprobados por Meta. Esto tarda 1-3 dias. Mientras tanto:
- El bot funciona con mensajes de sesion (dentro de ventana 24h)
- Los recordatorios quedan desactivados hasta tener template IDs
- Una vez aprobados, documenta los template IDs en `.env`:
  `WHATSAPP_TEMPLATE_BOOKING_CONFIRMATION=...`
  `WHATSAPP_TEMPLATE_REMINDER_24H=...`

Configura el webhook en `/api/webhook/whatsapp/route.ts`:
- El bot responde a: horarios, precios, "quiero reservar"
- Flujo de reserva: servicio -> fecha -> hora -> confirmacion
- Test: envia "hola" al numero y verifica respuesta

### Recordatorios automaticos (si `spec.features.booking = true`)

Cron en `vercel.json`:
```json
{ "path": "/api/cron/reminders", "schedule": "0 10 * * *" }
```
- Email recordatorio 24h antes (siempre)
- WhatsApp recordatorio 2h antes (solo si whatsapp activo + templates aprobados)

### Email (Resend)
- Confirmacion de reserva al cliente
- Notificacion de nueva reserva al negocio
- Templates en `/lib/email/templates/` con React Email

### Stripe (si `spec.features.payments = true`)
- Checkout session al confirmar reserva
- Webhook para confirmar pago
- Actualizar `payment_status` en reserva

**CHECKPOINT 4 completado** cuando las integraciones activas responden.

---

## Paso 5 — Deploy staging (Checkpoint 5)

```bash
git add -A && git commit -m "feat: complete {{BUSINESS_NAME}} build"
git push
```

Vercel despliega automaticamente.
URL staging: `{{project_id}}-git-main-donescribanos-projects.vercel.app`

### Panel admin
Verifica que el panel admin funciona:
- Login con las credenciales del cliente
- Dashboard muestra metricas
- Gestion de reservas funcional
- Solo usuarios con role=admin pueden acceder

### Verificaciones obligatorias
- [ ] Todas las paginas cargan sin errores
- [ ] Formulario de reservas completa el flujo
- [ ] Admin panel protegido con auth + role
- [ ] `/api/health` devuelve 200
- [ ] Lighthouse >90 en Performance, Accessibility, SEO
- [ ] Sentry configurado y recibiendo eventos

**CHECKPOINT 5 completado.** Avisa a JARVIS para que GUARDIAN audite.

---

## Decision de backups

Durante el onboarding, el cliente elige:

**Opcion A — Supabase Pro ($25/mes)**
- Backups automaticos diarios
- Point-in-time recovery (hasta 7 dias)
- Mejor opcion para clientes que manejan datos sensibles (pacientes, reservas)

**Opcion B — pg_dump semanal via Cowork ($0)**
- Cron semanal crea cowork_task que ejecuta pg_dump
- Backup almacenado en Supabase Storage del proyecto
- Retencion: ultimas 4 copias (1 mes)
- Menor coste pero sin point-in-time recovery

Documenta la decision en `spec.backup_strategy`: `"supabase_pro"` o `"weekly_dump"`.
Si es weekly_dump, anade este cron a vercel.json:
```json
{ "path": "/api/cron/backup", "schedule": "0 3 * * 0" }
```

---

## Reglas absolutas

- NUNCA commitear `.env` ni `.env.local`
- NUNCA desactivar RLS
- NUNCA hardcodear textos del cliente en el codigo (van en `lib/config/site.ts`)
- NUNCA usar `any` en TypeScript
- NUNCA `console.log` en produccion (usa Sentry para errores)
- Si Lighthouse <90, optimiza antes de avisar a JARVIS
- Si `npm audit` reporta vulnerabilidades high/critical, arregla antes de continuar

---

## Como reportar a JARVIS

No necesitas hacer nada especial. El daemon de Cowork detecta cuando
terminas y escribe el resultado en `cowork_tasks`. JARVIS lo lee automaticamente.

Si necesitas comunicar algo urgente durante la ejecucion, escribe en
`cowork_tasks.checkpoint_message` via Supabase.
