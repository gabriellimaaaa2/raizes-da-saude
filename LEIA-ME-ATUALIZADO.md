# 🌿 RAÍZES DA SAÚDE - ATUALIZAÇÃO COMPLETA

## ✨ O QUE FOI ATUALIZADO

### 🍶 NOVA CATEGORIA: GARRAFADAS
Adicionada categoria completa de **Garrafadas Tradicionais** com mais de 30 receitas incluindo:

- **Garrafadas Digestivas**: Estômago Forte, Fígado e Vesícula
- **Garrafadas Respiratórias**: Pulmão Limpo, Garganta
- **Garrafadas para Dor**: Juntas, Coluna, Ciático
- **Garrafadas para Imunidade**: Imunidade Forte, Sangue Forte
- **Garrafadas para Circulação**: Circulação, Coração
- **Garrafadas para Rins**: Rins, Pedras
- **Garrafadas Energéticas**: Pique, Ânimo
- **Garrafadas para Mulher**: TPM, Menopausa, Fertilidade
- **Garrafadas Especiais**: Diabético, Próstata, Colesterol, Memória, Sono, Ansiedade, Pele, Cabelo, Fígado Gordo, Tireoide, Enxaqueca, Sinusite, Ossos Fortes, Intestino Preso, Pressão Alta, Virilidade

### 🍵 CONSULTA VIRTUAL MELHORADA
Agora a consulta virtual pergunta ao usuário:
- **"Você prefere tomar uma garrafada ou um chá?"**
- Opções: Garrafada, Chá ou Ambos
- Explicação das diferenças entre garrafadas e chás
- Recomendações personalizadas baseadas na preferência

### 📦 MAIS PRODUTOS
Adicionados dezenas de novos produtos em todas as categorias:
- **80+ receitas completas** (garrafadas, chás, xaropes, compressas, sucos)
- Todas com ingredientes detalhados
- Modo de preparo passo a passo
- Indicações, contraindicações e observações
- Imagens ilustrativas

---

## 🚀 COMO USAR O SQL ATUALIZADO

### OPÇÃO 1: SQL Editor do Supabase (RECOMENDADO)

1. **Acesse seu projeto no Supabase**
   - Entre em https://supabase.com
   - Abra seu projeto "Raízes da Saúde"

2. **Abra o SQL Editor**
   - No menu lateral, clique em "SQL Editor"
   - Clique em "New query"

3. **Cole o SQL completo**
   - Abra o arquivo: `database/SQL_COMPLETO_ATUALIZADO.sql`
   - Copie TODO o conteúdo
   - Cole no SQL Editor

4. **Execute**
   - Clique em "Run" ou pressione `Ctrl+Enter`
   - Aguarde a execução (pode demorar alguns segundos)
   - Pronto! Seu banco está atualizado

### OPÇÃO 2: Supabase CLI

```bash
# No terminal, dentro da pasta do projeto
supabase db reset
# Depois execute o SQL atualizado
```

---

## 📁 ARQUIVOS IMPORTANTES

### `/database/SQL_COMPLETO_ATUALIZADO.sql`
**👉 ESTE É O ARQUIVO PRINCIPAL QUE VOCÊ DEVE USAR!**

Contém:
- ✅ Criação de todas as tabelas
- ✅ 11 categorias (incluindo Garrafadas)
- ✅ 80+ receitas completas
- ✅ Índices para performance
- ✅ Tudo pronto para executar

### `/client/src/pages/ConsultaVirtual.jsx`
**Atualizado** com a nova pergunta sobre preferência entre garrafadas e chás.

### `/database/receitas_expandidas.sql`
Arquivo com receitas adicionais (já incluídas no SQL_COMPLETO_ATUALIZADO.sql)

---

## 🎯 ESTRUTURA DAS GARRAFADAS

Todas as garrafadas seguem o padrão:

```sql
INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade, imagem_url, tags)
```

**Campos importantes:**
- `tipo`: 'garrafada'
- `ingredientes`: JSON com lista de ingredientes e observações
- `modo_preparo`: Instruções detalhadas de curtimento (15-20 dias)
- `como_tomar`: Dosagem em colheres
- `validade`: Até 1-2 anos em local escuro
- `tags`: Array para busca e filtros

---

## 🔍 COMO FUNCIONA A CONSULTA ATUALIZADA

### Fluxo da Consulta:

1. **Etapa 1**: Qual parte do corpo? (Cabeça, Peito, Barriga, Corpo)
2. **Etapa 2**: Problema específico (baseado na área escolhida)
3. **Etapa 3**: **NOVO!** Preferência: Garrafada ou Chá?
   - 🍶 Garrafada (mais forte, precisa curtir 15-20 dias)
   - 🍵 Chá (preparo rápido, na hora)
   - 🌿 Ambos (ver os dois tipos)
