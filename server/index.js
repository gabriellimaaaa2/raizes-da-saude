import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { adminRouter } from './admin-routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware para passar supabase para as rotas admin
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Mercado Pago Config
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const MP_PUBLIC_KEY = process.env.MP_PUBLIC_KEY;

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// ============ ROTAS DE AUTENTICAÇÃO ============

app.post('/api/auth/register', async (req, res) => {
  const ip_cadastro = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  try {
    const { nome, email, senha, telefone } = req.body;

    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const { data: newUser, error } = await supabase
      .from('usuarios')
      .insert([{
        nome,
        email,
        senha: hashedPassword,
        telefone,
        plano: 'gratuito',
        receitas_visualizadas_hoje: 0,
        data_ultima_visualizacao: new Date().toISOString().split('T')[0],
        ip_cadastro
      }])
      .select()
      .single();

    if (error) throw error;

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: newUser.id,
        nome: newUser.nome,
        email: newUser.email,
        plano: newUser.plano
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro ao criar conta' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const ip_ultimo_login = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  try {
    const { email, senha } = req.body;

    const { data: user, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Atualizar IP de último login
    await supabase
      .from('usuarios')
      .update({ ip_ultimo_login })
      .eq('id', user.id);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        plano: user.plano,
        data_expiracao_plano: user.data_expiracao_plano
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('usuarios')
      .select('id, nome, email, telefone, plano, data_expiracao_plano, receitas_visualizadas_hoje, data_ultima_visualizacao')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do usuário' });
  }
});

// Recuperar senha
app.post('/api/auth/recuperar-senha', async (req, res) => {
  try {
    const { email } = req.body;

    // Verificar se o email existe
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();

    if (!usuario) {
      // Por segurança, não informar que o email não existe
      return res.json({ message: 'Se o email existir, você receberá instruções para redefinir sua senha.' });
    }

    // Gerar token temporário (válido por 1 hora)
    const resetToken = jwt.sign(
      { userId: usuario.id, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Aqui você pode enviar o email com o link de redefinição
    // Por enquanto, vamos apenas retornar o token
    // Em produção, use um serviço de email como SendGrid, Mailgun, etc.

    console.log(`Link de redefinição: http://localhost:5173/redefinir-senha?token=${resetToken}`);

    res.json({ 
      message: 'Se o email existir, você receberá instruções para redefinir sua senha.',
      // REMOVER EM PRODUÇÃO - apenas para desenvolvimento
      dev_token: resetToken
    });
  } catch (error) {
    console.error('Erro ao recuperar senha:', error);
    res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
});

// Redefinir senha
app.post('/api/auth/redefinir-senha', async (req, res) => {
  try {
    const { token, novaSenha } = req.body;

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== 'password_reset') {
      return res.status(400).json({ error: 'Token inválido' });
    }

    // Hash da nova senha
    const senhaHash = await bcrypt.hash(novaSenha, 10);

    // Atualizar senha
    const { error } = await supabase
      .from('usuarios')
      .update({ senha: senhaHash })
      .eq('id', decoded.userId);

    if (error) throw error;

    res.json({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Token expirado. Solicite um novo link de redefinição.' });
    }
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({ error: 'Erro ao redefinir senha' });
  }
});

app.post('/api/auth/cancelar-plano', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('usuarios')
      .update({
        plano: 'gratuito',
        data_expiracao_plano: null
      })
      .eq('id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Plano cancelado com sucesso' });
  } catch (error) {
    console.error('Erro ao cancelar plano:', error);
    res.status(500).json({ error: 'Erro ao cancelar plano' });
  }
});

// ============ ROTAS DE RECEITAS ============

app.get('/api/categorias', async (req, res) => {
  try {
    const { data, error } = await supabase
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

app.get('/api/receitas', async (req, res) => {
  try {
    const { categoria, busca, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('receitas')
      .select('*, categorias(nome, icone, cor)', { count: 'exact' });

    if (categoria) {
      query = query.eq('categoria_id', categoria);
    }

    if (busca) {
      query = query.or(`nome.ilike.%${busca}%,descricao.ilike.%${busca}%,indicacoes.ilike.%${busca}%`);
    }

    query = query.range(offset, offset + limit - 1).order('nome');

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

app.get('/api/receitas/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: user, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (userError) throw userError;

    const temPlanoAtivo = user.plano !== 'gratuito' && 
      new Date(user.data_expiracao_plano) > new Date();

    const hoje = new Date().toISOString().split('T')[0];
    let receitasVisualizadas = user.receitas_visualizadas_hoje;

    if (user.data_ultima_visualizacao !== hoje) {
      receitasVisualizadas = 0;
    }

    if (!temPlanoAtivo && receitasVisualizadas >= 3) {
      return res.status(403).json({ 
        error: 'Limite de receitas gratuitas atingido',
        needsSubscription: true 
      });
    }

    const { data: receita, error: receitaError } = await supabase
      .from('receitas')
      .select('*, categorias(nome, icone, cor)')
      .eq('id', id)
      .single();

    if (receitaError) throw receitaError;

    if (!temPlanoAtivo) {
      await supabase
        .from('usuarios')
        .update({
          receitas_visualizadas_hoje: receitasVisualizadas + 1,
          data_ultima_visualizacao: hoje
        })
        .eq('id', req.user.id);
    }

    await supabase
      .from('visualizacoes')
      .insert([{ usuario_id: req.user.id, receita_id: id }]);

    res.json({
      receita,
      receitasRestantes: temPlanoAtivo ? null : (3 - receitasVisualizadas - 1)
    });
  } catch (error) {
    console.error('Erro ao buscar receita:', error);
    res.status(500).json({ error: 'Erro ao buscar receita' });
  }
});

// ============ ROTAS DE PAGAMENTO - MERCADO PAGO ============

// Obter Public Key
app.get('/api/pagamento/public-key', (req, res) => {
  res.json({ publicKey: MP_PUBLIC_KEY });
});

// Criar pagamento PIX
app.post('/api/pagamento/pix', authenticateToken, async (req, res) => {
  try {
    const { plano } = req.body;

    const planos = {
      semanal: { titulo: 'Plano Semanal', preco: 9.90, dias: 7 },
      mensal: { titulo: 'Plano Mensal', preco: 29.90, dias: 30 },
      anual: { titulo: 'Plano Anual', preco: 199.90, dias: 365 },
      vitalicio: { titulo: 'Plano Vitalício', preco: 497.00, dias: 36500 }
    };

    const planoSelecionado = planos[plano];
    if (!planoSelecionado) {
      return res.status(400).json({ error: 'Plano inválido' });
    }

    // Buscar dados do usuário
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('nome, email')
      .eq('id', req.user.id)
      .single();

    const idempotencyKey = uuidv4();
    
    // Data de expiração: 20 minutos
    const dataExpiracao = new Date();
    dataExpiracao.setMinutes(dataExpiracao.getMinutes() + 20);

    const paymentData = {
      transaction_amount: planoSelecionado.preco,
      description: `${planoSelecionado.titulo} - Raízes da Saúde`,
      payment_method_id: 'pix',
      payer: {
        email: usuario.email,
        first_name: usuario.nome.split(' ')[0],
        last_name: usuario.nome.split(' ').slice(1).join(' ') || 'Silva'
      },
      date_of_expiration: dataExpiracao.toISOString()
    };

    const response = await axios.post(
      'https://api.mercadopago.com/v1/payments',
      paymentData,
      {
        headers: {
          'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey
        }
      }
    );

    const pixData = response.data;

    // Salvar pagamento no banco
    await supabase
      .from('pagamentos')
      .insert([{
        usuario_id: req.user.id,
        plano,
        valor: planoSelecionado.preco,
        status: 'pending',
        mercadopago_payment_id: pixData.id.toString(),
        metodo_pagamento: 'pix'
      }]);

    res.json({
      paymentId: pixData.id,
      qrCode: pixData.point_of_interaction.transaction_data.qr_code,
      qrCodeBase64: pixData.point_of_interaction.transaction_data.qr_code_base64,
      ticketUrl: pixData.point_of_interaction.transaction_data.ticket_url
    });
  } catch (error) {
    console.error('Erro ao criar PIX:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Erro ao criar pagamento PIX',
      details: error.response?.data || error.message
    });
  }
});

// Verificar status do pagamento
app.get('/api/pagamento/verificar/:paymentId', authenticateToken, async (req, res) => {
  try {
    const { paymentId } = req.params;

    // Buscar pagamento no Mercado Pago
    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
        }
      }
    );

    const payment = response.data;

    // Buscar pagamento no banco
    const { data: pagamento } = await supabase
      .from('pagamentos')
      .select('*')
      .eq('mercadopago_payment_id', paymentId.toString())
      .single();

    if (pagamento) {
      // Atualizar status no banco
      await supabase
        .from('pagamentos')
        .update({ status: payment.status })
        .eq('mercadopago_payment_id', paymentId.toString());

      // Se aprovado, ativar plano
      if (payment.status === 'approved' && pagamento.status !== 'approved') {
        await ativarPlano(
          pagamento.usuario_id,
          pagamento.plano,
          pagamento.valor,
          pagamento.mercadopago_payment_id,
          pagamento.metodo_pagamento
        );
      }
    }

    res.json({
      status: payment.status,
      statusDetail: payment.status_detail
    });
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Erro ao verificar pagamento',
      details: error.response?.data || error.message
    });
  }
});

