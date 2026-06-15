import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listMachines, listProblems } from '../services/machines'
import { addCollection, closeDuty, getCurrent, openDuty } from '../services/duties'
import './styles/Plantao.css'

function Plantao() {
  const navigate = useNavigate()

  const [machines, setMachines] = useState([])
  const [problems, setProblems] = useState([])
  const [duty, setDuty] = useState(null)
  const [machineSelecionada, setMachineSelecionada] = useState('')
  const [machineAberta, setMachineAberta] = useState(false)
  const [quantidade, setQuantidade] = useState('')
  const [mostrarTudo, setMostrarTudo] = useState(false)
  const [motivo, setMotivo] = useState('')
  const [view, setView] = useState('plantao') // 'plantao' | 'motivo' | 'concluido'
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const collections = duty?.collections ?? []
  const total = duty?.total_count ?? 0
  const historicoExibido = mostrarTudo ? collections : collections.slice(0, 4)

  useEffect(() => {
    async function init() {
      try {
        const [mRes, pRes] = await Promise.all([listMachines(), listProblems()])
        setMachines(mRes.data)
        setProblems(pRes.data)
        if (mRes.data.length > 0) setMachineSelecionada(mRes.data[0].id)
      } catch {
        setErro('Erro ao carregar dados. Verifique sua conexão.')
      }

      try {
        const { data } = await getCurrent()
        setDuty(data)
      } catch {
        // sem plantão aberto, ok
      }
    }
    init()
  }, [])

  async function handleAbrirPlantao() {
    if (!machineSelecionada) {
      setErro('Nenhum equipamento disponível. Contate o administrador.')
      return
    }
    setErro('')
    setLoading(true)
    try {
      const { data } = await openDuty(machineSelecionada)
      setDuty(data)
    } catch (err) {
      setErro(err.response?.data?.detail || 'Erro ao abrir plantão.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmitColeta(e) {
    e.preventDefault()
    const qtd = parseInt(quantidade)
    if (isNaN(qtd) || qtd < 0) return
    setErro('')

    if (qtd === 0) {
      setView('motivo')
      setQuantidade('')
      return
    }

    setLoading(true)
    try {
      await addCollection(duty.id, qtd)
      const { data } = await getCurrent()
      setDuty(data)
      setQuantidade('')
    } catch (err) {
      setErro(err.response?.data?.detail || 'Erro ao registrar coleta.')
    } finally {
      setLoading(false)
    }
  }

  async function handleEnviarMotivo(e) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      await closeDuty(duty.id, motivo || null)
      setView('concluido')
    } catch (err) {
      setErro(err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Erro ao fechar plantão.')
    } finally {
      setLoading(false)
    }
  }

  async function handleFinalizar() {
    if (total === 0) {
      setView('motivo')
      return
    }
    setErro('')
    setLoading(true)
    try {
      await closeDuty(duty.id)
      setView('concluido')
    } catch (err) {
      setErro(err.response?.data?.detail || 'Erro ao finalizar plantão.')
    } finally {
      setLoading(false)
    }
  }

  const machineName = (id) => {
    const m = machines.find(m => m.id === id)
    return m ? `${m.exam_type_name} #${m.id}` : id
  }

  if (view === 'motivo') {
    return (
      <div className="plantao-page">
        <button className="btn-voltar-login" onClick={() => navigate('/')}>&#8592; Voltar ao login</button>
        <div className="plantao-content">
          <h1 className="plantao-title">Qual o motivo de ter 0 exames no plantão?</h1>
          <form onSubmit={handleEnviarMotivo} className="motivo-form">
            {problems.map(p => (
              <label key={p.id} className="motivo-opcao">
                <input
                  type="radio"
                  name="motivo"
                  value={p.id}
                  checked={motivo === p.id}
                  onChange={() => setMotivo(p.id)}
                />
                <span>{p.name}</span>
              </label>
            ))}
            {erro && <p className="login-erro">{erro}</p>}
            <button type="submit" className="btn-enviar-motivo" disabled={!motivo || loading}>
              {loading ? 'Enviando...' : 'Enviar'}
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

      {!duty ? (
        <div className="plantao-content">
          <h1 className="plantao-title">Abrir Plantão</h1>
          <div className="plantao-dropdowns">
            <div className="dropdown-section">
              <p className="dropdown-label">Equipamento</p>
              <div className="dropdown">
                <button
                  className="dropdown-selected"
                  onClick={() => setMachineAberta(!machineAberta)}
                >
                  {machineSelecionada ? machineName(machineSelecionada) : 'Selecione...'} <span>{machineAberta ? '∧' : '∨'}</span>
                </button>
                {machineAberta && (
                  <div className="dropdown-list">
                    {machines.filter(m => m.id !== machineSelecionada).map(m => (
                      <button key={m.id} onClick={() => { setMachineSelecionada(m.id); setMachineAberta(false) }}>
                        {m.exam_type_name} #{m.id}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {erro && <p className="login-erro">{erro}</p>}
          <button className="btn-finalizar" onClick={handleAbrirPlantao} disabled={loading || machines.length === 0}>
            {loading ? 'Abrindo...' : 'Iniciar Plantão'}
          </button>
        </div>
      ) : (
        <>
          <div className="plantao-dropdowns">
            <div className="dropdown-section">
              <p className="dropdown-label">Equipamento</p>
              <div className="dropdown">
                <button className="dropdown-selected" disabled>
                  {duty.machine_name}
                </button>
              </div>
            </div>
          </div>

          <div className="plantao-content">
            <h1 className="plantao-title">Quantidade de Exames Feitos no Plantão</h1>

            <form onSubmit={handleSubmitColeta} className="quantidade-form">
              <div className="quantidade-input-wrapper">
                <input
                  type="number"
                  placeholder="Insira a quantidade de exames feitos..."
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  min="0"
                />
                <button type="submit" className="btn-arrow" disabled={loading}>&#8594;</button>
              </div>
            </form>

            {erro && <p className="login-erro">{erro}</p>}

            <div className="historico">
              {historicoExibido.map((item) => (
                <p key={item.id}>
                  {new Date(item.collection_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {item.count} {item.count === 1 ? 'exame inserido.' : 'exames inseridos.'}
                </p>
              ))}
              {collections.length > 4 && (
                <a href="#" onClick={(e) => { e.preventDefault(); setMostrarTudo(!mostrarTudo) }}>
                  {mostrarTudo ? 'Ver menos' : 'Ver histórico completo'}
                </a>
              )}
            </div>

            <p className="plantao-total">
              Total registrado até o momento: <strong>{total}</strong>
            </p>

            <button className="btn-finalizar" onClick={handleFinalizar} disabled={loading}>
              {loading ? 'Finalizando...' : 'Finalizar Plantão'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Plantao
