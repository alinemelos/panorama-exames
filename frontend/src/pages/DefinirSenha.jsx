import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { setPassword } from '../services/auth'

function DefinirSenha() {
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    if (senha !== confirmacao) {
      setErro('As senhas não coincidem.')
      return
    }
    if (!token) {
      setErro('Token inválido. Verifique o link enviado.')
      return
    }
    setLoading(true)
    try {
      await setPassword(token, senha, confirmacao)
      navigate('/', { replace: true })
    } catch (err) {
      const data = err.response?.data
      const msg = data?.non_field_errors?.[0] || data?.detail || 'Erro ao definir senha.'
      setErro(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1 className="login-title">Definir Senha</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="Insira sua senha..."
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div className="field-group">
            <label htmlFor="confirmacao">Repita sua senha</label>
            <input
              id="confirmacao"
              type="password"
              placeholder="Insira sua senha novamente..."
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
            />
          </div>

          {erro && <p className="login-erro">{erro}</p>}

          <button type="submit" className="btn-enviar" disabled={loading}>
            {loading ? 'Salvando...' : 'Enviar'}
          </button>
        </form>

        <Link to="/" className="back-link">Voltar para o login</Link>
      </div>
    </div>
  )
}

export default DefinirSenha