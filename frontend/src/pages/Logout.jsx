import axios from "axios"

function Logout() {
  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/logout`, {
      withCredentials: true,
    }).then( (response) => {
      console.log(response.data);
      alert("Disconnected successfully");
    })
    .catch( (error) => {
      console.log(error);
      if (error.response.status === 401) {
        alert("You're not authenticated")
      }

    })

  };

  return (
    <form onSubmit={handleSubmit}>
      <input type='submit' value='Disconnect' />
    </form>
  );
};

export default Logout;
