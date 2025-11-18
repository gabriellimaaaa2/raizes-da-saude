import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="Raízes da Saúde" style={{ height: '50px', marginRight: '10px' }} />
          </Link>

          <ul className="nav-links">
            <li><Link to="/">Início</Link></li>
            <li><Link to="/receitas">Receitas</Link></li>
            <li><Link to="/consulta">Consulta Virtual</Link></li>
            {user && <li><Link to="/favoritos">Favoritos</Link></li>}
          </ul>

          <div className="nav-buttons">
            {user ? (
              <>
                {user.plano === 'gratuito' && (
                  <Link to="/planos" className="btn btn-primary">
                    Assinar
                  </Link>
                )}
                <Link to="/perfil" className="btn btn-outline">
                  Perfil
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">
                  Entrar
                </Link>
                <Link to="/cadastro" className="btn btn-primary">
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
