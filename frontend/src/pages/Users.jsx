import { useState, useEffect } from "react";
import axios from "axios"

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
      withCredentials : true
    })
  .then( (response) => {
    // en cas de réussite de la requête
    // console.log("RESPONSEDATA" , response.data)
    // response.data
    setUsers(response.data)
  })
  .catch((error) => {
    // en cas d’échec de la requête
    console.log(error);
    if (error.response.status === 401) {
      alert("You're not authenticated")
    }
    if (error.response.status === 403) {
      alert("You're not authorized")
    }
  })
  }, []);

  return (
    <div>
      <p>Users List</p>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            Email: {user.email} - Role: {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
