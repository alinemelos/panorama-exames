import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { requestReset, resetPassword } from '../services/auth'

function RedefinirSenha() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [email, setEmail] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRequestReset(e) {
    e.preventDefault()
    setErro('')
    setMensagem('')
    setLoading(true)
    try {
      await requestReset(email)
      setMensagem('Instruções enviadas. Verifique o terminal do servidor para obter o token.')
    } catch (err) {
      const data = err.response?.data
      const msg = data?.email?.[0] || data?.detail || 'Erro ao solicitar redefinição.'
      setErro(msg)
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault()
    setErro('')
    if (novaSenha !== confirmacao) {
      setErro('As senhas não coincidem.')
      return
    }
    setLoading(true)
    try {
      await resetPassword(token, novaSenha, confirmacao)
      navigate('/', { replace: true })
    } catch (err) {
      const data = err.response?.data
      const msg = data?.non_field_errors?.[0] || data?.detail || 'Erro ao redefinir senha.'
      setErro(msg)
    } finally {
      setLoading(false)
    }
  }

  if (token) {
    return (
      <div className="login-wrapper">
        <div className="login-box">
          <h1 className="login-title">Nova Senha</h1>

          <form onSubmit={handleResetPassword} className="login-form">
            <div className="field-group">
              <label htmlFor="novaSenha">Nova Senha</label>
              <input
                id="novaSenha"
                type="password"
                placeholder="Insira sua nova senha..."
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
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
              {loading ? 'Salvando...' : 'Redefinir Senha'}
            </button>
          </form>

          <Link to="/" className="back-link">Voltar para o login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1 className="login-title">Redefinir Senha</h1>

        <form onSubmit={handleRequestReset} className="login-form">
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

          {erro && <p className="login-erro">{erro}</p>}
          {mensagem && <p className="login-sucesso">{mensagem}</p>}

          <button type="submit" className="btn-enviar" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>

        <Link to="/" className="back-link">Voltar para o login</Link>
      </div>
    </div>
  )
}

export default RedefinirSenha