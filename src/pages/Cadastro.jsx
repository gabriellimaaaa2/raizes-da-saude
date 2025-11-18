import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';

function Cadastro() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { confirmarSenha, ...dataToSend } = formData;
      const response = await register(dataToSend);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/receitas');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '4rem' }}>
      <div className="card">
        <h1 className="modal-title text-center">Criar Conta</h1>
        <p className="text-center" style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Cadastre-se grátis e acesse 3 receitas por dia
        </p>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome completo</label>
            <input
              type="text"
              name="nome"
              className="form-input"
              placeholder="Seu nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Telefone (opcional)</label>
            <input
              type="tel"
              name="telefone"
              className="form-input"
              placeholder="(00) 00000-0000"
              value={formData.telefone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              name="senha"
              className="form-input"
              placeholder="Mínimo 6 caracteres"
              value={formData.senha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar senha</label>
            <input
              type="password"
              name="confirmarSenha"
              className="form-input"
              placeholder="Digite a senha novamente"
              value={formData.confirmarSenha}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Criar conta grátis'}
          </button>
        </form>

        <p className="text-center mt-3">
          Já tem uma conta?{' '}
          <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;
