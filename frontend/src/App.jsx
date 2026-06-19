import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import SolicitarAcesso from './pages/SolicitarAcesso'
import DefinirSenha from './pages/DefinirSenha'
import RedefinirSenha from './pages/RedefinirSenha'
import Plantao from './pages/Plantao'
import Dashboard from './pages/Dashboard'
import Configuracoes from './pages/Configuracoes'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/solicitar-acesso" element={<SolicitarAcesso />} />
        <Route path="/definir-senha" element={<DefinirSenha />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route path="/plantao" element={<Plantao />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App