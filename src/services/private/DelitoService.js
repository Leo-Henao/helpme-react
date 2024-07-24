import { axiosConfig } from "../../config/axiosConfig";

const headers = {
    'Content-Type': 'application/json',
};

export const DelitoService = {
    addDelito: async (delito) => {
        const url = "/delitos";
        return await axiosConfig.post(url, delito, {
            headers
        });
    }
};