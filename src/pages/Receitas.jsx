import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getReceitas, getCategorias } from '../services/api';

function Receitas() {
  const [receitas, setReceitas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();

  const categoriaAtual = searchParams.get('categoria');

  useEffect(() => {
    loadCategorias();
  }, []);

  useEffect(() => {
    loadReceitas();
  }, [categoriaAtual]);

  const loadCategorias = async () => {
    try {
      const response = await getCategorias();
      setCategorias(response.data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadReceitas = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoriaAtual) params.categoria = categoriaAtual;
      
      const response = await getReceitas(params);
      setReceitas(response.data.receitas);
    } catch (error) {
      console.error('Erro ao carregar receitas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBusca = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await getReceitas({ busca });
      setReceitas(response.data.receitas);
    } catch (error) {
      console.error('Erro ao buscar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReceitaClick = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    navigate(`/receita/${id}`);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Nossas Receitas</h1>
        <p className="section-subtitle">
          Mais de 200 receitas detalhadas de chás, garrafadas e remédios caseiros
        </p>

        {/* Busca */}
        <form onSubmit={handleBusca} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            <input
              type="text"
              className="form-input"
              placeholder="🔍 Busque por sintoma, planta ou problema (ex: dor de cabeça, tosse, boldo)..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Buscar
            </button>
          </div>
        </form>

        {/* Filtro de Categorias */}
        <div style={{ marginBottom: '2rem', overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              className={`btn ${!categoriaAtual ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => {
                setSearchParams({});
                loadReceitas();
              }}
            >
              Todas
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                className={`btn ${categoriaAtual === cat.id ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSearchParams({ categoria: cat.id })}
              >
                {cat.icone} {cat.nome}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Receitas */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p style={{ marginTop: '1rem' }}>Carregando receitas...</p>
          </div>
        ) : receitas.length === 0 ? (
          <div className="card text-center" style={{ padding: '3rem' }}>
            <h3>Nenhuma receita encontrada</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
              Tente buscar por outro termo ou categoria
            </p>
          </div>
        ) : (
          <div className="grid">
            {receitas.map((receita) => (
              <div
                key={receita.id}
                className="card"
                onClick={() => handleReceitaClick(receita.id)}
              >
                <div className="card-tag" style={{ background: receita.categorias?.cor }}>
                  {receita.categorias?.icone} {receita.categorias?.nome}
                </div>
                <h3 className="card-title">{receita.nome}</h3>
                <p className="card-description">{receita.descricao}</p>
                <div style={{ marginTop: '1rem' }}>
                  <span className="badge badge-info">{receita.tipo}</span>
                  {receita.tempo_preparo && (
                    <span className="badge badge-warning" style={{ marginLeft: '0.5rem' }}>
                      ⏱️ {receita.tempo_preparo}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Receitas;
