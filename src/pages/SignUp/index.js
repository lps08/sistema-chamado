import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

import './signup.css';
import logo from '../../assets/logo.png';

function SignUp() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signUp } = useContext(AuthContext);

  function handleSubmit(e) {
    // não recarrega a pagina
    e.preventDefault();

    if (nome !== '' && email !== '' && password !== '') {
      signUp(email, password, nome)
    }

  }

  return (
    <div className="container-center">
      <div className="login">

          <div className="logo-area">
            <img src={logo} alt="Logo" />
          </div>

          <form onSubmit={ handleSubmit }>
            <h1>Cadastrar</h1>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@email.com" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" />
            <button type="submit">Cadastrar</button>
          </form>

          <Link to="/">Já tem uma conta?</Link>
      </div>
    </div>
  );
}

export default SignUp;
  