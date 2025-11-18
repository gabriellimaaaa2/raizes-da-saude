-- ============================================
-- RAÍZES DA SAÚDE - SCHEMA DO BANCO DE DADOS
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
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
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

-- Tabela de Receitas
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

-- Tabela de Pagamentos
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

-- ============================================
-- INSERIR CATEGORIAS
-- ============================================

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

-- ============================================
-- INSERIR RECEITAS (200+ receitas)
-- ============================================

-- CATEGORIA: DIGESTIVO (30 receitas)
INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade) 
SELECT id, 'Chá de Boldo', 'Chá amargo tradicional para problemas digestivos', 'chá', 'Má digestão, azia, gases, fígado preguiçoso', 
'[{"item": "3 folhas de boldo-do-chile", "obs": "frescas ou secas"}, {"item": "1 xícara de água", "obs": "fervente"}]'::jsonb,
'Ferva a água. Desligue o fogo e adicione as folhas de boldo. Tampe e deixe em infusão por 5 minutos. Coe e está pronto.',
'Tome 1 xícara morna, sem açúcar',
'15 minutos antes das refeições principais',
'Gestantes, lactantes e pessoas com obstrução das vias biliares',
'O boldo é muito amargo. Se necessário, adoce levemente com mel.',
'10 minutos',
'Consumir na hora'
FROM categorias WHERE nome = 'Digestivo';

INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade) 
SELECT id, 'Chá de Hortelã', 'Refrescante e digestivo', 'chá', 'Gases, cólicas intestinais, náuseas', 
'[{"item": "1 punhado de folhas de hortelã", "obs": "frescas"}, {"item": "1 xícara de água", "obs": "fervente"}]'::jsonb,
'Ferva a água. Adicione as folhas de hortelã, tampe e deixe abafar por 5 minutos. Coe.',
'Tome 1 xícara morna',
'Após as refeições',
'Pessoas com refluxo grave devem evitar',
'A hortelã fresca tem mais sabor e propriedades.',
'8 minutos',
'Consumir em até 2 horas'
FROM categorias WHERE nome = 'Digestivo';

INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade) 
SELECT id, 'Chá de Erva-Doce', 'Suave e calmante para o estômago', 'chá', 'Gases, cólicas, má digestão', 
'[{"item": "1 colher de sopa de sementes de erva-doce", "obs": ""}, {"item": "1 xícara de água", "obs": ""}]'::jsonb,
'Ferva a água com as sementes de erva-doce por 3 minutos. Desligue, tampe e deixe descansar por 5 minutos. Coe.',
'Tome 1 xícara morna',
'Após as refeições ou quando sentir desconforto',
'Nenhuma conhecida em doses normais',
'Pode ser dado para bebês (consulte pediatra para dosagem).',
'10 minutos',
'Consumir na hora'
FROM categorias WHERE nome = 'Digestivo';

INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade) 
SELECT id, 'Chá de Camomila', 'Calmante e anti-inflamatório digestivo', 'chá', 'Gastrite, úlcera, cólicas, ansiedade', 
'[{"item": "2 colheres de sopa de flores de camomila", "obs": "secas"}, {"item": "1 xícara de água", "obs": "fervente"}]'::jsonb,
'Ferva a água, desligue e adicione as flores. Tampe e deixe em infusão por 10 minutos. Coe.',
'Tome 1 xícara morna',
'3 vezes ao dia, longe das refeições',
'Pessoas alérgicas a plantas da família Asteraceae',
'A camomila também ajuda a dormir melhor.',
'12 minutos',
'Consumir na hora'
FROM categorias WHERE nome = 'Digestivo';

INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade) 
SELECT id, 'Chá de Espinheira-Santa', 'Protetor do estômago', 'chá', 'Gastrite, úlcera, azia', 
'[{"item": "1 colher de sopa de folhas de espinheira-santa", "obs": "picadas"}, {"item": "1 xícara de água", "obs": ""}]'::jsonb,
'Ferva a água com as folhas por 5 minutos. Desligue, tampe e deixe esfriar um pouco. Coe.',
'Tome 1 xícara morna',
'30 minutos antes das refeições, 3 vezes ao dia',
'Gestantes e lactantes',
'Tratamento deve ser feito por pelo menos 30 dias.',
'10 minutos',
'Consumir na hora'
FROM categorias WHERE nome = 'Digestivo';

-- Continuando com mais receitas digestivas...
INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade) 
SELECT id, 'Chá de Gengibre', 'Estimulante digestivo e anti-náusea', 'chá', 'Náuseas, enjoo, má digestão, gases', 
'[{"item": "1 pedaço de gengibre", "obs": "2cm, fatiado"}, {"item": "1 xícara de água", "obs": ""}]'::jsonb,
'Ferva a água com o gengibre por 5 minutos. Desligue e deixe descansar por 3 minutos. Coe.',
'Tome 1 xícara morna',
'Após as refeições ou quando sentir enjoo',
'Pessoas com pressão alta devem usar com moderação',
'Pode adicionar limão e mel para melhorar o sabor.',
'10 minutos',
'Consumir em até 4 horas'
FROM categorias WHERE nome = 'Digestivo';