4. **Etapa 4**: Intensidade do problema
5. **Etapa 5**: Duração do problema
6. **Etapa 6**: Alergias e medicamentos

### Resultado:
- Categoria recomendada
- Tipo preferido (garrafada ou chá)
- Resumo da consulta
- Botão para ver receitas filtradas

---

## 📊 CATEGORIAS DISPONÍVEIS

1. 🌿 **Digestivo** - Estômago, intestino, digestão
2. 🍃 **Respiratório** - Tosse, gripe, pulmões
3. 🌸 **Calmante** - Ansiedade, insônia, nervosismo
4. 🌺 **Dor e Inflamação** - Dores musculares, articulares
5. 🍊 **Imunidade** - Fortalecer defesas
6. ❤️ **Circulação** - Varizes, circulação sanguínea
7. 🌼 **Pele e Cabelo** - Tratamentos naturais
8. 🍋 **Fígado e Rins** - Depurativos, desintoxicantes
9. ⚡ **Energia e Disposição** - Tônicos, energéticos
10. 🌹 **Mulher** - Saúde feminina
11. 🍶 **Garrafadas** - **NOVA!** Garrafadas tradicionais

---

## 💡 DICAS IMPORTANTES

### Para Garrafadas:
- Usar vidro escuro (âmbar ou verde escuro)
- Deixe curtir em local escuro e fresco
- Agitar diariamente durante o curtimento
- Coar bem antes de engarrafar
- Armazenar em garrafa escura bem vedada
- Validade: 1-2 anos se bem armazenada

### Para Chás:
- Usar água filtrada ou mineral
- Não ferver ervas delicadas (flores)
- Tampar durante a infusão
- Consumir logo após o preparo
- Não adoçar (ou usar mel se necessário)

### Contraindicações Gerais:
- Gestantes e lactantes: evitar a maioria
- Crianças: doses reduzidas, consultar pediatra
- Alcoolistas em recuperação: evitar garrafadas
- Pessoas com doenças graves: consultar médico
- Interações medicamentosas: sempre verificar

---

## 🎨 PRÓXIMOS PASSOS

1. **Execute o SQL atualizado** no Supabase
2. **Teste a consulta virtual** com a nova pergunta
3. **Navegue pelas receitas** na categoria Garrafadas
4. **Personalize** as imagens (substitua URLs do Unsplash por suas próprias)
5. **Adicione mais receitas** usando o template fornecido

---

## 📝 TEMPLATE PARA ADICIONAR MAIS RECEITAS

```sql
INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade, imagem_url, tags) 
SELECT id, 
'[NOME DA RECEITA]', 
'[DESCRIÇÃO BREVE]', 
'[TIPO: chá/garrafada/xarope/compressa/banho/óleo/pomada/tintura]', 
'[INDICAÇÕES SEPARADAS POR VÍRGULA]', 
'[{"item": "[INGREDIENTE 1]", "obs": "[OBSERVAÇÃO]"}, {"item": "[INGREDIENTE 2]", "obs": "[OBSERVAÇÃO]"}]'::jsonb,
'[MODO DE PREPARO DETALHADO PASSO A PASSO]',
'[COMO TOMAR - DOSE]',
'[QUANDO TOMAR - HORÁRIO/FREQUÊNCIA]',
'[CONTRAINDICAÇÕES]',
'[OBSERVAÇÕES IMPORTANTES]',
'[TEMPO DE PREPARO]',
'[VALIDADE/ARMAZENAMENTO]',
'[URL DA IMAGEM]',
ARRAY['[tag1]', '[tag2]', '[tag3]']
FROM categorias WHERE nome = '[CATEGORIA]';
```

---

## 🎉 RESUMO DO QUE VOCÊ TEM AGORA

✅ **11 categorias** completas
✅ **30+ garrafadas** tradicionais detalhadas
✅ **50+ chás, xaropes e outras receitas**
✅ **Consulta virtual** com preferência garrafada/chá
✅ **SQL completo** pronto para executar
✅ **Código atualizado** da consulta virtual
✅ **Documentação** completa

---

## 📞 SUPORTE

Se tiver dúvidas:
1. Leia este arquivo com atenção
2. Verifique o arquivo `SQL_COMPLETO_ATUALIZADO.sql`
3. Teste a consulta virtual no navegador
4. Verifique os logs do Supabase em caso de erro

---

## 🌟 BORA LÁ!

Seu app está COMPLETO e RECHEADO de produtos! 🎊

Execute o SQL, teste tudo e aproveite! 🚀

---

**Desenvolvido com ❤️ para Raízes da Saúde**
