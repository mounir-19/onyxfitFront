import api from "./axios";

export const getAdmins = async () => {
    return api.get("/admin/admins");
};

export const createAdmin = async (adminData) => {
    return api.post("/admin/createAdmin", adminData);
};

export const deleteAdmin = async (id) => {
    return api.delete(`/admin/admins/${id}`);
};

export const updateAdmin = async (id, adminData) => {
    return api.patch(`/admin/admins/${id}`, adminData);
};

