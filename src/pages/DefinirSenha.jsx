import { useState } from 'react'
import { Link } from 'react-router-dom'

function DefinirSenha() {
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (senha !== confirmacao) {
      alert('As senhas não coincidem.')
      return
    }
    console.log({ senha })
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

          <button type="submit" className="btn-enviar">Enviar</button>
        </form>

        <Link to="/" className="back-link">Voltar para o login</Link>
      </div>
    </div>
  )
}

export default DefinirSenha