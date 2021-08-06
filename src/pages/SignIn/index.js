import { useState } from 'react';
import { Link } from 'react-router-dom';

import './signin.css';
import logo from '../../assets/logo.png';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    // não recarrega a pagina
    e.preventDefault();

  }

  return (
    <div className="container-center">
      <div className="login">

          <div className="logo-area">
            <img src={logo} alt="Logo" />
          </div>

          <form onSubmit={ handleSubmit }>
            <h1>Entrar</h1>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@email.com" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" />
            <button type="submit">Acessar</button>
          </form>

          <Link to="/register">Criar uma conta</Link>
      </div>
    </div>
  );
}

export default SignIn;
  