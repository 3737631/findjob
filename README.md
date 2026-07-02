# AI Job Agent

SaaS para búsqueda inteligente de trabajo. Sube tu CV, encuentra empresas compatibles y envía emails personalizados con IA.

## Stack

- **Frontend**: Next.js 14 (App Router) + TailwindCSS + shadcn/ui
- **Backend**: API Routes de Next.js
- **Database + Auth + Storage**: Supabase (Postgres + Auth + Storage)
- **Hosting**: Vercel (free tier)
- **Emails**: Gmail API (OAuth2)
- **IA**: Anthropic Claude (Haiku para parseo/matching, Sonnet si se necesita más calidad)

## Requisitos previos

- Node.js 20+
- Cuenta en [Supabase](https://supabase.com) (free tier)
- Cuenta en [Vercel](https://vercel.com) (free tier)
- Cuenta en [Google Cloud Console](https://console.cloud.google.com) (crear credenciales OAuth2 para Gmail API)
- Cuenta en [Anthropic Console](https://console.anthropic.com) (API key)

## Configuración

1. Clona el repositorio:

```bash
git clone https://github.com/3737631/findjob.git
cd findjob
```

2. Instala dependencias:

```bash
npm install
```

3. Copia el archivo de variables de entorno:

```bash
cp .env.example .env.local
```

4. Configura las variables en `.env.local`:

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key de Supabase |
| `ANTHROPIC_API_KEY` | API key de Anthropic |
| `GOOGLE_CLIENT_ID` | Client ID de OAuth2 de Google |
| `GOOGLE_CLIENT_SECRET` | Client Secret de OAuth2 de Google |
| `GOOGLE_REDIRECT_URI` | URI de redirección OAuth2 |
| `NEXTAUTH_SECRET` | Secreto para NextAuth |
| `NEXTAUTH_URL` | URL de la aplicación |

5. Inicia el servidor de desarrollo:

```bash
npm run dev
```

## Base de datos (Supabase)

Ejecuta las siguientes migraciones SQL en el editor SQL de Supabase:

```sql
-- Tabla de usuarios (gestionada por Supabase Auth)
-- Tabla de CVs
CREATE TABLE cvs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  parsed_json JSONB,
  raw_file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de empresas
CREATE TABLE companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  industry TEXT,
  location TEXT,
  description TEXT,
  logo_url TEXT,
  source TEXT DEFAULT 'manual',
  contact_email TEXT,
  contact_form_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de aplicaciones
CREATE TABLE applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  company_id UUID REFERENCES companies(id),
  email_subject TEXT,
  email_body TEXT,
  status TEXT DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de tokens de Gmail
CREATE TABLE user_tokens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expiry_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Logs de aplicaciones
CREATE TABLE application_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES applications(id),
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bucket de Storage para CVs
INSERT INTO storage.buckets (id, name, public) VALUES ('cvs', 'cvs', true);
```

## Comandos

```bash
npm run dev        # Desarrollo
npm run build      # Build producción
npm run start      # Iniciar producción
npm run lint       # ESLint
npm run typecheck  # TypeScript Check
npm test           # Tests
npm run format     # Prettier
```

## Arquitectura

```
src/
├── app/             # Páginas (App Router)
│   ├── (auth)/      # Auth layout
│   ├── (dashboard)/ # Dashboard layout
│   ├── api/         # API Routes
│   └── onboarding/  # Onboarding
├── components/      # Componentes reutilizables
├── features/        # Módulos por funcionalidad
├── hooks/           # Custom hooks
├── lib/             # Utilidades compartidas
├── prompts/         # Prompts de IA
├── schemas/         # Validación Zod
├── services/        # Capa de servicios
│   ├── ai/          # Integración con Claude
│   ├── companies/   # Búsqueda de empresas
│   ├── cv/          # Procesamiento de CV
│   └── email/       # Integración con Gmail
├── stores/          # Estado global (Zustand)
├── types/           # Tipos TypeScript
└── utils/           # Funciones auxiliares
```
