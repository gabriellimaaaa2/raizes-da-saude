import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReceita, addFavorito, removeFavorito } from '../services/api';

function ReceitaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receita, setReceita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [receitasRestantes, setReceitasRestantes] = useState(null);
  const [isFavorito, setIsFavorito] = useState(false);
  const [podeEditar, setPodeEditar] = useState(false);

  useEffect(() => {
    loadReceita();
  }, [id]);

  const loadReceita = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getReceita(id);
      setReceita(response.data.receita);
      setReceitasRestantes(response.data.receitasRestantes);
      setPodeEditar(response.data.podeEditar || false);
    } catch (err) {
      if (err.response?.data?.needsSubscription) {
        setError('Você atingiu o limite de 3 receitas gratuitas por dia. Assine para ter acesso ilimitado!');
      } else {
        setError('Erro ao carregar receita');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFavoritar = async () => {
    try {
      if (isFavorito) {
        await removeFavorito(id);
        setIsFavorito(false);
      } else {
        await addFavorito(id);
        setIsFavorito(true);
      }
    } catch (error) {
      console.error('Erro ao favoritar:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem' }}>Carregando receita...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ marginTop: '3rem' }}>
        <div className="card text-center" style={{ padding: '3rem' }}>
          <h2 style={{ color: 'var(--secondary-color)', marginBottom: '1rem' }}>
            ⚠️ Limite Atingido
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>{error}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/planos')} className="btn btn-primary">
              Ver Planos
            </button>
            <button onClick={() => navigate('/receitas')} className="btn btn-outline">
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!receita) return null;

  const ingredientes = Array.isArray(receita.ingredientes) 
    ? receita.ingredientes 
    : JSON.parse(receita.ingredientes || '[]');

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Aviso de Receitas Restantes */}
        {receitasRestantes !== null && (
          <div className="alert alert-info" style={{ marginBottom: '2rem' }}>
            <strong>ℹ️ Você ainda pode ver {receitasRestantes} receita(s) grátis hoje.</strong>
            {receitasRestantes === 0 && ' Assine para ter acesso ilimitado!'}
          </div>
        )}

        {/* Aviso de Segurança */}
        <div className="alert alert-warning" style={{ marginBottom: '2rem' }}>
          <strong>⚠️ Importante:</strong> Este conteúdo é baseado na sabedoria popular e não substitui uma consulta médica. Sempre fale com seu médico antes de usar qualquer remédio caseiro.
        </div>

        {/* Header */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <div>
              <div className="card-tag" style={{ background: receita.categorias?.cor, marginBottom: '1rem' }}>
                {receita.categorias?.icone} {receita.categorias?.nome}
              </div>
              <h1 className="card-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                {receita.nome}
              </h1>
              <p className="card-description" style={{ fontSize: '1.1rem' }}>
                {receita.descricao}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleFavoritar}
                className="btn btn-outline"
                style={{ fontSize: '1.5rem' }}
                title={isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                {isFavorito ? '❤️' : '🤍'}
              </button>
              {podeEditar && (
                <button
                  onClick={() => {
                    const texto = `${receita.nome}\n\n${receita.descricao}\n\nIngredientes:\n${JSON.parse(receita.ingredientes).map(i => `- ${i.item} ${i.obs ? '(' + i.obs + ')' : ''}`).join('\n')}\n\nModo de Preparo:\n${receita.modo_preparo}\n\nComo Tomar:\n${receita.como_tomar}\n\nQuando Tomar:\n${receita.quando_tomar}`;
                    navigator.clipboard.writeText(texto);
                    alert('✅ Receita copiada! Cole em suas notas.');
                  }}
                  className="btn btn-primary"
                  title="Salvar receita (copiar)"
                >
                  💾 Salvar
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span className="badge badge-info">{receita.tipo}</span>
            {receita.tempo_preparo && (
              <span className="badge badge-warning">⏱️ {receita.tempo_preparo}</span>
            )}
            {receita.validade && (
              <span className="badge badge-success">📅 {receita.validade}</span>
            )}
          </div>
        </div>

        {/* Indicações */}
        {receita.indicacoes && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 className="card-title">🎯 Indicações</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>{receita.indicacoes}</p>
          </div>
        )}

        {/* Ingredientes */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 className="card-title">🌿 Ingredientes</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {ingredientes.map((ing, index) => (
              <li key={index} style={{ 
                padding: '0.75rem', 
                background: 'var(--background)', 
                marginBottom: '0.5rem', 
                borderRadius: '8px',
                fontSize: '1.05rem'
              }}>
                <strong>{ing.item}</strong>
                {ing.obs && <span style={{ color: 'var(--text-secondary)' }}> - {ing.obs}</span>}
              </li>
            ))}
          </ul>
        </div>

        {/* Modo de Preparo */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 className="card-title">👨‍🍳 Modo de Preparo</h2>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
            {receita.modo_preparo}
          </p>
        </div>

        {/* Como Tomar */}
        {receita.como_tomar && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 className="card-title">💊 Como Tomar</h2>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>{receita.como_tomar}</p>
          </div>
        )}

        {/* Quando Tomar */}
        {receita.quando_tomar && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 className="card-title">⏰ Quando Tomar</h2>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>{receita.quando_tomar}</p>
          </div>
        )}

        {/* Contraindicações */}
        {receita.contraindicacoes && (
          <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--secondary-color)' }}>
            <h2 className="card-title" style={{ color: 'var(--secondary-color)' }}>
              ⚠️ Contraindicações
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>{receita.contraindicacoes}</p>
          </div>
        )}

        {/* Observações */}
        {receita.observacoes && (
          <div className="card" style={{ marginBottom: '2rem', background: 'var(--background)' }}>
            <h2 className="card-title">📝 Observações Importantes</h2>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>{receita.observacoes}</p>
          </div>
        )}

        {/* Botões de Ação */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '3rem' }}>
          <button onClick={() => navigate('/receitas')} className="btn btn-outline">
            ← Voltar para Receitas
          </button>
          {receitasRestantes === 0 && (
            <button onClick={() => navigate('/planos')} className="btn btn-primary">
              Assinar Agora
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReceitaDetalhes;
