import { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if(!email || !password) {
      alert('Please specify both email and password')
    } else {
      console.log(email, password);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type='email'
        name='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type='password'
        name='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <input type='submit' value='Login' />
    </form>
  );
}

export default Login;
