# 🔐 Painel Administrativo - Raízes da Saúde

## 🎯 Funcionalidades

Este painel administrativo permite gerenciar **TUDO** do projeto:

### ✅ Dashboard
- Estatísticas gerais (total de usuários, receitas, categorias)
- Gráficos de usuários por plano
- Gráficos de receitas por tipo
- Últimos usuários cadastrados

### ✅ Gerenciar Receitas
- **Listar** todas as receitas com paginação
- **Buscar** receitas por nome ou descrição
- **Filtrar** por categoria
- **Criar** novas receitas (chás, garrafadas, xaropes, etc)
- **Editar** receitas existentes
- **Deletar** receitas

### ✅ Gerenciar Categorias
- **Listar** todas as categorias
- **Criar** novas categorias
- **Editar** categorias (nome, descrição, ícone, cor)
- **Deletar** categorias

### ✅ Gerenciar Usuários
- **Listar** todos os usuários com paginação
- **Buscar** usuários por nome ou email
- **Visualizar** detalhes completos do usuário
- **Editar** dados do usuário (nome, email, telefone)
- **Alterar plano** do usuário (gratuito, semanal, mensal, anual, vitalício)
- **Definir data de expiração** do plano
- **Alterar senha** do usuário
- **Deletar** usuários

---

## 🚀 Como Usar

### 1. Acessar o Painel

Abra o arquivo `admin/index.html` no navegador:

```
http://localhost:5173/admin/index.html
```

Ou se estiver rodando um servidor local, acesse diretamente a pasta admin.

### 2. Fazer Login

**Chave de administrador padrão:**
```
raizes-admin-2024
```

A chave fica salva no navegador, então você não precisa digitar toda vez.

### 3. Navegar pelas Seções

Use o menu lateral para acessar:
- 📊 **Dashboard** - Visão geral
- 📚 **Receitas** - Gerenciar receitas
- 🗂️ **Categorias** - Gerenciar categorias
- 👥 **Usuários** - Gerenciar usuários

---

## 📝 Como Adicionar Receitas

1. Clique em **"Receitas"** no menu lateral
2. Clique no botão **"+ Nova Receita"**
3. Preencha o formulário:
   - **Nome da Receita** (obrigatório)
   - **Categoria** (obrigatório)
   - **Tipo** (chá, garrafada, xarope, etc)
   - **Descrição Breve**
   - **Indicações** (separadas por vírgula)
   - **Ingredientes** (formato JSON):
     ```json
     [
       {"item": "1 colher de folhas de boldo", "obs": "Frescas ou secas"},
       {"item": "500ml de água", "obs": "Filtrada"}
     ]
     ```
   - **Modo de Preparo** (passo a passo)
   - **Como Tomar** (dosagem)
   - **Quando Tomar** (horário/frequência)
   - **Contraindicações**
   - **Observações**
   - **Tempo de Preparo**
   - **Validade**
   - **URL da Imagem**
   - **Tags** (separadas por vírgula)
4. Clique em **"Salvar"**

---

## 🗂️ Como Adicionar Categorias

1. Clique em **"Categorias"** no menu lateral
2. Clique no botão **"+ Nova Categoria"**
3. Preencha:
   - **Nome** (ex: Digestivo)
   - **Descrição** (ex: Receitas para problemas digestivos)
   - **Ícone** (emoji, ex: 🌿)
   - **Cor** (escolha uma cor)
4. Clique em **"Salvar"**

---

## 👥 Como Gerenciar Usuários

### Ver Todos os Usuários
1. Clique em **"Usuários"** no menu lateral
2. Veja a lista completa com:
   - Nome
   - Email
   - Telefone
   - Plano atual
   - Data de expiração

### Editar Usuário
1. Clique no botão **"Editar"** ao lado do usuário
2. Modifique os dados:
   - Nome
   - Email
   - Telefone
   - Plano (gratuito, semanal, mensal, anual, vitalício)
   - Data de expiração do plano
