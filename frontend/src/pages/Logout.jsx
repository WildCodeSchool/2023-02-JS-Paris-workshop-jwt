import api from "../services/api";

function Logout() {
  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO
    api.get("/users/logout");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type='submit' value='Disconnect' />
    </form>
  );
};

export default Logout;
