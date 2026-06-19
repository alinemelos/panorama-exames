import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend,
  ReferenceLine, ResponsiveContainer
} from 'recharts'
import DatePicker, { registerLocale } from 'react-datepicker'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'
import './styles/Dashboard.css'
import { getDashboard } from '../services/dashboard'
import { listMachines } from '../services/machines'
import api from '../services/api'

registerLocale('pt-BR', ptBR)

const CORES_PROBLEMAS = ['#1a6ec8', '#93c5fd', '#1e40af', '#bfdbfe']
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function anosDisponiveis() {
  const anoAtual = new Date().getFullYear()
  const anos = []
  for (let ano = anoAtual - 5; ano <= anoAtual + 1; ano++) anos.push(ano)
  return anos
}

function CalendarioHeader({ date, decreaseMonth, increaseMonth, changeMonth, changeYear }) {
  return (
    <div className="datepicker-header">
      <button type="button" className="datepicker-nav" onClick={decreaseMonth}>&#8249;</button>
      <select className="datepicker-select-mes" value={date.getMonth()} onChange={(e) => changeMonth(Number(e.target.value))}>
        {MESES.map((mes, i) => <option key={mes} value={i}>{mes}</option>)}
      </select>
      <select className="datepicker-select-ano" value={date.getFullYear()} onChange={(e) => changeYear(Number(e.target.value))}>
        {anosDisponiveis().map(ano => <option key={ano} value={ano}>{ano}</option>)}
      </select>
      <button type="button" className="datepicker-nav" onClick={increaseMonth}>&#8250;</button>
    </div>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = usuario.role === 'administrator'
  const [dataInicio, setDataInicio] = useState(new Date(2026, 0, 1))
  const [dataFim, setDataFim] = useState(new Date())
  const [examId, setExamId] = useState('')
  const [machineId, setMachineId] = useState('')
  const [exames, setExames] = useState([])
  const [machines, setMachines] = useState([])
  const [examePorMes, setExamePorMes] = useState([])
  const [problemasPorMes, setProblemasPorMes] = useState([])
  const [problemasTipos, setProblemasTipos] = useState([])
  const [faturamento, setFaturamento] = useState(0)
  const [totalExames, setTotalExames] = useState(0)
  const [exemesPorMaquina, setExamesPorMaquina] = useState([])

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
    if (machineId && examId) {
      const stillValid = machines.some(
        m => String(m.id) === machineId && m.exam_type === Number(examId)
      )
      if (!stillValid) setMachineId('')
    }
  }, [examId, machines])

  const filteredMachines = examId
    ? machines.filter(m => m.exam_type === Number(examId))
    : machines

  useEffect(() => {
    async function loadDashboard() {
      const params = { date_from: format(dataInicio, 'yyyy-MM-dd'), date_to: format(dataFim, 'yyyy-MM-dd') }
      if (examId) params.exam_id = examId
      if (machineId) params.machine_id = machineId
      try {
        const { data } = await getDashboard(params)
        setExamePorMes(data.exames_por_mes)
        setProblemasPorMes(data.problemas_por_mes)
        setProblemasTipos(data.problemas_tipos)
        setFaturamento(data.faturamento)
        setTotalExames(data.total_exames)
        setExamesPorMaquina(data.exames_por_maquina)
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
              <DatePicker
                selected={dataInicio}
                onChange={setDataInicio}
                maxDate={dataFim}
                dateFormat="dd/MM/yyyy"
                locale="pt-BR"
                renderCustomHeader={CalendarioHeader}
              />
              <span>a</span>
              <DatePicker
                selected={dataFim}
                onChange={setDataFim}
                minDate={dataInicio}
                dateFormat="dd/MM/yyyy"
                locale="pt-BR"
                renderCustomHeader={CalendarioHeader}
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
              {filteredMachines.map(m => <option key={m.id} value={m.id}>{m.exam_type_name} #{m.id}</option>)}
            </select>
          </div>

          {isAdmin && (
            <button className="btn-settings" title="Configurações" onClick={() => navigate('/configuracoes')}>&#9881;</button>
          )}
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
              {problemasTipos.map((tipo, i) => (
                <Bar
                  key={tipo.slug}
                  dataKey={tipo.slug}
                  name={tipo.name}
                  fill={CORES_PROBLEMAS[i % CORES_PROBLEMAS.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-row2">
          <div className="faturamento-card dashboard-row2-card">
            <p className="faturamento-label">Total de Exames</p>
            <p className="faturamento-valor">{totalExames.toLocaleString('pt-BR')}</p>
          </div>

          <div className="chart-card dashboard-row2-card">
            <p className="chart-title">Comparação de Máquinas</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={exemesPorMaquina}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius: outerR, percent }) => {
                    const RADIAN = Math.PI / 180
                    const radius = innerRadius + (outerR - innerRadius) * 0.6
                    const x = cx + radius * Math.cos(-midAngle * RADIAN)
                    const y = cy + radius * Math.sin(-midAngle * RADIAN)
                    return (
                      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={12}>
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    )
                  }}
                >
                  {exemesPorMaquina.map((entry, i) => (
                    <Cell key={entry.machine_id} fill={CORES_PROBLEMAS[i % CORES_PROBLEMAS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard