import { useNavigate, useSearchParams } from "react-router";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm.tsx";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") ?? "";

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-[450px] bg-black dark:bg-white rounded-[20px] px-8 py-8">
                <ResetPasswordForm
                    email={email}
                    onSuccess={() => navigate("/")}
                    onBack={() => navigate(email ? `/forgot-password` : "/")}
                />
            </div>
        </div>
    );
};

export default ResetPasswordPage;
