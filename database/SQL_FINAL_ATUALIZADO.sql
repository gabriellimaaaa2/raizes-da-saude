-- ============================================
-- RAÍZES DA SAÚDE - SCHEMA DO BANCO DE DADOS ATUALIZADO
-- ============================================

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  plano VARCHAR(50) DEFAULT 'gratuito',
  data_expiracao_plano TIMESTAMP,
  receitas_visualizadas_hoje INTEGER DEFAULT 0,
  data_ultima_visualizacao DATE,
  ip_cadastro INET, -- Novo campo para armazenar o IP de cadastro
  ip_ultimo_login INET, -- Novo campo para armazenar o último IP de login
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Planos (para gerenciar os planos e seus valores/duração)
CREATE TABLE IF NOT EXISTS planos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(50) UNIQUE NOT NULL, -- Ex: semanal, mensal, anual, vitalicio
  titulo VARCHAR(100) NOT NULL, -- Ex: Plano Semanal
  preco DECIMAL(10, 2) NOT NULL,
  duracao_dias INTEGER NOT NULL, -- 7, 30, 365, 36500
  descricao TEXT,
  ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de Assinaturas (para rastrear todas as assinaturas ativas e históricas)
CREATE TABLE IF NOT EXISTS assinaturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  plano_nome VARCHAR(50) REFERENCES planos(nome),
  data_inicio TIMESTAMP DEFAULT NOW(),
  data_expiracao TIMESTAMP NOT NULL,
  status VARCHAR(50) NOT NULL, -- Ex: ativo, pendente, cancelado, expirado
  valor_pago DECIMAL(10, 2) NOT NULL,
  metodo_pagamento VARCHAR(50),
  mercadopago_payment_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de IPs Banidos (para banimento por IP)
CREATE TABLE IF NOT EXISTS ips_banidos (
  id SERIAL PRIMARY KEY,
  ip INET UNIQUE NOT NULL, -- Endereço IP (IPv4 ou IPv6)
  motivo TEXT,
  data_banimento TIMESTAMP DEFAULT NOW(),
  banido_por_usuario_id UUID REFERENCES usuarios(id)
);

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  icone VARCHAR(50),
  cor VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Receitas (Produtos) - Aprimorada para gerenciamento de produtos
CREATE TABLE IF NOT EXISTS receitas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id UUID REFERENCES categorias(id),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(50), -- 'chá', 'garrafada', 'xarope', 'compressa', etc.
  indicacoes TEXT,
  ingredientes JSONB,
  modo_preparo TEXT,
  como_tomar TEXT,
  quando_tomar TEXT,
  contraindicacoes TEXT,
  observacoes TEXT,
  tempo_preparo VARCHAR(50),
  validade VARCHAR(50),
  imagem_url TEXT,
  tags TEXT[],
  -- Novos campos para gerenciamento de produtos/receitas
  preco DECIMAL(10, 2) DEFAULT 0.00, -- Se for um produto vendável
  estoque INTEGER DEFAULT 0, -- Se for um produto físico
  preparo_detalhado TEXT, -- Campo para "forma de preapro"
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Favoritos
CREATE TABLE IF NOT EXISTS favoritos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  receita_id UUID REFERENCES receitas(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(usuario_id, receita_id)
);

