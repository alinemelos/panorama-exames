import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend,
  ReferenceLine, ResponsiveContainer
} from 'recharts'
import './Dashboard.css'

const examePorMes = [
  { mes: 'JAN', quantidade: 45 },
  { mes: 'FEV', quantidade: 52 },
  { mes: 'MAR', quantidade: 61 },
  { mes: 'ABR', quantidade: 58 },
  { mes: 'MAI', quantidade: 78 },
  { mes: 'JUN', quantidade: 95 },
]

const problemasPorMes = [
  { mes: 'JAN', manutencao: 8, infraestrutura: 3 },
  { mes: 'FEV', manutencao: 4, infraestrutura: 2 },
  { mes: 'MAR', manutencao: 3, infraestrutura: 4 },
  { mes: 'ABR', manutencao: 5, infraestrutura: 3 },
  { mes: 'MAI', manutencao: 4, infraestrutura: 5 },
  { mes: 'JUN', manutencao: 3, infraestrutura: 4 },
]

const EXAMES_OPCOES = ['Tomografia', 'Raio X', 'Ultrasonografia', 'Ressonância', 'Mamografia']
const EQUIPAMENTOS_OPCOES = ['-TODOS-', 'HCPE-3270', 'HCPE-3271', 'HCPE-3272', 'HCPE-3273']

function Dashboard() {
  const navigate = useNavigate()
  const [dataInicio, setDataInicio] = useState('2026-01-01')
  const [dataFim, setDataFim] = useState('2026-05-25')
  const [exame, setExame] = useState('Tomografia')
  const [equipamento, setEquipamento] = useState('-TODOS-')

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
            <select value={exame} onChange={(e) => setExame(e.target.value)}>
              {EXAMES_OPCOES.map(op => <option key={op}>{op}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">Equipamento</span>
            <select value={equipamento} onChange={(e) => setEquipamento(e.target.value)}>
              {EQUIPAMENTOS_OPCOES.map(op => <option key={op}>{op}</option>)}
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
          <p className="faturamento-valor">R$1.624.255,12</p>
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