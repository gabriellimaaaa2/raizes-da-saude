import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategorias } from '../services/api';

function Home() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      const response = await getCategorias();
      setCategorias(response.data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>🌿 Raízes da Saúde</h1>
          <p>
            A enciclopédia definitiva da sabedoria popular brasileira.<br />
            Chás, garrafadas e remédios caseiros com detalhes que você nunca viu.
          </p>
          <div className="hero-buttons">
            <Link to="/receitas" className="btn btn-primary" style={{ background: 'white', color: 'var(--primary-color)' }}>
              Explorar Receitas
            </Link>
            <Link to="/consulta" className="btn btn-secondary" style={{ borderColor: 'white', color: 'white' }}>
              Consulta Virtual
            </Link>
          </div>
        </div>
      </section>

      {/* Aviso de Segurança */}
      <section className="section">
        <div className="container">
          <div className="alert alert-warning" style={{ fontSize: '1.1rem', textAlign: 'center' }}>
            <strong>⚠️ Importante:</strong> Este conteúdo é baseado na sabedoria popular e não substitui uma consulta médica. Sempre fale com seu médico.
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="section categories">
        <div className="container">
          <h2 className="section-title text-center">Explore por Categoria</h2>
          <p className="section-subtitle text-center">
            Mais de 200 receitas organizadas para você encontrar exatamente o que precisa
          </p>

          <div className="categories-grid">
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                to={`/receitas?categoria=${categoria.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="category-card">
                  <div className="category-icon" style={{ color: categoria.cor }}>
                    {categoria.icone}
                  </div>
                  <div className="category-name">{categoria.nome}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <h2 className="section-title text-center">Como Funciona</h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div className="card text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <h3 className="card-title">1. Explore Grátis</h3>
              <p className="card-description">
                Acesse até 3 receitas completas por dia gratuitamente
              </p>
            </div>

            <div className="card text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3 className="card-title">2. Detalhes Completos</h3>
              <p className="card-description">
                Ingredientes exatos, modo de preparo, quando tomar e contraindicações
              </p>
            </div>

            <div className="card text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
              <h3 className="card-title">3. Assine e Libere Tudo</h3>
              <p className="card-description">
                Acesso ilimitado a todas as receitas, favoritos e consulta virtual
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer style={{ background: 'var(--primary-dark)', color: 'white', padding: '2rem 0', marginTop: '3rem' }}>
        <div className="container text-center">
          <h3 style={{ marginBottom: '1rem' }}>🌿 Raízes da Saúde</h3>
          <p style={{ opacity: 0.9 }}>
            Preservando e compartilhando a sabedoria popular brasileira
          </p>
          <p style={{ marginTop: '1rem', opacity: 0.7, fontSize: '0.9rem' }}>
            © 2024 Raízes da Saúde. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </>
  );
}

export default Home;
