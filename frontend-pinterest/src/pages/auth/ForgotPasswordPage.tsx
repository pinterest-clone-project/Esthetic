import { useNavigate } from "react-router";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm.tsx";

const ForgotPasswordPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-[450px] bg-black dark:bg-white rounded-[20px] px-8 py-8">
                <ForgotPasswordForm
                    onSuccess={(email) => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}
                    onBack={() => navigate("/")}
                />
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
