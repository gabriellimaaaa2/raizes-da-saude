# 📊 Instruções para Configurar o Banco de Dados no Supabase

## Passo a Passo:

### 1. Acesse seu Projeto no Supabase
- Vá para: https://supabase.com/dashboard
- Selecione seu projeto: `bubqhemqdgprdrfijrew`

### 2. Abra o SQL Editor
- No menu lateral, clique em **"SQL Editor"**
- Clique em **"New query"**

### 3. Cole o SQL
- Abra o arquivo `database/schema.sql`
- Copie TODO o conteúdo
- Cole no editor SQL do Supabase

### 4. Execute o SQL
- Clique no botão **"Run"** (ou pressione Ctrl+Enter)
- Aguarde a execução (pode levar alguns segundos)
- Você verá uma mensagem de sucesso

### 5. Verifique as Tabelas
- No menu lateral, clique em **"Table Editor"**
- Você deve ver as seguintes tabelas:
  - ✅ usuarios
  - ✅ categorias
  - ✅ receitas
  - ✅ favoritos
  - ✅ visualizacoes
  - ✅ pagamentos
  - ✅ consultas

### 6. Verifique os Dados
- Clique na tabela **"categorias"** - deve ter 10 categorias
- Clique na tabela **"receitas"** - deve ter várias receitas de exemplo

## ⚠️ Importante

O arquivo `schema.sql` já contém:
- ✅ Criação de todas as tabelas
- ✅ Índices para performance
- ✅ 10 categorias pré-cadastradas
- ✅ Receitas de exemplo em cada categoria

## 🔧 Se algo der errado

Se você receber algum erro:

1. **Erro de tabela já existe**: 
   - Vá em Table Editor
   - Delete as tabelas manualmente
   - Execute o SQL novamente

2. **Erro de permissão**:
   - Certifique-se de estar usando a chave correta
   - Verifique se está no projeto correto

3. **Erro de sintaxe**:
   - Certifique-se de copiar TODO o conteúdo do arquivo
   - Não modifique nada

## 📝 Nota sobre Receitas

O SQL contém receitas de exemplo. Para adicionar as 200+ receitas completas, você pode:

1. **Opção 1**: Adicionar manualmente pelo Table Editor do Supabase
2. **Opção 2**: Criar um script de seed separado
3. **Opção 3**: Adicionar via API do próprio app

O importante é que a estrutura está pronta e funcional!

## ✅ Pronto!

Após executar o SQL, seu banco de dados estará 100% configurado e pronto para uso!
