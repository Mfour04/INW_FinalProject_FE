import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext/AuthProvider.tsx";

export const useAuth = () => {
    return useContext(AuthContext);
};
