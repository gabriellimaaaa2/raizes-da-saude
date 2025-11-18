import express from 'express';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Middleware de autenticação admin
const authenticateAdmin = (req, res, next) => {
  const { username, password } = req.body; // Para a rota de login
  const adminToken = req.headers['x-admin-token']; // Para as rotas protegidas

  // Credenciais seguras (devem ser armazenadas em variáveis de ambiente em produção)
  const SECURE_USERNAME = 'lima05121968';
  const SECURE_PASSWORD = '@Ga05121968';
  const SECRET_TOKEN = process.env.ADMIN_SECRET_TOKEN || 'super-secreto-token-admin-raizes'; // Token para rotas protegidas

  // 1. Rota de Login (sem token)
  if (req.path === '/login' && req.method === 'POST') {
    if (username === SECURE_USERNAME && password === SECURE_PASSWORD) {
      // Retorna um token simples para ser usado nas requisições subsequentes
      req.adminToken = SECRET_TOKEN;
      return next();
    }
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // 2. Rotas Protegidas (com token)
  if (adminToken === SECRET_TOKEN) {
    return next();
  }

  return res.status(403).json({ error: 'Acesso negado. Token inválido ou ausente.' });
};

// Rota de Login Admin
router.post('/login', authenticateAdmin, (req, res) => {
  res.json({ token: req.adminToken, message: 'Login bem-sucedido' });
});

// ============ ROTAS DE CATEGORIAS ============

// Listar todas as categorias
router.get('/categorias', authenticateAdmin, async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('categorias')
      .select('*')
      .order('nome');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

// Criar categoria
router.post('/categorias', authenticateAdmin, async (req, res) => {
  try {
    const { nome, descricao, icone, cor } = req.body;

    const { data, error } = await req.supabase
      .from('categorias')
      .insert([{ nome, descricao, icone, cor }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ error: 'Erro ao criar categoria' });
  }
});

// Atualizar categoria
router.put('/categorias/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, icone, cor } = req.body;

    const { data, error } = await req.supabase
      .from('categorias')
      .update({ nome, descricao, icone, cor })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
});

// Deletar categoria
router.delete('/categorias/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await req.supabase
      .from('categorias')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Categoria deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({ error: 'Erro ao deletar categoria' });
  }
});

// ============ ROTAS DE RECEITAS ============

// Listar todas as receitas (com paginação)
router.get('/receitas', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, categoria, busca } = req.query;
    const offset = (page - 1) * limit;

    let query = req.supabase
      .from('receitas')
      .select('*, categorias(nome, icone, cor)', { count: 'exact' });

    if (categoria) {
      query = query.eq('categoria_id', categoria);
    }

    if (busca) {
      query = query.or(`nome.ilike.%${busca}%,descricao.ilike.%${busca}%`);
    }

    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      receitas: data,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    res.status(500).json({ error: 'Erro ao buscar receitas' });
  }
});

// Buscar receita por ID
router.get('/receitas/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await req.supabase
      .from('receitas')
      .select('*, categorias(nome)')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar receita:', error);
    res.status(500).json({ error: 'Erro ao buscar receita' });
  }
});
router.post('/receitas', authenticateAdmin, async (req, res) => {
  try {
    const {
      categoria_id,
      nome,
      descricao,
      tipo,
      indicacoes,
      ingredientes,
      modo_preparo,
      como_tomar,
      quando_tomar,
      contraindicacoes,
      observacoes,
      tempo_preparo,
      validade,
      imagem_url,
      tags
    } = req.body;

    const { data, error } = await req.supabase
      .from('receitas')
      .insert([{
        categoria_id,
        nome,
        descricao,
        tipo,
        indicacoes,
        ingredientes,
        modo_preparo,
        como_tomar,
        quando_tomar,
        contraindicacoes,
        observacoes,
        tempo_preparo,
        validade,
        imagem_url,
        tags
      }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Erro ao criar receita:', error);
    res.status(500).json({ error: 'Erro ao criar receita' });
  }
});

// Atualizar receita
router.put('/receitas/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      categoria_id,
      nome,
      descricao,
      tipo,
      indicacoes,
      ingredientes,
      modo_preparo,
      como_tomar,
      quando_tomar,
      contraindicacoes,
      observacoes,
      tempo_preparo,
      validade,
      imagem_url,
      tags,
      preco, // Novo
      estoque, // Novo
      preparo_detalhado // Novo
    } = req.body;

    const { data, error } = await req.supabase
      .from('receitas')
      .update({
        categoria_id,
        nome,
        descricao,
        tipo,
        indicacoes,
        ingredientes,
        modo_preparo,
        como_tomar,
        quando_tomar,
        contraindicacoes,
        observacoes,
        tempo_preparo,
        validade,
        imagem_url,
        tags,
        preco, // Novo
        estoque, // Novo
        preparo_detalhado // Novo
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Erro ao atualizar receita:', error);
    res.status(500).json({ error: 'Erro ao atualizar receita' });
  }
});

// Deletar receita
router.put('/receitas/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      categoria_id,
      nome,
      descricao,
      tipo,
      indicacoes,
      ingredientes,
      modo_preparo,
      como_tomar,
      quando_tomar,
      contraindicacoes,
      observacoes,
      tempo_preparo,
      validade,
      imagem_url,
      tags
    } = req.body;

    const { data, error } = await req.supabase
      .from('receitas')
      .update({
        categoria_id,
        nome,
        descricao,
        tipo,
        indicacoes,
        ingredientes,
        modo_preparo,
        como_tomar,
        quando_tomar,
        contraindicacoes,
        observacoes,
        tempo_preparo,
        validade,
        imagem_url,
        tags
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Erro ao atualizar receita:', error);
    res.status(500).json({ error: 'Erro ao atualizar receita' });
  }
});

