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
