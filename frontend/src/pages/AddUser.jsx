import { useState } from "react"
import axios from "axios"

function AddUser() {
  // const [email, setEmail] = useState("")
  // const [password, setPassword] = useState("")
  const [signIn, setSignIn] = useState({email : "", password : ""})
  




  const handleSubmit = (event) => {
    event.preventDefault()
    if (signIn.email === "" || signIn.password === "") {
      alert("Please specify both email and password")
    } else {
      console.log("hey", import.meta.env.VITE_BACKEND_URL);
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/register`, {
        email: signIn.email,
        password: signIn.password
      }, {
        withCredentials: true,
      }).then( (response) => {
        console.log(response.data);
        alert("Successfully sign in");
      })
      .catch( (error) => {
        console.log(error);
        alert(error.response.data?.error);

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
      value={signIn.email}
      onChange={(e) => setSignIn({ ...signIn, email : e.target.value })}
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
      value={signIn.password}
      onChange={(e) => setSignIn({ ...signIn, password : e.target.value })}
    />
  </label>
  <br />
  <input type='submit' value='Sign in' />
</form>
  )
}

export default AddUser;
