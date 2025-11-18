import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { recuperarSenha } from '../services/api';

function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await recuperarSenha(email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container" style={{ maxWidth: '500px', marginTop: '4rem' }}>
        <div className="card text-center">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h1 className="modal-title">Email Enviado!</h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
            Enviamos um link de recuperação para <strong>{email}</strong>.
            Verifique sua caixa de entrada e spam.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
            Voltar para Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '4rem' }}>
      <div className="card">
        <h1 className="modal-title text-center">Recuperar Senha</h1>
        <p className="text-center" style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Digite seu email para receber o link de recuperação
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
              className="form-input"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </button>
        </form>

        <p className="text-center mt-3">
          Lembrou a senha?{' '}
          <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RecuperarSenha;
