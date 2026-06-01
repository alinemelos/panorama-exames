import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Plantao.css'

const EXAMES = ['Tomografia', 'Raio X', 'Ultrasonografia', 'Ressonância', 'Mamografia', 'Densitometria']
const EQUIPAMENTOS = ['HCPE-3270', 'HCPE-3271', 'HCPE-3272', 'HCPE-3273']
const MOTIVOS = ['Equipamento em manutenção', 'Problema de infraestrutura']

function Plantao() {
  const navigate = useNavigate()
  const [exameAberto, setExameAberto] = useState(false)
  const [equipamentoAberto, setEquipamentoAberto] = useState(false)
  const [exameSelecionado, setExameSelecionado] = useState('Tomografia')
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState('HCPE-3270')
  const [quantidade, setQuantidade] = useState('')
  const [historico, setHistorico] = useState([])
  const [motivo, setMotivo] = useState('')
  const [mostrarTudo, setMostrarTudo] = useState(false)
  const [view, setView] = useState('plantao') // 'plantao' | 'motivo' | 'concluido'

  const total = historico.reduce((acc, item) => acc + item.quantidade, 0)
  const historicoExibido = mostrarTudo ? historico : historico.slice(0, 4)

  function handleSubmit(e) {
    e.preventDefault()
    const qtd = parseInt(quantidade)
    if (isNaN(qtd) || qtd < 0) return

    if (qtd === 0) {
      setView('motivo')
      setQuantidade('')
      return
    }

    const agora = new Date()
    const hora = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`
    setHistorico(prev => [{ hora, quantidade: qtd }, ...prev])
    setQuantidade('')
  }

  function handleEnviarMotivo(e) {
    e.preventDefault()
    // TODO: enviar motivo para o backend
    setView('concluido')
  }

  function handleFinalizar() {
    setView('concluido')
  }

  if (view === 'motivo') {
    return (
      <div className="plantao-page">
        <button className="btn-voltar-login" onClick={() => navigate('/')}>&#8592; Voltar ao login</button>
        <div className="plantao-content">
          <h1 className="plantao-title">Qual o motivo de ter 0 exames no plantão?</h1>
          <form onSubmit={handleEnviarMotivo} className="motivo-form">
            {MOTIVOS.map(m => (
              <label key={m} className="motivo-opcao">
                <input
                  type="radio"
                  name="motivo"
                  value={m}
                  checked={motivo === m}
                  onChange={() => setMotivo(m)}
                />
                <span>{m}</span>
              </label>
            ))}
            <button type="submit" className="btn-enviar-motivo" disabled={!motivo}>
              Enviar
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (view === 'concluido') {
    return (
      <div className="plantao-page">
        <button className="btn-voltar-login" onClick={() => navigate('/')}>&#8592; Voltar ao login</button>
        <div className="plantao-content">
          <p className="concluido-texto">Envio Concluído</p>
        </div>
      </div>
    )
  }

  return (
    <div className="plantao-page">
      <button className="btn-voltar-login" onClick={() => navigate('/')}>&#8592; Voltar ao login</button>
      <div className="plantao-dropdowns">
        <div className="dropdown-section">
          <p className="dropdown-label">Exame</p>
          <div className="dropdown">
            <button
              className="dropdown-selected"
              onClick={() => { setExameAberto(!exameAberto); setEquipamentoAberto(false) }}
            >
              {exameSelecionado} <span>{exameAberto ? '∧' : '∨'}</span>
            </button>
            {exameAberto && (
              <div className="dropdown-list">
                {EXAMES.filter(e => e !== exameSelecionado).map(exame => (
                  <button key={exame} onClick={() => { setExameSelecionado(exame); setExameAberto(false) }}>
                    {exame}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="dropdown-section">
          <p className="dropdown-label">Equipamento</p>
          <div className="dropdown">
            <button
              className="dropdown-selected"
              onClick={() => { setEquipamentoAberto(!equipamentoAberto); setExameAberto(false) }}
            >
              {equipamentoSelecionado} <span>{equipamentoAberto ? '∧' : '∨'}</span>
            </button>
            {equipamentoAberto && (
              <div className="dropdown-list">
                {EQUIPAMENTOS.filter(e => e !== equipamentoSelecionado).map(equip => (
                  <button key={equip} onClick={() => { setEquipamentoSelecionado(equip); setEquipamentoAberto(false) }}>
                    {equip}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="plantao-content">
        <h1 className="plantao-title">Quantidade de Exames Feitos no Plantão</h1>

        <form onSubmit={handleSubmit} className="quantidade-form">
          <div className="quantidade-input-wrapper">
            <input
              type="number"
              placeholder="Insira a quantidade de exames feitos..."
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              min="0"
            />
            <button type="submit" className="btn-arrow">&#8594;</button>
          </div>
        </form>

        <div className="historico">
          {historicoExibido.map((item, index) => (
            <p key={index}>
              {item.hora} - {item.quantidade} {item.quantidade === 1 ? 'exame inserido.' : 'exames inseridos.'}
            </p>
          ))}
          {historico.length > 4 ? (
            <a href="#" onClick={(e) => { e.preventDefault(); setMostrarTudo(!mostrarTudo) }}>
              {mostrarTudo ? 'Ver menos' : 'Ver histórico completo'}
            </a>
          ) : (
            <a href="#" onClick={(e) => e.preventDefault()}>Ver histórico completo</a>
          )}
        </div>

        <p className="plantao-total">
          Total registrado até o momento: <strong>{total}</strong>
        </p>

        <button className="btn-finalizar" onClick={handleFinalizar}>
          Finalizar Plantão
        </button>
      </div>
    </div>
  )
}

export default Plantao