// Processar pagamento com cartão
app.post('/api/pagamento/cartao', authenticateToken, async (req, res) => {
  try {
    const {
      token,
      issuer_id,
      payment_method_id,
      transaction_amount,
      installments,
      description,
      payer
    } = req.body;

    const idempotencyKey = uuidv4();

    const paymentData = {
      token,
      issuer_id,
      payment_method_id,
      transaction_amount: parseFloat(transaction_amount),
      installments: parseInt(installments),
      description,
      payer
    };

    const response = await axios.post(
      'https://api.mercadopago.com/v1/payments',
      paymentData,
      {
        headers: {
          'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey
        }
      }
    );

    const paymentResult = response.data;

    // Salvar pagamento no banco
    await supabase
      .from('pagamentos')
      .insert([{
        usuario_id: req.user.id,
        plano: description.split(' ')[1].toLowerCase(),
        valor: transaction_amount,
        status: paymentResult.status,
        mercadopago_payment_id: paymentResult.id.toString(),
        metodo_pagamento: 'cartao'
      }]);

    // Se aprovado, ativar plano
    if (paymentResult.status === 'approved') {
      const planoNome = description.split(' ')[1].toLowerCase();
      await ativarPlano(
        req.user.id,
        planoNome,
        transaction_amount,
        paymentResult.id.toString(),
        'cartao'
      );
    }

    res.json({
      status: paymentResult.status,
      statusDetail: paymentResult.status_detail,
      paymentId: paymentResult.id
    });
  } catch (error) {
    console.error('Erro ao processar cartão:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Erro ao processar pagamento',
      details: error.response?.data || error.message
    });
  }
});

