import { useState } from 'react'
import { Link } from 'react-router-dom'
import { requestAccess } from '../services/auth'

function SolicitarAcesso() {
  const [email, setEmail] = useState('')
  const [nome, setNome] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setMensagem('')
    setLoading(true)
    try {
      await requestAccess(email, nome)
      setMensagem('Solicitação enviada! Aguarde aprovação do administrador.')
      setEmail('')
      setNome('')
    } catch (err) {
      const data = err.response?.data
      const msg = data?.email?.[0] || data?.detail || 'Erro ao enviar solicitação.'
      setErro(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1 className="login-title">Solicitar Acesso</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Insira seu email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field-group">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              type="text"
              placeholder="Insira seu nome..."
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          {erro && <p className="login-erro">{erro}</p>}
          {mensagem && <p style={{ color: 'green', fontSize: 14 }}>{mensagem}</p>}

          <button type="submit" className="btn-enviar" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>

        <Link to="/" className="back-link">Voltar para o login</Link>
      </div>
    </div>
  )
}

export default SolicitarAcesso