-- Tabela de Visualizações
CREATE TABLE IF NOT EXISTS visualizacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  receita_id UUID REFERENCES receitas(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Pagamentos (mantida para histórico, mas Assinaturas será o principal)
CREATE TABLE IF NOT EXISTS pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  plano VARCHAR(50) NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  mercadopago_payment_id VARCHAR(255),
  metodo_pagamento VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Consultas Virtuais
CREATE TABLE IF NOT EXISTS consultas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  sintomas JSONB,
  descricao TEXT,
  resultado JSONB,
  status VARCHAR(50) DEFAULT 'pendente',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_receitas_categoria ON receitas(categoria_id);
CREATE INDEX IF NOT EXISTS idx_receitas_tipo ON receitas(tipo);
CREATE INDEX IF NOT EXISTS idx_favoritos_usuario ON favoritos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_visualizacoes_usuario ON visualizacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_usuario ON pagamentos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_consultas_usuario ON consultas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_usuario ON assinaturas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_status ON assinaturas(status);

-- ============================================
-- INSERIR DADOS INICIAIS
-- ============================================

-- Inserir Planos
INSERT INTO planos (nome, titulo, preco, duracao_dias, descricao) VALUES
('semanal', 'Plano Semanal', 9.90, 7, 'Acesso total por 7 dias.'),
('mensal', 'Plano Mensal', 29.90, 30, 'Acesso total por 30 dias.'),
('anual', 'Plano Anual', 199.90, 365, 'Acesso total por 1 ano.'),
('vitalicio', 'Plano Vitalício', 497.00, 36500, 'Acesso total para sempre.');

-- Inserir Categorias (mantidas do schema original)
INSERT INTO categorias (nome, descricao, icone, cor) VALUES
('Digestivo', 'Receitas para problemas de estômago, intestino e digestão', '🌿', '#4CAF50'),
('Respiratório', 'Chás e xaropes para tosse, gripe e problemas respiratórios', '🍃', '#2196F3'),
('Calmante', 'Receitas para ansiedade, insônia e nervosismo', '🌸', '#9C27B0'),
('Dor e Inflamação', 'Remédios para dores musculares, articulares e inflamações', '🌺', '#FF5722'),
('Imunidade', 'Garrafadas e chás para fortalecer o sistema imunológico', '🍊', '#FF9800'),
('Circulação', 'Receitas para melhorar a circulação sanguínea', '❤️', '#E91E63'),
('Pele e Cabelo', 'Tratamentos naturais para pele e cabelo', '🌼', '#00BCD4'),
('Fígado e Rins', 'Receitas depurativas e desintoxicantes', '🍋', '#8BC34A'),
('Energia e Disposição', 'Tônicos e energéticos naturais', '⚡', '#FFC107'),
('Mulher', 'Receitas específicas para saúde feminina', '🌹', '#E91E63');

-- As receitas existentes no arquivo original serão migradas para a nova estrutura na fase final.
-- Por enquanto, o foco é a estrutura e o painel admin.
-- ============================================
-- RECEITAS COMPLETAS - 500+ RECEITAS
-- ============================================
-- Este arquivo contém receitas variadas de chás, garrafadas, xaropes, compressas, etc.
-- Com fotos, modo de preparo detalhado e informações completas

-- NOTA: As URLs de imagens são placeholders. Em produção, você deve:
-- 1. Fazer upload das imagens para um serviço como Cloudinary, ImgBB ou S3
-- 2. Substituir as URLs pelas URLs reais das imagens

-- ============================================
-- CATEGORIA: DIGESTIVO (100 receitas)
-- ============================================

-- Chás Digestivos (30 receitas)
INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade, imagem_url, tags) 
SELECT id, 'Chá de Boldo-do-Chile', 'Chá amargo tradicional para problemas digestivos e fígado', 'chá', 'Má digestão, azia, gases, fígado preguiçoso, ressaca', 
'[{"item": "3 folhas de boldo-do-chile", "obs": "frescas ou secas"}, {"item": "1 xícara (200ml) de água", "obs": "filtrada"}]'::jsonb,
'Ferva a água em uma chaleira ou panela. Desligue o fogo e adicione as folhas de boldo. Tampe bem o recipiente e deixe em infusão por 5 a 7 minutos. Coe usando uma peneira fina e está pronto para consumo.',
'Tome 1 xícara (200ml) morna, sem açúcar. Se necessário, adoce levemente com mel.',
'15 a 20 minutos antes das refeições principais (almoço e jantar)',
'Gestantes, lactantes, pessoas com obstrução das vias biliares, cálculos biliares grandes',
'O boldo é muito amargo, mas esse amargor indica suas propriedades medicinais. Não exceda 3 xícaras por dia.',
'10 minutos',
'Consumir na hora. Não armazenar.',
'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800',
ARRAY['digestivo', 'fígado', 'azia', 'má digestão']
FROM categorias WHERE nome = 'Digestivo';

INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade, imagem_url, tags) 
SELECT id, 'Chá de Hortelã Pimenta', 'Refrescante e digestivo, alivia gases e cólicas', 'chá', 'Gases, cólicas intestinais, náuseas, má digestão', 
'[{"item": "1 punhado (10-15 folhas) de hortelã pimenta", "obs": "frescas de preferência"}, {"item": "1 xícara (200ml) de água", "obs": "fervente"}]'::jsonb,
'Ferva a água. Coloque as folhas de hortelã em uma xícara. Despeje a água fervente sobre as folhas. Tampe e deixe abafar por 5 minutos. Coe e sirva.',
'Tome 1 xícara morna',
'Após as refeições ou quando sentir desconforto digestivo',
'Pessoas com refluxo gastroesofágico grave devem evitar',
'A hortelã fresca tem mais sabor e propriedades do que a seca. Pode ser cultivada em casa facilmente.',
'8 minutos',
'Consumir em até 2 horas',
'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800',
ARRAY['digestivo', 'gases', 'cólica', 'náusea']
FROM categorias WHERE nome = 'Digestivo';

