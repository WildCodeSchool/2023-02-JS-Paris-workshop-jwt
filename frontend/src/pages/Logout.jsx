import axios from 'axios';

function Logout() {
  const url = import.meta.env.VITE_BACKEND_URL + '/users/logout';

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .get(url, {
        withCredentials: true,
      })
      .then(() => alert('Disconnected succesfully'))
      .catch(err => {
        if(err.response.status === 401) {
          alert('You are already disconnected')
        }
      })
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type='submit' value='Disconnect' />
    </form>
  );
}

export default Logout;
