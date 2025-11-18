import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function BottomNav() {
  const location = useLocation();
  const user = localStorage.getItem('user');

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="bottom-nav">
      <Link to="/" className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}>
        <div className="bottom-nav-icon">🏠</div>
        <div className="bottom-nav-label">Início</div>
      </Link>

      <Link to="/receitas" className={`bottom-nav-item ${isActive('/receitas') ? 'active' : ''}`}>
        <div className="bottom-nav-icon">🌿</div>
        <div className="bottom-nav-label">Receitas</div>
      </Link>

      <Link to="/consulta" className={`bottom-nav-item ${isActive('/consulta') ? 'active' : ''}`}>
        <div className="bottom-nav-icon">💬</div>
        <div className="bottom-nav-label">Consulta</div>
      </Link>

      {user && (
        <Link to="/favoritos" className={`bottom-nav-item ${isActive('/favoritos') ? 'active' : ''}`}>
          <div className="bottom-nav-icon">❤️</div>
          <div className="bottom-nav-label">Favoritos</div>
        </Link>
      )}

      <Link to={user ? '/perfil' : '/login'} className={`bottom-nav-item ${isActive('/perfil') ? 'active' : ''}`}>
        <div className="bottom-nav-icon">👤</div>
        <div className="bottom-nav-label">Perfil</div>
      </Link>
    </div>
  );
}

export default BottomNav;
