import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/verify');
                if (!response.ok) {
                    throw new Error('Unauthorized');
                }
            } catch (error) {
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    return <>{children}</>;
};

export default AuthGuard;