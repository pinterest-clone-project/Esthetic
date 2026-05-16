import {useEditProfileMutation, useLoginMutation} from "../../services/accountService.ts";
import {useApiError} from "../../hooks/useApiError.ts";
import {loginStorage} from "../../store/slices/authSlice.ts";
import {useAppDispatch} from "../../store";


const HomePage = () => {
    const dispatch = useAppDispatch();
    const [login, { error }] = useLoginMutation();
    const [edit] = useEditProfileMutation();
    useApiError(error as any);

    const handleTest = async () => {
        const response = await login({ email: "johndoe@example.com", password: "Password123!" });
        dispatch(loginStorage(response.data!));
    };

    const handleEdit = async () => {
        await edit({ firstName: 'Іван', bio: "Люблю сало"});

        // Так значення bio буде видалено
        // await edit({ firstName: 'Іван', bio: ""});
        // Так значення bio буде видалено
        // await edit({ firstName: 'Іван', bio: null});
        // Так значення bio не буде змінено
        // await edit({ firstName: 'Іван'});
    }

    return (
        <div>
            <div className="app">
                <h1>SASS працює!</h1>
            </div>
            <h1>TestingPage</h1>
            <button onClick={handleTest}>Test Login (EN)</button>
            <p></p>
            <button onClick={handleEdit}>Test Edit</button>
        </div>
    );
};

export default HomePage;