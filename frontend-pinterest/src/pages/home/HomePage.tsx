import {useLoginMutation} from "@/services/accountService.ts";
import {useApiError} from "@/hooks/useApiError.ts";
import Button from "@/components/button/Button.tsx";


const HomePage = () => {
    const [login, { error }] = useLoginMutation();
    useApiError(error as any);

    const handleTest = async () => {
        await login({ email: "", password: "" });
    };

    return (
        <div>
            <div className="app">
                <h1>SASS працює!</h1>
            </div>
            <h1>TestingPage</h1>
            <Button label="Login" onClick={handleTest}></Button>
        </div>
    );
};

export default HomePage;