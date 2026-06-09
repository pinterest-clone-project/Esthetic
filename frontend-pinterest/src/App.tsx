import {Route, Routes} from "react-router";
import CreateAuraPage from "./pages/aura/CreateAuraPage.tsx";
import AuraPreviewPage from "./pages/aura/AuraPreviewPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import Layout from "./layout/Layout.tsx";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "./store";
import {setLoading, setUser} from "./store/slices/authSlice";
import {useGetMeQuery} from "./services/accountService";
import ProfilePage from "@/pages/profile/ProfilePage.tsx";
import PrivateRoute from "@/components/PrivateRoute.tsx";
import Spinner from "@/components/Spinner.tsx";
import FirstPage from "@/pages/home/FirstPage.tsx";
import ReviewPage from "@/pages/home/ReviewPage.tsx";
import CollectionsPage from "@/pages/collections/CollectionsPage.tsx";

const AppInit = ({children}: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const {data, isSuccess, isLoading} = useGetMeQuery(undefined, {skip: false,});
    const globalLoading = useAppSelector((state) => state.auth.isLoading);

    useEffect(() => {
        dispatch(setLoading(isLoading));
    }, [isLoading]);

    useEffect(() => {
        if (isSuccess && data) {
            dispatch(setUser(data));
        }
    }, [isSuccess, data, dispatch]);

    return (
        <>
            {globalLoading && <Spinner/>}
            {children}
        </>
    );
};

const RootPage = () => {
    const user = useAppSelector(state => state.auth.user)
    return user ? <ReviewPage /> : <FirstPage />
}

const App = () => {

    return (
        <AppInit>
            <Routes>
                <Route element={<Layout/>}>
                    <Route path="/">
                        <Route index element={<RootPage/>}/>
                        <Route path="review" element={<ReviewPage/>}/>

                        <Route element={<PrivateRoute/>}>
                            <Route path="/profile" element={<ProfilePage/>}/>
                            <Route path="aura/">
                                <Route path="create" element={<CreateAuraPage/>}/>
                                <Route path="preview/:id" element={<AuraPreviewPage/>}/>
                            </Route>
                            <Route path="/collections" element={<CollectionsPage/>}></Route>
                        </Route>

                        <Route path="*" element={<NotFoundPage/>}/>
                    </Route>
                </Route>

            </Routes>
        </AppInit>
    )
}

export default App
