import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Checkout() {
  const [searchParams] = useSearchParams();
  const planoId = searchParams.get('plano');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pixData, setPixData] = useState(null);
  const [pagamentoAprovado, setPagamentoAprovado] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(120); // 2 minutos em segundos
  const pollingInterval = useRef(null);
  const timerInterval = useRef(null);

  const planos = {
    teste: { nome: 'Teste', preco: 0.01, periodo: '1 dia' },
    semanal: { nome: 'Semanal', preco: 9.90, periodo: '7 dias' },
    mensal: { nome: 'Mensal', preco: 29.90, periodo: '30 dias' },
    anual: { nome: 'Anual', preco: 199.90, periodo: '1 ano' },
    vitalicio: { nome: 'Vitalício', preco: 497.00, periodo: 'Para sempre' }
  };

  const plano = planos[planoId];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (!plano) {
      navigate('/planos');
      return;
    }
  }, [plano, navigate]);

  useEffect(() => {
    // Limpar intervalos quando componente desmontar
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (pixData && !pagamentoAprovado) {
      // Iniciar cronômetro
      timerInterval.current = setInterval(() => {
        setTempoRestante(prev => {
          if (prev <= 1) {
            clearInterval(timerInterval.current);
            setError('Tempo expirado! Gere um novo código PIX.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Iniciar polling para verificar pagamento
      pollingInterval.current = setInterval(() => {
        verificarPagamento();
      }, 5000); // Verifica a cada 5 segundos

      return () => {
        clearInterval(pollingInterval.current);
        clearInterval(timerInterval.current);
      };
    }
  }, [pixData, pagamentoAprovado]);

  const verificarPagamento = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/pagamento/verificar/${pixData.paymentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.status === 'approved') {
        // Pagamento aprovado!
        setPagamentoAprovado(true);
        clearInterval(pollingInterval.current);
        clearInterval(timerInterval.current);

        // Mostrar mensagem de sucesso por 3 segundos
        setTimeout(() => {
          navigate('/perfil');
        }, 3000);
      }
    } catch (err) {
      console.error('Erro ao verificar pagamento:', err);
    }
  };

  const handleGerarPix = async () => {
    setLoading(true);
    setError('');
    setTempoRestante(120); // Resetar cronômetro

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/pagamento/pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plano: planoId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar PIX');
      }

      const data = await response.json();
      setPixData(data);
    } catch (err) {
      console.error('Erro ao criar PIX:', err);
      setError(err.message || 'Erro ao gerar PIX. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const copiarCodigoPix = () => {
    navigator.clipboard.writeText(pixData.qrCode);
    alert('✅ Código PIX copiado!');
  };

  const formatarTempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  };

  if (!plano) {
    return null;
  }

  // Tela de sucesso
  if (pagamentoAprovado) {
    return (
      <div className="section" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>✅</div>
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem', fontSize: '2rem' }}>
              Pagamento Aprovado!
            </h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
              Seu plano <strong>{plano.nome}</strong> foi ativado com sucesso!
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
              Redirecionando para o perfil...
            </p>
            <div style={{ marginTop: '2rem' }}>
              <div className="spinner" style={{ margin: '0 auto' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container" style={{ maxWidth: '900px', paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* Resumo do Plano */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Resumo do Pedido</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>{plano.nome}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{plano.periodo}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                R$ {plano.preco.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        {/* Pagamento PIX */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>💳 Pagamento via PIX</h3>

          {!pixData ? (
            <div>
              <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                Clique no botão abaixo para gerar o código PIX. Você terá <strong>2 minutos</strong> para realizar o pagamento.
              </p>
              <button
                onClick={handleGerarPix}
                className="btn btn-primary"
                style={{ width: '100%', padding: '1rem', fontSize: '1.2rem' }}
                disabled={loading}
              >
                {loading ? 'Gerando PIX...' : '📱 Gerar Código PIX'}
              </button>
            </div>
          ) : (
            <div>
              {/* Cronômetro */}
              <div style={{ 
                background: tempoRestante < 30 ? '#ffebee' : '#e3f2fd', 
                padding: '1rem', 
                borderRadius: '8px', 
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                <p style={{ marginBottom: '0.5rem', fontWeight: '500' }}>⏱️ Tempo restante:</p>
                <p style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '700', 
                  color: tempoRestante < 30 ? '#d32f2f' : '#1976d2',
                  marginBottom: 0
                }}>
                  {formatarTempo(tempoRestante)}
                </p>
              </div>

              {/* QR Code */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <p style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '500' }}>
                  Escaneie o QR Code com o app do seu banco:
                </p>
                <img
                  src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                  alt="QR Code PIX"
                  style={{ 
                    maxWidth: '300px', 
                    width: '100%', 
                    border: '3px solid var(--primary-color)', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
              </div>

              {/* Código Copia e Cola */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '1.1rem' }}>
                  Ou copie o código PIX:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={pixData.qrCode}
                    readOnly
                    className="form-input"
                    style={{ flex: 1, fontSize: '0.9rem', minWidth: '200px' }}
                  />
                  <button
                    onClick={copiarCodigoPix}
                    className="btn btn-outline"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    📋 Copiar
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="alert alert-info">
                <p style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                  🔄 Aguardando pagamento...
                </p>
                <p style={{ marginBottom: 0, fontSize: '0.95rem' }}>
                  Estamos verificando seu pagamento automaticamente. Quando for aprovado, você será redirecionado.
                </p>
              </div>

              {/* Botão Voltar */}
              <button
                onClick={() => navigate('/planos')}
                className="btn btn-outline"
                style={{ width: '100%', marginTop: '1rem' }}
              >
                ← Voltar aos Planos
              </button>
            </div>
          )}
        </div>

        {/* Aviso de Segurança */}
        <div style={{ marginTop: '2rem', textAlign: 'center', color: 'white', fontSize: '0.9rem' }}>
          <p>🔒 Pagamento seguro processado pelo Mercado Pago</p>
          <p>Seus dados estão protegidos</p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
