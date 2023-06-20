import { useState, useEffect } from "react";
import { getAllUsers } from "../services/user";
import { useNavigate } from "react-router-dom"


function Users() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    try {
      const result = await getAllUsers();
      setUsers(result.data);
    } catch (error) {
      console.log(error);
        if (error.response.status === 401 || error.response.status === 403)
          navigate("/login");
    }
      
  }

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
