import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useRole = () => {
    const { user } = useContext(AuthContext);
    return {
        isAdmin: user?.role === "admin",
        isEmployer: user?.role === "employer",
        isJobseeker: user?.role === "jobseeker",
    };
};