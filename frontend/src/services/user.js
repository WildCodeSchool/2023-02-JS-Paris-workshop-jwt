import api from "./api";

const getAllUsers = async () => {
    const users = await api.get("/users");
    return users;
}

export {getAllUsers};