// Deletar receita
router.delete('/receitas/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await req.supabase
      .from('receitas')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Receita deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar receita:', error);
    res.status(500).json({ error: 'Erro ao deletar receita' });
  }
});

// ============ ROTAS DE USUÁRIOS ============

// Listar todos os usuários
router.get('/usuarios', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, busca } = req.query;
    const offset = (page - 1) * limit;

    let query = req.supabase
      .from('usuarios').select('id, nome, email, telefone, plano, data_expiracao_plano, created_at, ip_cadastro, ip_ultimo_login', { count: 'exact' });

    if (busca) {
      query = query.or(`nome.ilike.%${busca}%,email.ilike.%${busca}%`);
    }

    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      usuarios: data,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Buscar usuário por ID
router.get('/usuarios/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await req.supabase
      .from('usuarios')
     .select('id, nome, email, telefone, plano, data_expiracao_plano, receitas_visualizadas_hoje, data_ultima_visualizacao, ip_cadastro, ip_ultimo_login, created_at')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// Atualizar usuário
router.put('/usuarios/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, plano, data_expiracao_plano } = req.body;

    const updateData = {};
    if (nome) updateData.nome = nome;
    if (email) updateData.email = email;
    if (telefone !== undefined) updateData.telefone = telefone;
    if (plano) updateData.plano = plano;
    if (data_expiracao_plano !== undefined) updateData.data_expiracao_plano = data_expiracao_plano;

    const { data, error } = await req.supabase
      .from('usuarios')
      .update(updateData)
      .eq('id', id)
      .select('id, nome, email, telefone, plano, data_expiracao_plano')
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Banir usuário/IP
router.put('/usuarios/:id/banir', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { ip, tipo } = req.body; // tipo: 'internet' ou 'celular'
    
    if (!ip) {
      return res.status(400).json({ error: 'IP é obrigatório' });
    }

    // 1. Banir o IP
    const { error: banError } = await req.supabase
      .from('ips_banidos')
      .insert([{ ip, motivo: `Banido via Admin - ${tipo}` }]);

    if (banError && banError.code !== '23505') { // 23505 é erro de chave duplicada (IP já banido)
      throw banError;
    }

    // 2. Opcionalmente, desativar o plano do usuário
    await req.supabase
      .from('usuarios')
      .update({ plano: 'banido', data_expiracao_plano: new Date().toISOString() })
      .eq('id', id);

    res.json({ message: `Usuário e IP (${ip}) banidos com sucesso` });
  } catch (error) {
    console.error('Erro ao banir usuário/IP:', error);
    res.status(500).json({ error: 'Erro ao banir usuário/IP' });
  }
});

// Dar plano manualmente
router.put('/usuarios/:id/dar-plano', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { plano, duracao_dias } = req.body;

    if (!plano || !duracao_dias) {
      return res.status(400).json({ error: 'Plano e duração são obrigatórios' });
    }

    // Função para calcular a data de expiração
    const calcularDataExpiracao = (dias) => {
      const dataAtual = new Date();
      const dataExpiracao = new Date(dataAtual);
      dataExpiracao.setDate(dataExpiracao.getDate() + dias);
      return dataExpiracao.toISOString();
    };

    const dataExpiracao = calcularDataExpiracao(duracao_dias);

    // 1. Atualizar o plano do usuário
    const { data: userUpdate, error: userError } = await req.supabase
      .from('usuarios')
      .update({
        plano: plano.toLowerCase(),
        data_expiracao_plano: dataExpiracao
      })
      .eq('id', id)
      .select('id, nome, email, plano, data_expiracao_plano')
      .single();

    if (userError) throw userError;

    // 2. Registrar a assinatura (simulando uma ativação manual)
    const { data: planoInfo } = await req.supabase
      .from('planos')
      .select('preco')
      .eq('nome', plano.toLowerCase())
      .single();

    await req.supabase
      .from('assinaturas')
      .insert([{
        usuario_id: id,
        plano_nome: plano.toLowerCase(),
        data_inicio: new Date().toISOString(),
        data_expiracao: dataExpiracao,
        status: 'ativo',
        valor_pago: planoInfo?.preco || 0.00, // Usar o preço do plano ou 0 se não encontrar
        metodo_pagamento: 'manual_admin'
      }]);

    res.json({ message: 'Plano ativado com sucesso!', user: userUpdate });
  } catch (error) {
    console.error('Erro ao dar plano:', error);
    res.status(500).json({ error: 'Erro ao dar plano' });
  }
});