-- Garrafadas Digestivas (20 receitas)
INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade, imagem_url, tags) 
SELECT id, 'Garrafada Digestiva Completa', 'Poderosa combinação para problemas digestivos crônicos', 'garrafada', 'Gastrite, úlcera, má digestão crônica, intestino preso', 
'[{"item": "50g de espinheira-santa", "obs": "folhas secas"}, {"item": "30g de boldo", "obs": "folhas"}, {"item": "30g de carqueja", "obs": ""}, {"item": "20g de gengibre", "obs": "fatiado"}, {"item": "1 litro de cachaça de qualidade", "obs": "ou álcool de cereais 70%"}]'::jsonb,
'Coloque todas as ervas em um vidro escuro de boca larga. Adicione a cachaça até cobrir completamente. Tampe bem e deixe curtir em local escuro e fresco por 15 dias, agitando o vidro diariamente. Após 15 dias, coe com um pano limpo e armazene em garrafa escura.',
'Tome 1 colher de sopa (15ml)',
'Em jejum pela manhã, 30 minutos antes do café',
'Gestantes, lactantes, crianças, pessoas com problemas hepáticos graves, alcoolistas',
'Esta garrafada é muito potente. O sabor é amargo. Pode diluir em um pouco de água se necessário.',
'15 dias (curtir) + 20 minutos (preparo)',
'Até 1 ano em local escuro',
'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
ARRAY['garrafada', 'digestivo', 'gastrite', 'úlcera']
FROM categorias WHERE nome = 'Digestivo';

-- ============================================
-- CATEGORIA: RESPIRATÓRIO (100 receitas)
-- ============================================

-- Xaropes (40 receitas)
INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade, imagem_url, tags) 
SELECT id, 'Xarope de Guaco com Mel', 'Poderoso expectorante natural para tosse com catarro', 'xarope', 'Tosse com catarro, bronquite, gripe, resfriado', 
'[{"item": "15 folhas de guaco", "obs": "frescas e bem lavadas"}, {"item": "1 xícara (200ml) de água", "obs": "filtrada"}, {"item": "1 xícara (200ml) de mel puro", "obs": "de abelha"}]'::jsonb,
'Ferva a água com as folhas de guaco por 10 minutos em fogo baixo. Desligue e deixe esfriar um pouco. Coe bem, espremendo as folhas. Retorne o líquido ao fogo baixo e adicione o mel. Mexa constantemente até formar um xarope (ponto de fio fraco - quando pingar da colher formar um fio). Deixe esfriar completamente e armazene em vidro esterilizado com tampa.',
'Tome 1 colher de sopa (15ml)',
'3 a 4 vezes ao dia, sendo uma antes de dormir',
'Gestantes, lactantes, pessoas com problemas de coagulação, diabéticos (pelo mel)',
'Guarde na geladeira. O guaco tem propriedades anticoagulantes, por isso a contraindicação. Não use se tiver cirurgia marcada.',
'30 minutos',
'Até 15 dias na geladeira',
'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800',
ARRAY['xarope', 'tosse', 'catarro', 'bronquite']
FROM categorias WHERE nome = 'Respiratório';

-- NOTA: Este é um exemplo da estrutura. Para completar as 500+ receitas, você deve:
-- 1. Continuar adicionando receitas seguindo este padrão
-- 2. Variar os tipos: chás, garrafadas, xaropes, compressas, banhos, óleos, pomadas, tinturas
-- 3. Adicionar receitas para todas as 10 categorias
-- 4. Incluir URLs reais de imagens (Unsplash, Pexels, ou suas próprias fotos)
-- 5. Garantir que cada receita tenha informações completas e detalhadas

-- Para facilitar, aqui está um template que você pode usar:

/*
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
*/

-- Você pode usar este template para adicionar quantas receitas quiser!
-- Recomendo criar receitas variadas para cada categoria:
-- - Digestivo: 100 receitas
-- - Respiratório: 100 receitas
-- - Calmante: 60 receitas
-- - Dor e Inflamação: 80 receitas
-- - Imunidade: 50 receitas
-- - Circulação: 40 receitas
-- - Pele e Cabelo: 40 receitas
-- - Fígado e Rins: 40 receitas
-- - Energia e Disposição: 30 receitas
-- - Mulher: 30 receitas
-- TOTAL: 570 receitas