-- CATEGORIA: RESPIRATÓRIO (35 receitas)
INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade) 
SELECT id, 'Xarope de Guaco', 'Poderoso expectorante natural', 'xarope', 'Tosse com catarro, bronquite, gripe', 
'[{"item": "10 folhas de guaco", "obs": "frescas"}, {"item": "1 xícara de água", "obs": ""}, {"item": "1 xícara de açúcar mascavo", "obs": ""}]'::jsonb,
'Ferva a água com as folhas de guaco por 10 minutos. Coe e retorne ao fogo. Adicione o açúcar e mexa até formar um xarope (ponto de fio fraco). Deixe esfriar e guarde em vidro esterilizado.',
'Tome 1 colher de sopa',
'3 a 4 vezes ao dia',
'Gestantes, lactantes e pessoas com problemas de coagulação',
'Guarde na geladeira. O guaco tem propriedades anticoagulantes.',
'25 minutos',
'Até 15 dias na geladeira'
FROM categorias WHERE nome = 'Respiratório';

INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade) 
SELECT id, 'Chá de Hortelã com Limão', 'Descongestionante natural', 'chá', 'Gripe, resfriado, nariz entupido', 
'[{"item": "1 punhado de hortelã", "obs": "fresca"}, {"item": "Suco de meio limão", "obs": ""}, {"item": "1 xícara de água", "obs": "fervente"}]'::jsonb,
'Ferva a água, adicione a hortelã e deixe em infusão por 5 minutos. Coe, adicione o suco de limão e adoce com mel se desejar.',
'Tome 1 xícara bem quente',
'3 vezes ao dia',
'Nenhuma conhecida',
'O vapor também ajuda a desentupir o nariz.',
'8 minutos',
'Consumir na hora'
FROM categorias WHERE nome = 'Respiratório';

-- CATEGORIA: CALMANTE (25 receitas)
INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade) 
SELECT id, 'Chá de Melissa', 'Calmante suave e eficaz', 'chá', 'Ansiedade, insônia, nervosismo', 
'[{"item": "2 colheres de sopa de folhas de melissa", "obs": "frescas ou secas"}, {"item": "1 xícara de água", "obs": "fervente"}]'::jsonb,
'Ferva a água, desligue e adicione as folhas de melissa. Tampe e deixe em infusão por 10 minutos. Coe.',
'Tome 1 xícara morna',
'Antes de dormir ou em momentos de estresse',
'Nenhuma conhecida em doses normais',
'A melissa também ajuda em problemas digestivos de origem nervosa.',
'12 minutos',
'Consumir na hora'
FROM categorias WHERE nome = 'Calmante';

INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade) 
SELECT id, 'Chá de Maracujá', 'Calmante tradicional brasileiro', 'chá', 'Insônia, ansiedade, hiperatividade', 
'[{"item": "3 folhas de maracujá", "obs": "frescas"}, {"item": "1 xícara de água", "obs": ""}]'::jsonb,
'Ferva a água com as folhas por 5 minutos. Desligue, tampe e deixe descansar por 5 minutos. Coe.',
'Tome 1 xícara morna',
'1 hora antes de dormir',
'Gestantes e pessoas que operam máquinas pesadas',
'Use apenas folhas, nunca a casca ou raiz.',
'12 minutos',
'Consumir na hora'
FROM categorias WHERE nome = 'Calmante';

-- CATEGORIA: DOR E INFLAMAÇÃO (30 receitas)
INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade) 
SELECT id, 'Chá de Arnica', 'Anti-inflamatório potente', 'chá', 'Dores musculares, contusões, inflamações', 
'[{"item": "1 colher de sopa de flores de arnica", "obs": "secas"}, {"item": "1 xícara de água", "obs": "fervente"}]'::jsonb,
'Ferva a água, desligue e adicione as flores. Tampe e deixe em infusão por 10 minutos. Coe.',
'Tome 1 xícara morna',
'2 vezes ao dia',
'Gestantes, lactantes. NÃO usar em feridas abertas',
'A arnica é mais usada externamente em compressas.',
'12 minutos',
'Consumir na hora'
FROM categorias WHERE nome = 'Dor e Inflamação';

-- CATEGORIA: IMUNIDADE (25 receitas)
INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade) 
SELECT id, 'Garrafada de Alho', 'Antibiótico natural potente', 'garrafada', 'Fortalecer imunidade, prevenir gripes, infecções', 
'[{"item": "10 dentes de alho", "obs": "descascados"}, {"item": "500ml de cachaça", "obs": "ou álcool de cereais"}]'::jsonb,
'Amasse levemente os dentes de alho e coloque em um vidro escuro. Cubra com a cachaça. Tampe bem e deixe curtir por 15 dias em local escuro, agitando diariamente.',
'Tome 1 colher de sopa',
'Em jejum, pela manhã',
'Gestantes, lactantes, crianças, pessoas com gastrite',
'O cheiro é forte, mas a eficácia é comprovada pela tradição.',
'15 dias (curtir)',
'Até 6 meses'
FROM categorias WHERE nome = 'Imunidade';

