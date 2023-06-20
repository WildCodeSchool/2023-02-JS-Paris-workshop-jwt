import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const url = import.meta.env.VITE_BACKEND_URL + '/users/login';
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      axios
        .post(
          url,
          {
            email,
            password,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => res.data)
        .then((data) => {
          console.log(data);
          alert('success logged in')
        })
        .catch((err) => alert(err));
    } else {
      alert('Please specify both email and password');
    }
  }

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
