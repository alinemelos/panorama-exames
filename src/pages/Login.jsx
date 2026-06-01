import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (email === 'enfermagem') {
      navigate('/plantao')
    } else if (email === 'administrador') {
      navigate('/dashboard')
    } else {
      setErro('Usuário não encontrado.')
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1 className="login-title">Acessar Panorama de Exames</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              placeholder="Insira seu email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="Insira sua senha..."
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <Link to="/redefinir-senha" className="forgot-link">
              Esqueci a senha
            </Link>
          </div>

          {erro && <p className="login-erro">{erro}</p>}

          <Link to="/solicitar-acesso" className="request-access">
            Solicitar acesso
          </Link>

          <button type="submit" className="btn-enviar">Entrar</button>
        </form>
      </div>
    </div>
  )
}

export default Login