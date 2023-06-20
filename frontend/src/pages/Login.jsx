import { useState } from "react"
import axios from "axios"

function Login() {
  // const [email, setEmail] = useState("")
  // const [password, setPassword] = useState("")
  const [login, setLogin] = useState({email : "", password : ""})




  const handleSubmit = (event) => {
    event.preventDefault()
    if (login.email === "" || login.password === "") {
      alert("Please specify both email and password")
    } else {
      console.log("hey", import.meta.env.VITE_BACKEND_URL);
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
        email: login.email,
        password: login.password
      }, {
        withCredentials: true,
      }).then( (response) => {
        console.log(response.data);
        alert("Successfully logged in");
      })
      .catch( (error) => {
        console.log(error);
        alert(err.response.data.error);

      });
      
    }


  }

  return (
  <form onSubmit={handleSubmit}>
  <label htmlFor='email'>
    Email:
    <input
      type='email'
      name='email'
      id='email'
      placeholder='test@blabla.com'
      value={login.email}
      onChange={(e) => setLogin({ ...login, email : e.target.value })}
    />
  </label>
  <br />
  <label htmlFor='password'>
    Password:
    <input
      type='password'
      name='password'
      id='password'
      placeholder='***********'
      value={login.password}
      onChange={(e) => setLogin({ ...login, password : e.target.value })}
    />
  </label>
  <br />
  <input type='submit' value='Login' />
</form>
  )
}

export default Login;
