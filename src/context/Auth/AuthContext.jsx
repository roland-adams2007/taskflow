import { createContext, useEffect, useState, useRef } from 'react';
import { Cookies } from "react-cookie";
import { decryptData, encryptData } from '../../utils/crypto';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../Alert/UseAlert';
import axiosInstance from '../../api/axiosinstance';


const AuthContext = createContext();

export function AuthProvider({ children }) {
    const { showAlert } = useAlert();
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [user, setUser] = useState(null);
    const fetchedRef = useRef(false);

    function fetchCurrentUser() {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        setLoadingProfile(true);
        axiosInstance.get('/users/current')
            .then(response => {
                const { status, message, data } = response.data;
                if (status != 200) {
                    setUser(null);
                    return;
                }
                setUser(data);
            })
            .catch(error => {
                setUser(null);
                const errRes = error.response?.data || {};
                let message = errRes.message || "Something went wrong. Please try again.";
                showAlert(message, 'error');
            })
            .finally(() => setLoadingProfile(false));
    }
    return (
        <AuthContext.Provider
            value={{
                loadingProfile,
                user,
                fetchCurrentUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext };
