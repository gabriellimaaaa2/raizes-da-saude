# 🌿 Raízes da Saúde

Plataforma digital de remédios caseiros e sabedoria popular brasileira com sistema de assinaturas e integração Mercado Pago.

## 📋 Sobre o Projeto

O **Raízes da Saúde** é uma enciclopédia definitiva da sabedoria popular brasileira sobre remédios caseiros, chás, garrafadas e preparos naturais. O projeto oferece mais de 200 receitas detalhadas organizadas por categorias, com sistema de assinaturas e consulta virtual guiada.

## ✨ Funcionalidades

- ✅ **Mais de 200 receitas** de chás, garrafadas e remédios caseiros
- ✅ **Sistema de categorias** (Digestivo, Respiratório, Calmante, etc.)
- ✅ **Autenticação completa** (login e cadastro)
- ✅ **Limite de 3 receitas grátis por dia** para usuários não assinantes
- ✅ **Sistema de assinaturas** (Semanal, Mensal, Anual, Vitalício)
- ✅ **Integração Mercado Pago** (cartão de crédito, PIX, boleto)
- ✅ **Consulta Virtual Guiada** com 13 perguntas
- ✅ **Sistema de favoritos**
- ✅ **Interface moderna estilo iFood**
- ✅ **Responsivo** para mobile e desktop

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- Supabase (PostgreSQL)
- JWT para autenticação
- Mercado Pago SDK
- bcryptjs para hash de senhas

### Frontend
- React 18
- React Router DOM
- Axios
- Vite
- CSS moderno (estilo iFood)

## 📦 Instalação

### 1. Instalar dependências

```bash
# Instalar dependências do servidor
cd server
npm install

# Instalar dependências do cliente
s

```

### 2. Configurar Banco de Dados (Supabase)

1. Acesse seu projeto no Supabase
2. Vá em **SQL Editor**
3. Cole e execute o conteúdo do arquivo `database/schema.sql`
4. Isso criará todas as tabelas e inserirá as categorias e receitas

### 3. Variáveis de Ambiente

As credenciais já estão configuradas no arquivo `server/.env`:

```env
# Supabase
SUPABASE_URL=https://bubqhemqdgprdrfijrew.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Mercado Pago
MP_PUBLIC_KEY=APP_USR-81c2464c-ea7d-4311-bb08-ff23ecfd566d
MP_ACCESS_TOKEN=APP_USR-6003200364336443-111809-6e637776ce23f248556b5f2f12811249-2382423712
MP_CLIENT_ID=6003200364336443
MP_CLIENT_SECRET=kfIF69tPJyrx0txvCRTrrqUoeF2USlCx

# JWT
JWT_SECRET=raizes-da-saude-secret-key-2024-super-secure

# Server
PORT=3000
NODE_ENV=production
```

## 🚀 Como Rodar

### Opção 1: Rodar tudo junto (Recomendado)

```bash
npm run dev
```

Isso iniciará:
- Backend na porta 3000
- Frontend na porta 5173

### Opção 2: Rodar separadamente

Terminal 1 (Backend):
```bash
cd server
npm start
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

## 🌐 Acessar o App

Após iniciar, acesse:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api

## 📱 Funcionalidades Detalhadas

### Sistema de Receitas
- Visualização de receitas por categoria
- Busca por nome, sintoma ou ingrediente
- Detalhes completos: ingredientes, modo de preparo, como tomar, contraindicações
- Sistema de favoritos

### Sistema de Assinaturas
- **Plano Gratuito**: 3 receitas por dia
- **Plano Semanal**: R$ 9,90 - 7 dias
- **Plano Mensal**: R$ 29,90 - 30 dias
- **Plano Anual**: R$ 199,90 - 1 ano
- **Plano Vitalício**: R$ 497,00 - para sempre

### Consulta Virtual
Sistema de 13 perguntas guiadas que recomenda receitas baseadas nos sintomas do usuário.

### Integração Mercado Pago
- Checkout transparente
- Aceita: Cartão de crédito, PIX, Boleto
- Webhook automático para ativação de planos
- Parcelamento disponível

## 🔒 Segurança

- Senhas criptografadas com bcrypt
- Autenticação JWT
- Validação de tokens em todas as rotas protegidas
- Credenciais do Mercado Pago no backend (nunca expostas no frontend)
- Avisos de segurança em todas as receitas

## 📊 Estrutura do Banco de Dados

- **usuarios**: Dados dos usuários e planos
- **categorias**: Categorias de receitas
- **receitas**: Todas as receitas (200+)
- **favoritos**: Receitas favoritadas pelos usuários
- **visualizacoes**: Histórico de visualizações
- **pagamentos**: Registro de pagamentos
- **consultas**: Histórico de consultas virtuais

## 🎨 Interface

Design moderno inspirado no iFood:
- Cards elegantes
- Cores naturais (verde, branco)
- Navegação intuitiva
- Responsivo para mobile
- Animações suaves

## 📝 Avisos Importantes

⚠️ **AVISO LEGAL**: Este conteúdo é baseado na sabedoria popular e não substitui uma consulta médica. Sempre consulte um médico antes de usar qualquer remédio caseiro.

## 🚢 Deploy

### Backend
Pode ser hospedado em:
- Heroku
- Railway
- Render
- DigitalOcean
- AWS

### Frontend
Pode ser hospedado em:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

### Banco de Dados
Já está no Supabase (cloud)

## 📞 Suporte

Para dúvidas ou problemas, entre em contato através do sistema de suporte.

## 📄 Licença

MIT License - Sinta-se livre para usar e modificar.

---

Desenvolvido com 💚 para preservar a sabedoria popular brasileira
