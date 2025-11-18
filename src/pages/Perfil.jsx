import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, cancelarPlano } from '../services/api';

function Perfil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const response = await getMe();
      setUser(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarPlano = async () => {
    try {
      await cancelarPlano();
      alert('Plano cancelado com sucesso!');
      setShowCancelModal(false);
      loadUser();
      
      // Atualizar localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      userData.plano = 'gratuito';
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      alert('Erro ao cancelar plano');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem' }}>Carregando...</p>
      </div>
    );
  }

  if (!user) return null;

  const temPlanoAtivo = user.plano !== 'gratuito' && 
    user.data_expiracao_plano && 
    new Date(user.data_expiracao_plano) > new Date();

  const planoNomes = {
    gratuito: 'Gratuito',
    teste: 'Teste',
    semanal: 'Semanal',
    mensal: 'Mensal',
    anual: 'Anual',
    vitalicio: 'Vitalício'
  };

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="section-title">Meu Perfil</h1>

        {/* Informações do Usuário */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'var(--primary-color)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '2.5rem',
              color: 'white',
              marginRight: '1.5rem'
            }}>
              {user.nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ marginBottom: '0.5rem' }}>{user.nome}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
              {user.telefone && (
                <p style={{ color: 'var(--text-secondary)' }}>📱 {user.telefone}</p>
              )}
            </div>
          </div>

          {/* Status do Plano */}
          <div style={{ 
            background: temPlanoAtivo ? 'var(--primary-light)' : 'var(--background)', 
            padding: '1.5rem', 
            borderRadius: 'var(--border-radius)',
            color: temPlanoAtivo ? 'white' : 'var(--text-primary)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                  Plano Atual
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '700' }}>
                  {planoNomes[user.plano] || 'Gratuito'}
                </div>
                {temPlanoAtivo && user.data_expiracao_plano && (
                  <div style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '0.5rem' }}>
                    Válido até: {new Date(user.data_expiracao_plano).toLocaleDateString('pt-BR')}
                  </div>
                )}
              </div>
              {temPlanoAtivo ? (
                <div style={{ fontSize: '3rem' }}>⭐</div>
              ) : (
                <div style={{ fontSize: '3rem' }}>🆓</div>
              )}
            </div>
          </div>

          {/* Estatísticas */}
          {user.plano === 'gratuito' && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--background)', borderRadius: 'var(--border-radius)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Receitas visualizadas hoje:</span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>
                  {user.receitas_visualizadas_hoje || 0} / 3
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 className="card-title">Ações</h3>
          
          {user.plano === 'gratuito' ? (
            <button
              onClick={() => navigate('/planos')}
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              ⭐ Assinar Plano Premium
            </button>
          ) : (
            <button
              onClick={() => setShowCancelModal(true)}
              className="btn btn-secondary"
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              ❌ Cancelar Plano
            </button>
          )}

          <button
            onClick={() => navigate('/favoritos')}
            className="btn btn-outline"
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            ❤️ Minhas Receitas Favoritas
          </button>

          <button
            onClick={() => navigate('/consultas')}
            className="btn btn-outline"
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            📋 Histórico de Consultas
          </button>

          <button
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ width: '100%' }}
          >
            🚪 Sair da Conta
          </button>
        </div>

        {/* Suporte */}
        <div className="card" style={{ background: 'var(--primary-light)', color: 'white' }}>
          <h3 style={{ marginBottom: '1rem' }}>💬 Precisa de Ajuda?</h3>
          <p style={{ marginBottom: '1rem', opacity: 0.95 }}>
            Entre em contato com nosso suporte pelo WhatsApp:
          </p>
          <a
            href="https://wa.me/5588998581489"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{ background: 'white', color: 'var(--primary-color)', width: '100%' }}
          >
            📱 (88) 9 9858-1489
          </a>
        </div>

        {/* Modal de Cancelamento */}
        {showCancelModal && (
          <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowCancelModal(false)}>
                ×
              </button>
              <h2 className="modal-title">Cancelar Plano</h2>
              <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
                Tem certeza que deseja cancelar seu plano? Você perderá o acesso ilimitado às receitas.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Não, manter plano
                </button>
                <button
                  onClick={handleCancelarPlano}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Sim, cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Perfil;
