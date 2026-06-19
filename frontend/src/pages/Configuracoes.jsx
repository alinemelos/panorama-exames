import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import './styles/Configuracoes.css'
import {
  listUsers, deleteUser,
  listAccessRequests, approveAccessRequest, rejectAccessRequest,
  listResetRequests, approveResetRequest, rejectResetRequest,
} from '../services/settings'
import {
  listMachines, createMachine, updateMachine, deleteMachine,
  listExams, createExam,
} from '../services/machines'

const NOVO_EXAME = '__novo__'

function formatCost(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function ApprovalModal({ title, onConfirm, onClose }) {
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleConfirmar() {
    setErro('')
    if (senha.length < 8) {
      setErro('A senha deve ter ao menos 8 caracteres.')
      return
    }
    if (senha !== confirmacao) {
      setErro('As senhas não coincidem.')
      return
    }
    setLoading(true)
    try {
      await onConfirm(senha, confirmacao)
    } catch (err) {
      const data = err.response?.data
      const msg = data?.non_field_errors?.[0] || data?.password?.[0] || data?.detail || 'Erro ao aprovar.'
      setErro(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{title}</h2>

        <div className="field-group">
          <label htmlFor="modal-senha">Senha</label>
          <input
            id="modal-senha"
            type="password"
            placeholder="Insira a senha..."
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label htmlFor="modal-confirmacao">Repita a senha</label>
          <input
            id="modal-confirmacao"
            type="password"
            placeholder="Insira a senha novamente..."
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
          />
        </div>

        {erro && <p className="login-erro">{erro}</p>}

        <div className="modal-actions">
          <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button type="button" className="btn-enviar" disabled={loading} onClick={handleConfirmar}>
            {loading ? 'Aprovando...' : 'Aprovar'}
          </button>
        </div>
      </div>
    </div>
  )
}

function MachineFormModal({ initialData, exams, onSaved, onClose }) {
  const isEdit = Boolean(initialData)
  const [name, setName] = useState(initialData?.name || '')
  const [examType, setExamType] = useState(initialData ? String(initialData.exam_type) : '')
  const [novoExame, setNovoExame] = useState('')
  const [cost, setCost] = useState(initialData?.cost ?? '')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSalvar() {
    setErro('')
    if (!name.trim()) {
      setErro('Informe o ID do equipamento.')
      return
    }
    if (!examType) {
      setErro('Selecione o tipo de exame.')
      return
    }
    if (examType === NOVO_EXAME && !novoExame.trim()) {
      setErro('Informe o nome do novo tipo de exame.')
      return
    }
    if (!cost || Number(cost) <= 0) {
      setErro('Informe um valor válido.')
      return
    }
    setLoading(true)
    try {
      let examId = examType
      if (examType === NOVO_EXAME) {
        const res = await createExam(novoExame.trim())
        examId = res.data.id
      }
      const payload = { name: name.trim(), exam_type: examId, cost: Number(cost) }
      if (isEdit) {
        await updateMachine(initialData.id, payload)
      } else {
        await createMachine(payload)
      }
      onSaved()
    } catch (err) {
      const data = err.response?.data
      const msg = data?.name?.[0] || data?.exam_type?.[0] || data?.cost?.[0] || data?.detail || 'Erro ao salvar máquina.'
      setErro(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{isEdit ? 'Editar Máquina' : 'Nova Máquina'}</h2>

        <div className="field-group">
          <label htmlFor="machine-exam">Tipo de Exame</label>
          <select id="machine-exam" value={examType} onChange={(e) => setExamType(e.target.value)}>
            <option value="" disabled>Selecione...</option>
            {exams.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
            <option value={NOVO_EXAME}>+ Criar novo tipo de exame</option>
          </select>
        </div>

        {examType === NOVO_EXAME && (
          <div className="field-group">
            <label htmlFor="machine-novo-exame">Novo tipo de exame</label>
            <input
              id="machine-novo-exame"
              type="text"
              placeholder="Ex: Ressonância"
              value={novoExame}
              onChange={(e) => setNovoExame(e.target.value)}
            />
          </div>
        )}

        <div className="field-group">
          <label htmlFor="machine-name">ID do equipamento</label>
          <input
            id="machine-name"
            type="text"
            placeholder="Ex: HCPE-3270"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label htmlFor="machine-cost">Valor do exame</label>
          <input
            id="machine-cost"
            type="number"
            step="0.01"
            min="0"
            placeholder="Ex: 321.57"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </div>

        {erro && <p className="login-erro">{erro}</p>}

        <div className="modal-actions">
          <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button type="button" className="btn-enviar" disabled={loading} onClick={handleSalvar}>
            {loading ? 'Salvando...' : isEdit ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteMachineModal({ machine, onDeleted, onClose }) {
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleDeletar() {
    setErro('')
    setLoading(true)
    try {
      await deleteMachine(machine.id)
      onDeleted()
    } catch (err) {
      setErro(err.response?.data?.detail || 'Erro ao deletar máquina.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Deletar Máquina</h2>
        <p>Tem certeza que deseja deletar a máquina {machine.name}?</p>

        {erro && <p className="login-erro">{erro}</p>}

        <div className="modal-actions">
          <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button type="button" className="btn-enviar" disabled={loading} onClick={handleDeletar}>
            {loading ? 'Deletando...' : 'Deletar'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Configuracoes() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = usuario.role === 'administrator'
  const [users, setUsers] = useState([])
  const [accessRequests, setAccessRequests] = useState([])
  const [resetRequests, setResetRequests] = useState([])
  const [machines, setMachines] = useState([])
  const [exams, setExams] = useState([])
  const [erro, setErro] = useState('')
  const [modal, setModal] = useState(null)
  const [machineModal, setMachineModal] = useState(null)
  const [deleteMachineTarget, setDeleteMachineTarget] = useState(null)

  async function loadAll() {
    try {
      const [uRes, aRes, rRes, mRes, exRes] = await Promise.all([
        listUsers(), listAccessRequests(), listResetRequests(), listMachines(), listExams(),
      ])
      setUsers(uRes.data.filter(u => u.is_active))
      setAccessRequests(aRes.data)
      setResetRequests(rRes.data)
      setMachines(mRes.data)
      setExams(exRes.data)
    } catch {
      setErro('Erro ao carregar usuários.')
    }
  }

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard', { replace: true })
      return
    }
    loadAll()
  }, [])

  async function handleRejectAccess(id) {
    if (!window.confirm('Tem certeza que deseja rejeitar esta solicitação de acesso?')) return
    await rejectAccessRequest(id)
    loadAll()
  }

  async function handleRejectReset(id) {
    if (!window.confirm('Tem certeza que deseja rejeitar esta solicitação de redefinição de senha?')) return
    await rejectResetRequest(id)
    loadAll()
  }

  async function handleDeleteUser(id) {
    if (!window.confirm('Tem certeza que deseja deletar este usuário?')) return
    await deleteUser(id)
    loadAll()
  }

  if (!isAdmin) return null

  return (
    <div className="configuracoes-page">
      <header className="configuracoes-header">
        <h1 className="configuracoes-title">Configurações</h1>
        <button className="btn-fechar" title="Fechar" onClick={() => navigate('/dashboard')}><CloseIcon fontSize="small" /></button>
      </header>

      {erro && <p className="login-erro">{erro}</p>}

      <div className="configuracoes-card">
        <h2 className="configuracoes-card-title">Usuários</h2>
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {accessRequests.map(u => (
              <tr key={`access-${u.id}`}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td className="usuarios-acoes">
                  <button
                    className="icon-btn icon-aprovar"
                    title="Aprovar"
                    onClick={() => setModal({
                      title: `Aprovar acesso de ${u.name}`,
                      confirm: async (senha, confirmacao) => {
                        await approveAccessRequest(u.id, senha, confirmacao)
                        setModal(null)
                        loadAll()
                      },
                    })}
                  ><CheckIcon fontSize="small" /></button>
                  <button className="icon-btn icon-rejeitar" title="Rejeitar" onClick={() => handleRejectAccess(u.id)}><CloseIcon fontSize="small" /></button>
                </td>
              </tr>
            ))}
            {users.map(u => (
              <tr key={`user-${u.id}`}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td className="usuarios-acoes">
                  <button className="icon-btn icon-deletar" title="Deletar" onClick={() => handleDeleteUser(u.id)}><DeleteOutlineIcon fontSize="small" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {accessRequests.length === 0 && users.length === 0 && (
          <p className="texto-vazio">Nenhum usuário cadastrado.</p>
        )}
      </div>

      {resetRequests.length > 0 && (
        <div className="configuracoes-card">
          <h2 className="configuracoes-card-title">Redefinições de Senha Pendentes</h2>
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {resetRequests.map(u => (
                <tr key={`reset-${u.id}`}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td className="usuarios-acoes">
                    <button
                      className="icon-btn icon-aprovar"
                      title="Aprovar"
                      onClick={() => setModal({
                        title: `Definir nova senha de ${u.name}`,
                        confirm: async (senha, confirmacao) => {
                          await approveResetRequest(u.id, senha, confirmacao)
                          setModal(null)
                          loadAll()
                        },
                      })}
                    ><CheckIcon fontSize="small" /></button>
                    <button className="icon-btn icon-rejeitar" title="Rejeitar" onClick={() => handleRejectReset(u.id)}><CloseIcon fontSize="small" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="configuracoes-card">
        <h2 className="configuracoes-card-title">Maquinários</h2>
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Tipo do Exame</th>
              <th>ID do equipamento</th>
              <th>Valor do exame</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {machines.map(m => (
              <tr key={`machine-${m.id}`}>
                <td>{m.exam_type_name}</td>
                <td>{m.name}</td>
                <td>{formatCost(m.cost)}</td>
                <td className="usuarios-acoes">
                  <button className="icon-btn icon-editar" title="Editar" onClick={() => setMachineModal({ machine: m })}>
                    <EditOutlinedIcon fontSize="small" />
                  </button>
                  <button className="icon-btn icon-deletar" title="Deletar" onClick={() => setDeleteMachineTarget(m)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {machines.length === 0 && (
          <p className="texto-vazio">Nenhuma máquina cadastrada.</p>
        )}
        <button className="icon-btn icon-adicionar" title="Adicionar máquina" onClick={() => setMachineModal({ machine: null })}>
          <AddCircleOutlineIcon />
        </button>
      </div>

      {modal && (
        <ApprovalModal
          title={modal.title}
          onConfirm={modal.confirm}
          onClose={() => setModal(null)}
        />
      )}

      {machineModal && (
        <MachineFormModal
          initialData={machineModal.machine}
          exams={exams}
          onSaved={() => { setMachineModal(null); loadAll() }}
          onClose={() => setMachineModal(null)}
        />
      )}

      {deleteMachineTarget && (
        <DeleteMachineModal
          machine={deleteMachineTarget}
          onDeleted={() => { setDeleteMachineTarget(null); loadAll() }}
          onClose={() => setDeleteMachineTarget(null)}
        />
      )}
    </div>
  )
}

export default Configuracoes
