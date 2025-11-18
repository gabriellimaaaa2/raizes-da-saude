import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Planos() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se usuário está logado
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const planos = [
    {
      id: 'semanal',
      nome: 'Semanal',
      preco: 9.90,
      periodo: '7 dias',
      descricao: 'Ideal para experimentar',
      destaque: false
    },
    {
      id: 'mensal',
      nome: 'Mensal',
      preco: 29.90,
      periodo: '30 dias',
      descricao: 'Acesso completo por 1 mês',
      destaque: true,
      badge: 'MAIS POPULAR'
    },
    {
      id: 'anual',
      nome: 'Anual',
      preco: 199.90,
      periodo: '1 ano',
      descricao: 'Melhor custo-benefício',
      destaque: false
    },
    {
      id: 'vitalicio',
      nome: 'Vitalício',
      preco: 497.00,
      periodo: 'Para sempre',
      descricao: 'Pagamento único, acesso eterno',
      destaque: true,
      badge: 'MELHOR CUSTO'
    }
  ];

  const handleAssinar = (planoId) => {
    navigate(`/checkout?plano=${planoId}`);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title text-center">Escolha Seu Plano</h1>
        <p className="section-subtitle text-center">
          Acesso ilimitado a todas as receitas, consulta virtual e muito mais
        </p>

        {error && (
          <div className="alert alert-danger" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
            {error}
          </div>
        )}

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', maxWidth: '1200px', margin: '0 auto' }}>
          {planos.map((plano) => (
            <div
              key={plano.id}
              className="card text-center"
              style={{
                border: plano.destaque ? '3px solid var(--primary-color)' : undefined,
                position: 'relative'
              }}
            >
              {plano.badge && (
                <div className="badge badge-success" style={{ marginBottom: '1rem' }}>
                  {plano.badge}
                </div>
              )}

              <h3 className="card-title">{plano.nome}</h3>

              <div style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: 'var(--primary-color)',
                margin: '1rem 0'
              }}>
                R$ {plano.preco.toFixed(2).replace('.', ',')}
              </div>

              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {plano.periodo}
              </p>

              <p className="card-description" style={{ marginBottom: '2rem' }}>
                {plano.descricao}
              </p>

              <button
                onClick={() => handleAssinar(plano.id)}
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? 'Processando...' : 'Assinar Agora'}
              </button>
            </div>
          ))}
        </div>

        <div className="card" style={{ maxWidth: '800px', margin: '3rem auto 0', background: 'var(--primary-light)', color: 'white' }}>
          <h3 style={{ marginBottom: '1rem' }}>✨ O que você ganha com a assinatura:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '0.5rem 0' }}>✅ Acesso ilimitado a todas as receitas</li>
            <li style={{ padding: '0.5rem 0' }}>✅ Consulta virtual personalizada</li>
            <li style={{ padding: '0.5rem 0' }}>✅ Salvar receitas favoritas</li>
            <li style={{ padding: '0.5rem 0' }}>✅ Busca avançada por sintomas</li>
            <li style={{ padding: '0.5rem 0' }}>✅ Suporte via WhatsApp</li>
            <li style={{ padding: '0.5rem 0' }}>✅ Atualizações constantes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Planos;