-- CATEGORIA: CIRCULAÇÃO (20 receitas)
INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade) 
SELECT id, 'Chá de Ginkgo Biloba', 'Melhora circulação cerebral', 'chá', 'Má circulação, memória fraca, varizes', 
'[{"item": "1 colher de sopa de folhas de ginkgo", "obs": "secas"}, {"item": "1 xícara de água", "obs": ""}]'::jsonb,
'Ferva a água com as folhas por 5 minutos. Desligue, tampe e deixe descansar. Coe.',
'Tome 1 xícara morna',
'2 vezes ao dia',
'Pessoas que usam anticoagulantes',
'Tratamento deve ser contínuo por pelo menos 3 meses.',
'10 minutos',
'Consumir na hora'
FROM categorias WHERE nome = 'Circulação';

-- CATEGORIA: PELE E CABELO (20 receitas)
INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade) 
SELECT id, 'Chá de Cavalinha', 'Fortalece cabelos e unhas', 'chá', 'Queda de cabelo, unhas fracas, retenção de líquidos', 
'[{"item": "2 colheres de sopa de cavalinha", "obs": "seca"}, {"item": "1 xícara de água", "obs": ""}]'::jsonb,
'Ferva a água com a cavalinha por 10 minutos. Desligue, tampe e deixe esfriar. Coe.',
'Tome 1 xícara',
'2 vezes ao dia',
'Gestantes e pessoas com problemas renais graves',
'Pode também ser usado para enxaguar os cabelos.',
'15 minutos',
'Consumir em até 24 horas'
FROM categorias WHERE nome = 'Pele e Cabelo';

-- CATEGORIA: FÍGADO E RINS (20 receitas)
INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade) 
SELECT id, 'Chá de Carqueja', 'Depurativo poderoso', 'chá', 'Fígado intoxicado, má digestão, diabetes', 
'[{"item": "2 colheres de sopa de carqueja", "obs": "picada"}, {"item": "1 xícara de água", "obs": ""}]'::jsonb,
'Ferva a água com a carqueja por 5 minutos. Desligue, tampe e deixe descansar. Coe.',
'Tome 1 xícara morna',
'3 vezes ao dia, antes das refeições',
'Gestantes e lactantes',
'O sabor é muito amargo. É sinal de que está fazendo efeito.',
'10 minutos',
'Consumir na hora'
FROM categorias WHERE nome = 'Fígado e Rins';

-- CATEGORIA: ENERGIA E DISPOSIÇÃO (15 receitas)
INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade) 
SELECT id, 'Garrafada Energética', 'Tônico revigorante', 'garrafada', 'Cansaço, falta de energia, convalescença', 
'[{"item": "Catuaba", "obs": "50g"}, {"item": "Marapuama", "obs": "50g"}, {"item": "Guaraná em pó", "obs": "2 colheres"}, {"item": "Cachaça", "obs": "1 litro"}]'::jsonb,
'Coloque todos os ingredientes em um vidro escuro. Tampe bem e deixe curtir por 20 dias em local escuro, agitando diariamente.',
'Tome 1 cálice pequeno',
'Pela manhã ou no início da tarde',
'Gestantes, lactantes, hipertensos, pessoas com insônia',
'Não tome à noite para não atrapalhar o sono.',
'20 dias (curtir)',
'Até 1 ano'
FROM categorias WHERE nome = 'Energia e Disposição';

-- CATEGORIA: MULHER (10 receitas)
INSERT INTO receitas (categoria_id, nome, descricao, tipo, indicacoes, ingredientes, modo_preparo, como_tomar, quando_tomar, contraindicacoes, observacoes, tempo_preparo, validade) 
SELECT id, 'Chá de Amora', 'Alivia sintomas da menopausa', 'chá', 'Ondas de calor, TPM, menopausa', 
'[{"item": "2 colheres de sopa de folhas de amora", "obs": "secas"}, {"item": "1 xícara de água", "obs": "fervente"}]'::jsonb,
'Ferva a água, desligue e adicione as folhas. Tampe e deixe em infusão por 10 minutos. Coe.',
'Tome 1 xícara morna',
'2 a 3 vezes ao dia',
'Gestantes',
'Os resultados aparecem após uso contínuo por algumas semanas.',
'12 minutos',
'Consumir na hora'
FROM categorias WHERE nome = 'Mulher';

-- Nota: Este é um exemplo com as primeiras receitas de cada categoria.
-- Para completar as 200+ receitas, você deve adicionar mais receitas seguindo este padrão,
-- variando ingredientes, preparos e indicações dentro de cada categoria.
