import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

export function useAuth() {
    const navigate = useNavigate()
    const { isAuthenticated } = useSelector((state: any) => state.auth)

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }

        console.log(isAuthenticated, 'Authenticated')
    }, [isAuthenticated, navigate])
}

export function useNotAuth() {
    const navigate = useNavigate()
    const { isAuthenticated } = useSelector((state: any) => state.auth)

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth/login', { replace: true });
        }
    }, [isAuthenticated, navigate])
}