// Webhook Mercado Pago
app.post('/api/pagamento/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;

      // Buscar detalhes do pagamento
      const response = await axios.get(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
          }
        }
      );

      const payment = response.data;

      // Atualizar status no banco
      const { data: pagamento } = await supabase
        .from('pagamentos')
        .select('*')
        .eq('mercadopago_payment_id', paymentId.toString())
        .single();

      if (pagamento) {
        await supabase
          .from('pagamentos')
          .update({ status: payment.status })
          .eq('mercadopago_payment_id', paymentId.toString());

        // Se aprovado, ativar plano
        if (payment.status === 'approved') {
          await ativarPlano(
            pagamento.usuario_id,
            pagamento.plano,
            pagamento.valor,
            pagamento.mercadopago_payment_id,
            pagamento.metodo_pagamento
          );
        }
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).send('Error');
  }
});

// ============ ROTAS ADMINISTRATIVAS ============
app.use('/api/admin', adminRouter);

// Função auxiliar para ativar plano
async function ativarPlano(usuarioId, plano, valor, mercadopago_payment_id, metodo_pagamento) {
  const { data: planoInfo } = await supabase
    .from('planos')
    .select('duracao_dias')
    .eq('nome', plano.toLowerCase())
    .single();

  const dias = planoInfo?.duracao_dias || 30;
  const dataExpiracao = new Date();
  dataExpiracao.setDate(dataExpiracao.getDate() + dias);

  // 1. Atualizar o plano do usuário
  await supabase
    .from('usuarios')
    .update({
      plano: plano.toLowerCase(),
      data_expiracao_plano: dataExpiracao.toISOString()
    })
    .eq('id', usuarioId);

  // 2. Registrar a assinatura
  await supabase
    .from('assinaturas')
    .insert([{
      usuario_id: usuarioId,
      plano_nome: plano.toLowerCase(),
      data_inicio: new Date().toISOString(),
      data_expiracao: dataExpiracao.toISOString(),
      status: 'ativo',
      valor_pago: valor,
      metodo_pagamento: metodo_pagamento,
      mercadopago_payment_id: mercadopago_payment_id
    }]);
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🌿 Servidor Raízes da Saúde rodando na porta ${PORT}`);
});
