import { useState } from "react";
import api from "../services/api";
import {useNavigate} from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        await api.post("/users/login", { email, password });
        navigate("/users");
      } catch (error) {
        console.error(error);
      }
    }
  }


  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
      <input type="submit"></input>
    </form>
  );
}

export default Login;
