import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import RecuperarSenha from './pages/RecuperarSenha';
import Receitas from './pages/Receitas';
import ReceitaDetalhes from './pages/ReceitaDetalhes';
import ConsultaVirtual from './pages/ConsultaVirtual';
import Planos from './pages/Planos';
import Checkout from './pages/Checkout';
import Perfil from './pages/Perfil';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/receitas" element={<Receitas />} />
          <Route path="/receita/:id" element={<ReceitaDetalhes />} />
          <Route path="/consulta" element={<ConsultaVirtual />} />
          <Route path="/planos" element={<Planos />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
