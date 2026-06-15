import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend,
  ReferenceLine, ResponsiveContainer
} from 'recharts'
import './styles/Dashboard.css'
import { getDashboard } from '../services/dashboard'
import { listMachines } from '../services/machines'
import api from '../services/api'

function Dashboard() {
  const navigate = useNavigate()
  const [dataInicio, setDataInicio] = useState('2026-01-01')
  const [dataFim, setDataFim] = useState('2026-12-31')
  const [examId, setExamId] = useState('')
  const [machineId, setMachineId] = useState('')
  const [exames, setExames] = useState([])
  const [machines, setMachines] = useState([])
  const [examePorMes, setExamePorMes] = useState([])
  const [problemasPorMes, setProblemasPorMes] = useState([])
  const [faturamento, setFaturamento] = useState(0)

  useEffect(() => {
    async function loadFilters() {
      const [eRes, mRes] = await Promise.all([
        api.get('/core/exams/'),
        listMachines(),
      ])
      setExames(eRes.data)
      setMachines(mRes.data)
    }
    loadFilters()
  }, [])

  useEffect(() => {
    async function loadDashboard() {
      const params = { date_from: dataInicio, date_to: dataFim }
      if (examId) params.exam_id = examId
      if (machineId) params.machine_id = machineId
      try {
        const { data } = await getDashboard(params)
        setExamePorMes(data.exames_por_mes)
        setProblemasPorMes(data.problemas_por_mes)
        setFaturamento(data.faturamento)
      } catch {
        // usuário pode não ter permissão se não for admin
      }
    }
    loadDashboard()
  }, [dataInicio, dataFim, examId, machineId])

  return (
    <div className="dashboard-page">
      <button className="btn-voltar-login" onClick={() => navigate('/')}>&#8592; Voltar ao login</button>
      <header className="dashboard-header">
        <h1 className="dashboard-title">Panorama de Exames</h1>

        <div className="dashboard-filters">
          <div className="filter-group">
            <span className="filter-label">Período de Análise</span>
            <div className="date-range">
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
              <span>a</span>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Exame</span>
            <select value={examId} onChange={(e) => setExamId(e.target.value)}>
              <option value="">-TODOS-</option>
              {exames.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">Equipamento</span>
            <select value={machineId} onChange={(e) => setMachineId(e.target.value)}>
              <option value="">-TODOS-</option>
              {machines.map(m => <option key={m.id} value={m.id}>{m.exam_type_name} #{m.id}</option>)}
            </select>
          </div>

          <button className="btn-settings" title="Configurações">&#9881;</button>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="chart-card">
          <p className="chart-title">Quantidade de Exames por Mês</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={examePorMes}>
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <ReferenceLine y={70} stroke="#e53e3e" strokeDasharray="4 2" />
              <Line type="monotone" dataKey="quantidade" stroke="#1a6ec8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="faturamento-card">
          <p className="faturamento-label">Faturamento do Período</p>
          <p className="faturamento-valor">
            {faturamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>

        <div className="chart-card">
          <p className="chart-title">Problemas Relatados nas Coletas de Plantões</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={problemasPorMes}>
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="manutencao" name="Equipamento em manutenção" fill="#1a6ec8" />
              <Bar dataKey="infraestrutura" name="Problema de infraestrutura" fill="#93c5fd" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-grid dashboard-grid-bottom">
        <div className="placeholder-card" />
        <div className="placeholder-card" />
        <div className="placeholder-card" />
      </div>
    </div>
  )
}

export default Dashboard