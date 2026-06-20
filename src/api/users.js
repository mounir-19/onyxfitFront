import api from "./axios";

export const getUsers = async () => {
    return api.get("/admin/users");
};