3. Se quiser alterar a senha, digite a nova senha
4. Clique em **"Salvar"**

### Deletar Usuário
1. Clique em **"Editar"** no usuário
2. Clique no botão vermelho **"Deletar"**
3. Confirme a exclusão

---

## 🔧 Configuração Técnica

### Chave de Administrador

Por padrão, a chave é: `raizes-admin-2024`

Para alterar, edite o arquivo `server/.env` e adicione:

```env
ADMIN_KEY=sua-chave-secreta-aqui
```

### API Endpoints

Todas as rotas administrativas estão em:
```
http://localhost:3000/api/admin/*
```

Endpoints disponíveis:

**Dashboard:**
- `GET /api/admin/dashboard` - Estatísticas gerais

**Categorias:**
- `GET /api/admin/categorias` - Listar todas
- `POST /api/admin/categorias` - Criar nova
- `PUT /api/admin/categorias/:id` - Atualizar
- `DELETE /api/admin/categorias/:id` - Deletar

**Receitas:**
- `GET /api/admin/receitas` - Listar com paginação
- `GET /api/admin/receitas/:id` - Buscar por ID
- `POST /api/admin/receitas` - Criar nova
- `PUT /api/admin/receitas/:id` - Atualizar
- `DELETE /api/admin/receitas/:id` - Deletar

**Usuários:**
- `GET /api/admin/usuarios` - Listar com paginação
- `GET /api/admin/usuarios/:id` - Buscar por ID
- `PUT /api/admin/usuarios/:id` - Atualizar dados
- `PUT /api/admin/usuarios/:id/senha` - Alterar senha
- `DELETE /api/admin/usuarios/:id` - Deletar

### Autenticação

Todas as requisições precisam do header:
```
X-Admin-Key: raizes-admin-2024
```

---

## 🎨 Recursos do Painel

### Design Responsivo
- Funciona em desktop, tablet e mobile
- Menu lateral adaptável
- Tabelas responsivas

### Busca e Filtros
- Buscar receitas por nome/descrição
- Filtrar receitas por categoria
- Buscar usuários por nome/email

### Paginação
- 20 itens por página
- Navegação fácil entre páginas
- Indicador de página atual

### Modais
- Formulários em modais para melhor UX
- Validação de campos obrigatórios
- Feedback visual de ações

### Estatísticas em Tempo Real
- Dashboard atualizado automaticamente
- Contadores de totais
- Gráficos de distribuição

---

## 🛡️ Segurança

⚠️ **IMPORTANTE:**

1. **Altere a chave padrão** em produção
2. **Não compartilhe** a chave de administrador
3. **Use HTTPS** em produção
4. **Limite o acesso** ao painel (IP whitelist, firewall)
5. **Faça backup** regular do banco de dados

---

## 📱 Acesso Rápido

Para facilitar o acesso, você pode:

1. **Criar um atalho** no desktop para `admin/index.html`
2. **Adicionar aos favoritos** do navegador
3. **Criar um alias** no servidor web para `/admin`

---

## 🐛 Troubleshooting

### Erro: "Acesso negado"
- Verifique se a chave de administrador está correta
- Verifique se o servidor está rodando

### Erro ao carregar dados
- Verifique se o servidor backend está rodando na porta 3000
- Verifique o console do navegador (F12) para mais detalhes
- Verifique se o CORS está habilitado no servidor

### Erro ao salvar receita
- Verifique o formato JSON dos ingredientes
- Certifique-se de preencher todos os campos obrigatórios
- Verifique se a categoria existe

---

## 🎉 Pronto!

Agora você tem **controle total** sobre o projeto Raízes da Saúde!

Você pode:
- ✅ Adicionar quantas receitas quiser
- ✅ Criar novas categorias
- ✅ Gerenciar todos os usuários
- ✅ Alterar planos e senhas
- ✅ Ver estatísticas em tempo real
- ✅ Fazer tudo isso de forma fácil e rápida!

**Desenvolvido com ❤️ para Raízes da Saúde**
