import {useLoginMutation} from "../../services/accountService.ts";
import {useApiError} from "../../hooks/useApiError.ts";


const HomePage = () => {
    const [login, { error }] = useLoginMutation();
    useApiError(error as any);

    const handleTest = async () => {
        await login({ email: "", password: "" });
    };

    return (
        <div>
            <h1>TestingPage</h1>
            <button onClick={handleTest}>Test Login (EN)</button>
        </div>
    );
};

export default HomePage;