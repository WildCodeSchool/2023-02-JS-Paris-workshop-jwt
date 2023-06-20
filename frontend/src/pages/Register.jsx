import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const url = import.meta.env.VITE_BACKEND_URL + '/users/register';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password && role) {
      axios
        .post(url, {
          email,
          password,
          role,
        })
        .then((res) => res.data)
        .then((data) => {
          alert('User created');
        });
    } else {
      alert('Please specify email, password and role');
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
      <select
        name='role'
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value=''>Select a role</option>
        <option value='ROLE_USER'>User</option>
        <option value='ROLE_ADMIN'>Admin</option>
      </select>
      <br />
      <input type='submit' value='Register' />
    </form>
  );
}

export default Register;