// Alterar senha do usuário
router.put('/usuarios/:id/senha', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { novaSenha } = req.body;

    const hashedPassword = await bcrypt.hash(novaSenha, 10);

    const { error } = await req.supabase
      .from('usuarios')
      .update({ senha: hashedPassword })
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ error: 'Erro ao alterar senha' });
  }
});

// Deletar usuário
router.delete('/usuarios/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await req.supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

// ============ ROTAS DE ESTATÍSTICAS ============

// Dashboard com estatísticas gerais
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    // Total de usuários
    const { count: totalUsuarios } = await req.supabase
      .from('usuarios')
      .select('*', { count: 'exact', head: true });

    // Total de receitas
    const { count: totalReceitas } = await req.supabase
      .from('receitas')
      .select('*', { count: 'exact', head: true });

    // Total de categorias
    const { count: totalCategorias } = await req.supabase
      .from('categorias')
      .select('*', { count: 'exact', head: true });

    // Assinaturas Ativas e Ganhos
    const { data: assinaturasAtivas, error: assinaturasError } = await req.supabase
      .from('assinaturas')
      .select('valor_pago')
      .eq('status', 'ativo')
      .gte('data_expiracao', new Date().toISOString());

    if (assinaturasError) throw assinaturasError;

    const totalAssinaturasAtivas = assinaturasAtivas.length;
    const totalGanhos = assinaturasAtivas.reduce((sum, sub) => sum + parseFloat(sub.valor_pago), 0);

    // Planos perto de vencer (próximos 7 dias)
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() + 7);

    const { data: assinaturasVencendo, error: vencendoError } = await req.supabase
      .from('assinaturas')
      .select('*, usuarios(nome, email)')
      .eq('status', 'ativo')
      .lt('data_expiracao', dataLimite.toISOString())
      .order('data_expiracao', { ascending: true });

    if (vencendoError) throw vencendoError;

    // Usuários por plano
    const { data: usuariosPorPlano } = await req.supabase
      .from('usuarios')
      .select('plano');

    const planos = usuariosPorPlano.reduce((acc, user) => {
      acc[user.plano] = (acc[user.plano] || 0) + 1;
      return acc;
    }, {});

    // Receitas por tipo
    const { data: receitasPorTipo } = await req.supabase
      .from('receitas')
      .select('tipo');

    const tipos = receitasPorTipo.reduce((acc, receita) => {
      acc[receita.tipo] = (acc[receita.tipo] || 0) + 1;
      return acc;
    }, {});

    // Últimos usuários cadastrados
    const { data: ultimosUsuarios } = await req.supabase
      .from('usuarios')
      .select('id, nome, email, plano, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    res.json({
      totalUsuarios,
      totalReceitas,
      totalCategorias,
      totalAssinaturasAtivas,
      totalGanhos: totalGanhos.toFixed(2),
      assinaturasVencendo,
      usuariosPorPlano: planos,
      receitasPorTipo: tipos,
      ultimosUsuarios
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// Dashboard com estatísticas gerais
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    // Total de usuários
    const { count: totalUsuarios } = await req.supabase
      .from('usuarios')
      .select('*', { count: 'exact', head: true });

    // Total de receitas
    const { count: totalReceitas } = await req.supabase
      .from('receitas')
      .select('*', { count: 'exact', head: true });

    // Total de categorias
    const { count: totalCategorias } = await req.supabase
      .from('categorias')
      .select('*', { count: 'exact', head: true });

    // Usuários por plano
    const { data: usuariosPorPlano } = await req.supabase
      .from('usuarios')
      .select('plano');

    const planos = usuariosPorPlano.reduce((acc, user) => {
      acc[user.plano] = (acc[user.plano] || 0) + 1;
      return acc;
    }, {});

    // Receitas por tipo
    const { data: receitasPorTipo } = await req.supabase
      .from('receitas')
      .select('tipo');

    const tipos = receitasPorTipo.reduce((acc, receita) => {
      acc[receita.tipo] = (acc[receita.tipo] || 0) + 1;
      return acc;
    }, {});

    // Últimos usuários cadastrados
    const { data: ultimosUsuarios } = await req.supabase
      .from('usuarios')
      .select('id, nome, email, plano, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    res.json({
      totalUsuarios,
      totalReceitas,
      totalCategorias,
      usuariosPorPlano: planos,
      receitasPorTipo: tipos,
      ultimosUsuarios
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

export { router as adminRouter, authenticateAdmin };