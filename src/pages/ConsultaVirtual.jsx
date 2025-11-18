import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ConsultaVirtual() {
  const [etapa, setEtapa] = useState(1);
  const [respostas, setRespostas] = useState({});
  const [finalizado, setFinalizado] = useState(false);
  const navigate = useNavigate();

  const handleResposta = (campo, valor, proximaEtapa) => {
    const novasRespostas = { ...respostas, [campo]: valor };
    setRespostas(novasRespostas);

    if (proximaEtapa) {
      setEtapa(proximaEtapa);
    } else {
      // Finalizar consulta
      setFinalizado(true);
    }
  };

  const voltar = () => {
    if (etapa > 1) {
      setEtapa(etapa - 1);
    }
  };

  const getCategoriaRecomendada = () => {
    const { area, problema } = respostas;

    // Mapeamento lógico baseado nas respostas
    const mapeamento = {
      cabeca_dor: 'Dor e Inflamação',
      cabeca_ansiedade: 'Calmante',
      cabeca_insonia: 'Calmante',
      peito_tosse: 'Respiratório',
      peito_garganta: 'Respiratório',
      barriga_enjoo: 'Digestivo',
      barriga_digestao: 'Digestivo',
      barriga_intestino: 'Digestivo',
      corpo_juntas: 'Dor e Inflamação',
      corpo_musculos: 'Dor e Inflamação',
      corpo_cansaco: 'Energia e Disposição'
    };

    const chave = `${area}_${problema}`;
    return mapeamento[chave] || 'Digestivo';
  };

  const getTipoRecomendado = () => {
    const { preferencia } = respostas;
    return preferencia || 'chá';
  };

  if (finalizado) {
    const categoria = getCategoriaRecomendada();
    const tipoPreferido = getTipoRecomendado();
    const temAlergia = respostas.alergia === 'sim';
    const tomaRemedio = respostas.remedio === 'sim';

    return (
      <div className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="card">
            <h1 className="section-title text-center">
              Com base na nossa conversa, separei umas receitas que podem te ajudar:
            </h1>

            {/* Aviso de Segurança */}
            <div className="alert alert-warning" style={{ marginTop: '2rem' }}>
              <strong>⚠️ IMPORTANTE:</strong> Este conteúdo é baseado na sabedoria popular e não substitui uma consulta médica.
              {tomaRemedio && (
                <span> Como você está tomando remédios receitados, é ESSENCIAL conversar com seu médico antes de usar qualquer remédio caseiro para evitar interações.</span>
              )}
              {temAlergia && (
                <span> Como você tem alergias, verifique todos os ingredientes antes de usar qualquer receita.</span>
              )}
            </div>

            {/* Categoria Recomendada */}
            <div className="card" style={{ marginTop: '2rem', background: 'var(--primary-light)', color: 'white' }}>
              <h2 style={{ marginBottom: '1rem' }}>📋 Categoria Recomendada</h2>
              <h3 style={{ fontSize: '2rem' }}>{categoria}</h3>
              <p style={{ marginTop: '1rem', opacity: 0.95 }}>
                Com base nas suas respostas, essas receitas podem ser mais adequadas para você.
              </p>
            </div>

            {/* Tipo de Receita Preferido */}
            <div className="card" style={{ marginTop: '1.5rem', background: '#795548', color: 'white' }}>
              <h2 style={{ marginBottom: '0.5rem' }}>
                {tipoPreferido === 'garrafada' ? '🍶 Garrafadas' : '🍵 Chás'}
              </h2>
              <p style={{ opacity: 0.95 }}>
                {tipoPreferido === 'garrafada' 
                  ? 'Você preferiu garrafadas! Vou te mostrar garrafadas tradicionais para o seu problema. Lembre-se que garrafadas precisam de tempo de curtimento (15-20 dias) mas duram muito mais.'
                  : 'Você preferiu chás! Vou te mostrar chás que você pode preparar na hora e tomar fresquinho.'
                }
              </p>
            </div>

            {/* Resumo das Respostas */}
            <div className="card" style={{ marginTop: '2rem', background: 'var(--background)' }}>
              <h3 style={{ marginBottom: '1rem' }}>📝 Resumo da Consulta</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '0.5rem 0' }}>
                  <strong>Área:</strong> {respostas.area === 'cabeca' ? 'Cabeça e Mente' : respostas.area === 'peito' ? 'Peito e Garganta' : respostas.area === 'barriga' ? 'Barriga e Estômago' : 'Corpo Todo/Dores'}
                </li>
                <li style={{ padding: '0.5rem 0' }}>
                  <strong>Preferência:</strong> {tipoPreferido === 'garrafada' ? 'Garrafadas (curtidas em cachaça)' : 'Chás (preparados na hora)'}
                </li>
                <li style={{ padding: '0.5rem 0' }}>
                  <strong>Intensidade:</strong> {respostas.intensidade === 'leve' ? 'Leve' : respostas.intensidade === 'medio' ? 'Médio' : 'Forte'}
                </li>
                <li style={{ padding: '0.5rem 0' }}>
                  <strong>Duração:</strong> {respostas.duracao === 'agudo' ? 'Recente' : 'Há alguns dias'}
                </li>
              </ul>
            </div>

            {/* Botões de Ação */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/receitas')}
                className="btn btn-primary"
              >
                Ver Receitas Recomendadas
              </button>
              <button
                onClick={() => {
                  setEtapa(1);
                  setRespostas({});
                  setFinalizado(false);
                }}
                className="btn btn-outline"
              >
                Iniciar Nova Consulta
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '700px' }}>
        <div className="card">
          {/* Progresso */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '0.5rem',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem'
            }}>
              <span>Etapa {etapa} de 6</span>
              <span>{Math.round((etapa / 6) * 100)}%</span>
            </div>
            <div style={{ 
              height: '8px', 
              background: 'var(--border-color)', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                height: '100%', 
                background: 'var(--primary-color)', 
                width: `${(etapa / 6) * 100}%`,
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>

          {/* Etapa 1: Área do Corpo */}
          {etapa === 1 && (
            <>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '2rem', lineHeight: '1.4' }}>
                Pra gente começar nossa prosa, me diga: qual parte do corpo tá pedindo mais atenção hoje?
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  onClick={() => handleResposta('area', 'cabeca', 2)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  🧠 Cabeça e Mente
                </button>
                <button
                  onClick={() => handleResposta('area', 'peito', 2)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  🫁 Peito e Garganta
                </button>
                <button
                  onClick={() => handleResposta('area', 'barriga', 2)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  🤰 Barriga e Estômago
                </button>
                <button
                  onClick={() => handleResposta('area', 'corpo', 2)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  💪 Corpo Todo/Dores
                </button>
              </div>
            </>
          )}

          {/* Etapa 2: Problema Específico (baseado na área) */}
          {etapa === 2 && respostas.area === 'cabeca' && (
            <>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '2rem', lineHeight: '1.4' }}>
                É mais uma dor na cabeça ou um sentimento na mente?
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  onClick={() => handleResposta('problema', 'dor', 3)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  Dor de cabeça mesmo
                </button>
                <button
                  onClick={() => handleResposta('problema', 'ansiedade', 3)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  É ansiedade/preocupação
                </button>
                <button
                  onClick={() => handleResposta('problema', 'insonia', 3)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  Não consigo dormir direito
                </button>
              </div>
            </>
          )}

          {etapa === 2 && respostas.area === 'peito' && (
            <>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '2rem', lineHeight: '1.4' }}>
                O problema é mais uma tosse ou uma dor/irritação na garganta?
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  onClick={() => handleResposta('problema', 'tosse', 3)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  Tosse
                </button>
                <button
                  onClick={() => handleResposta('problema', 'garganta', 3)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  Garganta arranhando/doendo
                </button>
              </div>
            </>
          )}

          {etapa === 2 && respostas.area === 'barriga' && (
            <>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '2rem', lineHeight: '1.4' }}>
                O que tá pegando mais: enjoo, má digestão ou intestino desregulado?
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  onClick={() => handleResposta('problema', 'enjoo', 3)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  Enjoo/Azia
                </button>
                <button
                  onClick={() => handleResposta('problema', 'digestao', 3)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  Sensação de estômago pesado
                </button>
                <button
                  onClick={() => handleResposta('problema', 'intestino', 3)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  Intestino solto ou preso
                </button>
              </div>
            </>
          )}

          {etapa === 2 && respostas.area === 'corpo' && (
            <>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '2rem', lineHeight: '1.4' }}>
                É uma dor mais nos ossos e juntas ou nos músculos?
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  onClick={() => handleResposta('problema', 'juntas', 3)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  Nas juntas/ossos
                </button>
                <button
                  onClick={() => handleResposta('problema', 'musculos', 3)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  Músculos cansados/doloridos
                </button>
                <button
                  onClick={() => handleResposta('problema', 'cansaco', 3)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  Corpo pesado, sem energia
                </button>
              </div>
            </>
          )}

          {/* NOVA ETAPA 3: Preferência entre Garrafada e Chá */}
          {etapa === 3 && (
            <>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '2rem', lineHeight: '1.4' }}>
                Agora me diz: você prefere tomar uma garrafada ou um chá?
              </h2>
              <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--background)', borderRadius: '8px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                <p style={{ margin: '0 0 0.5rem 0' }}><strong>🍶 Garrafada:</strong> Ervas curtidas em cachaça por 15-20 dias. Mais concentrada e potente. Dura muito tempo. Toma-se em colheradas.</p>
                <p style={{ margin: 0 }}><strong>🍵 Chá:</strong> Preparo rápido na hora. Toma-se em xícaras. Efeito mais suave. Ideal para quem quer algo imediato.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  onClick={() => handleResposta('preferencia', 'garrafada', 4)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  🍶 Prefiro garrafada (mais forte, precisa curtir)
                </button>
                <button
                  onClick={() => handleResposta('preferencia', 'cha', 4)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  🍵 Prefiro chá (preparo rápido, na hora)
                </button>
                <button
                  onClick={() => handleResposta('preferencia', 'ambos', 4)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  🌿 Tanto faz, quero ver os dois
                </button>
              </div>
            </>
          )}

          {/* Etapa 4: Intensidade */}
          {etapa === 4 && (
            <>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '2rem', lineHeight: '1.4' }}>
                Numa escala de 'tá só me amolando' a 'tá me derrubando', como você tá se sentindo?
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  onClick={() => handleResposta('intensidade', 'leve', 5)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  Só um incômodo leve
                </button>
                <button
                  onClick={() => handleResposta('intensidade', 'medio', 5)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  Tá atrapalhando meu dia
                </button>
                <button
                  onClick={() => handleResposta('intensidade', 'forte', 5)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  Tô precisando de cama
                </button>
              </div>
            </>
          )}

          {/* Etapa 5: Duração */}
          {etapa === 5 && (
            <>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '2rem', lineHeight: '1.4' }}>
                E esse incômodo, ele chegou de repente ou já tá aí há uns dias?
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  onClick={() => handleResposta('duracao', 'agudo', 6)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  Chegou hoje/ontem
                </button>
                <button
                  onClick={() => handleResposta('duracao', 'cronico', 6)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  Já faz um tempo
                </button>
              </div>
            </>
          )}

          {/* Etapa 6: Alergias e Medicamentos */}
          {etapa === 6 && !respostas.alergia && (
            <>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '2rem', lineHeight: '1.4' }}>
                Você tem algum tipo de alergia que a gente precise saber?
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  onClick={() => handleResposta('alergia', 'sim', 6)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  Sim
                </button>
                <button
                  onClick={() => handleResposta('alergia', 'nao', 6)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  Não
                </button>
                <button
                  onClick={() => handleResposta('alergia', 'incerto', 6)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  Não tenho certeza
                </button>
              </div>
            </>
          )}

          {etapa === 6 && respostas.alergia && (
            <>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '2rem', lineHeight: '1.4' }}>
                Você está tomando algum remédio de farmácia receitado por médico?
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  onClick={() => handleResposta('remedio', 'sim', null)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  Sim
                </button>
                <button
                  onClick={() => handleResposta('remedio', 'nao', null)}
                  className="btn btn-outline"
                  style={{ padding: '1.5rem', fontSize: '1.1rem', textAlign: 'left' }}
                >
                  Não
                </button>
              </div>
            </>
          )}

          {/* Botão Voltar */}
          {etapa > 1 && (
            <button
              onClick={voltar}
              className="btn btn-secondary"
              style={{ marginTop: '2rem', width: '100%' }}
            >
              ← Voltar
            </button>
          )}
        </div>

        {/* Aviso */}
        <div className="alert alert-info" style={{ marginTop: '2rem' }}>
          <strong>💡 Dica:</strong> Responda com calma e sinceridade. Quanto mais precisas forem suas respostas, melhores serão as recomendações.
        </div>
      </div>
    </div>
  );
}

export default ConsultaVirtual;
