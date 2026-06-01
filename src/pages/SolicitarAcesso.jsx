import { useState } from 'react'
import { Link } from 'react-router-dom'

function SolicitarAcesso() {
  const [email, setEmail] = useState('')
  const [nome, setNome] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    console.log({ email, nome })
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

          <button type="submit" className="btn-enviar">Enviar</button>
        </form>

        <Link to="/" className="back-link">Voltar para o login</Link>
      </div>
    </div>
  )
}

export default SolicitarAcesso