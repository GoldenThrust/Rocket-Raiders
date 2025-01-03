import { useEffect, type SetStateAction } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { RootState } from "~/store";
import { verifyAdmin } from "~/utils/action";

export function useAuth() {
    const navigate = useNavigate()
    const { isAuthenticated } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate])
}

export function useNotAuth() {
    const navigate = useNavigate()
    const { isAuthenticated } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth/login', { replace: true });
        }
    }, [isAuthenticated, navigate])
}

export function useNotAdminAuth(setData: React.Dispatch<any>) {
    const navigate = useNavigate()
    
    useEffect(() => {
        const VerifyToken = async ()=> {
            const admin = await verifyAdmin();
            if (!admin) {
                navigate('/auth/admin/login', { replace: true });
            } else {
                setData(admin);
            }
        }

        VerifyToken();
    }, [navigate])
}

export function useAdminAuth() {
    const navigate = useNavigate()
    
    useEffect(() => {
        const VerifyToken = async ()=> {
            const admin = await verifyAdmin();
            if (admin) {
                navigate('/auth/admin/', { replace: true });
            }
        }

        VerifyToken();
    }, [navigate])
}