import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
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
    setLoading(true);

    try {
      const response = await login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/receitas');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '4rem' }}>
      <div className="card">
        <h1 className="modal-title text-center">Bem-vindo de volta!</h1>
        <p className="text-center" style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Entre para acessar suas receitas favoritas
        </p>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
            <label className="form-label">Senha</label>
            <input
              type="password"
              name="senha"
              className="form-input"
              placeholder="Sua senha"
              value={formData.senha}
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
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center mt-3">
          <Link to="/recuperar-senha" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
            Esqueceu a senha?
          </Link>
        </p>

        <p className="text-center mt-2">
          Ainda não tem conta?{' '}
          <Link to="/cadastro" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
            Cadastre-se grátis
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
