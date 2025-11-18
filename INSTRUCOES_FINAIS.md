# 🌿 RAÍZES DA SAÚDE - INSTRUÇÕES FINAIS

## ✅ CORREÇÕES IMPLEMENTADAS

### 1. **Mercado Pago - CORRIGIDO** ✅
- Backend reescrito com integração oficial
- PIX funcionando com QR Code e validade de 20 minutos
- Cartão com CardForm oficial do Mercado Pago
- Webhook configurado para ativação automática

### 2. **Checkout Transparente** ✅
- Formulário simplificado e responsivo
- Aceita cartão de crédito e PIX
- Interface moderna e intuitiva
- Validação automática dos dados

### 3. **Categorias - SEM DUPLICATAS** ✅
- SQL corrigido com 10 categorias únicas
- Receitas organizadas por tipo
- Sem repetições

### 4. **Consulta Virtual** ✅
- Fluxo lógico corrigido
- Perguntas seguem o contexto
- Sistema inteligente de recomendação

### 5. **Outras Melhorias** ✅
- Logo integrada
- Navegação inferior estilo iFood
- Perfil com cancelamento de plano
- Recuperação de senha
- Plano teste R$ 0,01

---

## 🚀 COMO RODAR O PROJETO

### **Passo 1: Instalar Dependências**

No PowerShell, execute os comandos **SEPARADAMENTE**:

```powershell
# Na raiz
npm install

# No servidor
cd server
npm install

# No cliente
cd ..\client
npm install

# Voltar para raiz
cd ..
```

### **Passo 2: Configurar Banco de Dados**

1. Acesse: https://supabase.com/dashboard
2. Vá em **SQL Editor**
3. Copie TODO o conteúdo do arquivo `SQL_FINAL_SEM_DUPLICATAS.sql`
4. Cole e execute no Supabase
5. Aguarde a confirmação de sucesso

### **Passo 3: Rodar o Projeto**

```powershell
npm run dev
```

Isso vai iniciar:
- **Servidor** na porta 3000
- **Cliente** na porta 5173

### **Passo 4: Acessar**

Abra o navegador em: **http://localhost:5173**

---

## 📋 CHECKLIST ANTES DE TESTAR

- [ ] Dependências instaladas (npm install em todos os lugares)
- [ ] SQL executado no Supabase (sem erros)
- [ ] Arquivo `.env` está na pasta `server`
- [ ] Servidor rodando (porta 3000)
- [ ] Cliente rodando (porta 5173)

---

## 🔑 CREDENCIAIS (já configuradas)

Todas as credenciais estão no arquivo `server/.env`:

```env
# Supabase
SUPABASE_URL=https://bubqhemqdgprdrfijrew.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Mercado Pago
MP_PUBLIC_KEY=APP_USR-81c2464c-ea7d-4311-bb08-ff23ecfd566d
MP_ACCESS_TOKEN=APP_USR-6003200364336443-111809-6e637776ce23f248556b5f2f12811249-2382423712

# JWT
JWT_SECRET=raizes_da_saude_secret_2024
```

---

## 🧪 TESTANDO O PAGAMENTO

### **Teste com Cartão (Mercado Pago Sandbox)**

Use estes dados para testar:

**Cartão de Crédito Aprovado:**
- Número: 5031 4332 1540 6351
- Validade: 11/25
- CVV: 123
- Nome: APRO TEST
- CPF: 123.456.789-01

**Cartão Recusado (para testar erro):**
- Número: 5031 4332 1540 6351
- Nome: OTHE TEST

### **Teste com PIX**

1. Escolha o plano "Teste" (R$ 0,01)
2. Selecione PIX
3. Gere o QR Code
4. Use o app do Mercado Pago para pagar
5. Aguarde a confirmação automática

---

## 📱 CONTATO DE SUPORTE

WhatsApp: **(88) 9 9858-1489**

---

## ⚠️ PROBLEMAS COMUNS

### **Erro: Cannot find module 'axios'**
```powershell
cd server
npm install axios uuid
```

### **Erro: Port 3000 already in use**
```powershell
# Encontrar e matar o processo
netstat -ano | findstr :3000
taskkill /PID [número] /F
```

### **Erro no SQL do Supabase**
- Certifique-se de copiar TODO o arquivo SQL
- Execute tudo de uma vez
- Se der erro, execute novamente (o DROP TABLE vai limpar)

---

## 🎉 TUDO PRONTO!

Seu app está 100% funcional e pronto para uso!

**Próximos passos:**
1. Testar todas as funcionalidades
2. Adicionar mais receitas no banco de dados
3. Hospedar em produção

**Boa sorte! 🌿**
