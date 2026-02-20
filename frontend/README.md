# ClaunNetworking Frontend

Frontend React para ClaunNetworking Oportunidades - Totalmente independente e pronto para deploy externo.

## 🚀 Início Rápido

### Instalação

```bash
npm install
# ou
pnpm install
```

### Configuração de Variáveis de Ambiente

1. Copie `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure as variáveis:
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=ClaunNetworking Oportunidades
VITE_APP_TITLE=Sua rede de oportunidades
VITE_ENV=development
```

### Desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
npm run preview
```

## 📁 Estrutura de Pastas

```
src/
├── pages/              # Páginas da aplicação
│   ├── Home.tsx       # Página inicial
│   ├── Jobs.tsx       # Listagem de vagas
│   ├── Courses.tsx    # Listagem de cursos
│   ├── JobDetail.tsx  # Detalhe da vaga
│   ├── CourseDetail.tsx # Detalhe do curso
│   ├── Admin/         # Painel administrativo
│   └── Login.tsx      # Página de login
│
├── components/         # Componentes reutilizáveis
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── JobCard.tsx
│   ├── CourseCard.tsx
│   └── ...
│
├── hooks/             # Custom hooks
│   ├── useAuth.ts     # Autenticação
│   ├── useApi.ts      # Requisições HTTP
│   └── ...
│
├── lib/               # Utilitários
│   ├── api.ts         # Cliente HTTP
│   ├── constants.ts   # Constantes
│   └── utils.ts       # Funções utilitárias
│
├── App.tsx            # Componente raiz
├── main.tsx           # Ponto de entrada
└── index.css          # Estilos globais
```

## 🔌 Integração com Backend

### Configurar URL da API

A URL da API é configurada via variável de ambiente `VITE_API_URL`:

```env
# Desenvolvimento
VITE_API_URL=http://localhost:3000

# Produção
VITE_API_URL=https://seu-backend.railway.app
```

### Cliente HTTP

Use o cliente HTTP pré-configurado:

```typescript
import { api } from '@/lib/api';

// GET
const jobs = await api.get('/jobs');

// POST
const newJob = await api.post('/jobs', { title: '...' });

// Com autenticação
const headers = {
  Authorization: `Bearer ${token}`
};
const result = await api.post('/jobs', data, { headers });
```

## 🔐 Autenticação

### Login

```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginPage() {
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    const { token, user } = await login(email, password);
    // Token é salvo automaticamente
  };

  return (
    // Formulário de login
  );
}
```

### Verificar Autenticação

```typescript
const { user, isAuthenticated, token } = useAuth();

if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
```

### Logout

```typescript
const { logout } = useAuth();

const handleLogout = () => {
  logout();
  // Redirecionar para home
};
```

## 📊 Páginas Principais

### Home
- Exibe estatísticas gerais
- Links para vagas e cursos
- Destaques

### Jobs (Vagas)
- Listagem com filtros
- Busca por título/empresa
- Filtros: modalidade, categoria, PCD
- Card com informações básicas

### Courses (Cursos)
- Listagem com filtros
- Busca por título/instituição
- Filtros: modalidade, categoria, gratuito
- Card com informações básicas

### Admin Dashboard
- Criar/editar/deletar vagas
- Criar/editar/deletar cursos
- Visualizar estatísticas
- Gerenciar usuários

## 🎨 Styling

O projeto usa **Tailwind CSS** para estilização.

### Customizar Cores

Edite `src/index.css`:

```css
@theme {
  --color-primary: oklch(0.5 0.2 240);
  --color-secondary: oklch(0.6 0.15 120);
}
```

### Componentes Comuns

```typescript
// Botão
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Click me
</button>

// Card
<div className="p-6 bg-white rounded-lg shadow-md">
  Conteúdo
</div>

// Input
<input
  type="text"
  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  placeholder="Digite aqui..."
/>
```

## 🚀 Deploy no Vercel

### Pré-requisitos
- Conta no Vercel
- Repositório GitHub

### Passos

1. **Conectar repositório**
   - Ir para vercel.com
   - Importar projeto GitHub
   - Selecionar pasta `frontend/`

2. **Configurar variáveis**
   ```
   VITE_API_URL=https://seu-backend.railway.app
   VITE_ENV=production
   ```

3. **Deploy**
   - Vercel fará deploy automaticamente a cada push

## 🚀 Deploy no Railway

### Pré-requisitos
- Conta no Railway
- Repositório GitHub

### Passos

1. **Criar novo projeto**
   - Conectar repositório GitHub
   - Selecionar branch `main`

2. **Configurar build**
   - Build command: `npm run build`
   - Start command: `npm run preview`
   - Root directory: `frontend/`

3. **Variáveis de ambiente**
   ```
   VITE_API_URL=https://seu-backend.railway.app
   VITE_ENV=production
   ```

4. **Deploy**
   - Railway fará deploy automaticamente

## 📱 Responsividade

O projeto é mobile-first e responsivo:

```typescript
// Exemplo com Tailwind
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards que se adaptam ao tamanho da tela */}
</div>
```

## 🔍 SEO

Adicione meta tags no `index.html`:

```html
<meta name="description" content="Sua rede de oportunidades">
<meta name="keywords" content="vagas, cursos, oportunidades">
<meta name="og:title" content="ClaunNetworking">
<meta name="og:description" content="Sua rede de oportunidades">
```

## 🧪 Testing

```bash
# Executar testes
npm run test

# Cobertura
npm run test:coverage
```

## 📝 Exemplo de Componente

```typescript
import React from 'react';
import { api } from '@/lib/api';

interface Job {
  id: string;
  title: string;
  company: string;
  modality: string;
}

export function JobCard({ job }: { job: Job }) {
  const handleClick = async () => {
    // Registrar clique
    await api.post(`/jobs/${job.id}/click`);
    // Redirecionar
    window.open(job.link, '_blank');
  };

  return (
    <div className="p-4 border rounded-lg hover:shadow-lg transition">
      <h3 className="text-lg font-bold">{job.title}</h3>
      <p className="text-gray-600">{job.company}</p>
      <p className="text-sm text-gray-500">{job.modality}</p>
      <button
        onClick={handleClick}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Ver Vaga
      </button>
    </div>
  );
}
```

## 🔧 Troubleshooting

### Erro de CORS
- Verifique `VITE_API_URL`
- Certifique-se de que o backend está rodando
- Verifique configuração de CORS no backend

### Página em branco
- Abra DevTools (F12)
- Verifique console para erros
- Verifique se o backend está acessível

### Token expirado
- Faça login novamente
- O token é armazenado em localStorage

## 📄 Licença

MIT

---

**Pronto para deploy!** 🚀
