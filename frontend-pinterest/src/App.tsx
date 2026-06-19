import {Navigate, Route, Routes} from "react-router";
import CreateAuraPage from "./pages/aura/CreateAuraPage.tsx";
import EditAuraPage from "./pages/aura/EditAuraPage.tsx";
import AuraPreviewPage from "./pages/aura/AuraPreviewPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import Layout from "@/layouts/Layout.tsx";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "./store";
import {setUser} from "./store/slices/authSlice";
import {useGetMeQuery} from "./services/accountService";
import ProfilePage from "@/pages/profile/ProfilePage.tsx";
import PrivateRoute from "@/components/routes/PrivateRoute.tsx";
import FirstPage from "@/pages/home/FirstPage.tsx";
import logo from "@/assets/logo.png";
import ReviewPage from "@/pages/home/ReviewPage.tsx";
import CollectionsPage from "@/pages/collections/CollectionsPage.tsx";
import AdminRoute from "@/components/routes/AdminRoute.tsx";
import AdminLayout from "@/layouts/AdminLayout.tsx";
import AdminDashboard from "@/pages/admin/AdminDashboard.tsx";
import MoodboardPreviewPage from "@/pages/moodboard/MoodboardPreviewPage.tsx";
import {useChatRealtime} from "@/hooks/useChatRealtime.ts";
import {useNotificationRealtime} from "@/hooks/useNotificationRealtime.ts";

const AppInit = ({children}: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const { data, isSuccess, isLoading } = useGetMeQuery();
    const [showLoader, setShowLoader] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useChatRealtime();
    useNotificationRealtime();

    useEffect(() => {
        if (isSuccess && data) {
            dispatch(setUser(data));
        }
    }, [isSuccess, data, dispatch]);

    useEffect(() => {
        if (!isLoading) {
            const fadeTimer = setTimeout(() => setFadeOut(true), 400);
            const hideTimer = setTimeout(() => setShowLoader(false), 800);
            return () => {
                clearTimeout(fadeTimer);
                clearTimeout(hideTimer);
            };
        }
    }, [isLoading]);

    return (
        <>
            {showLoader && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#121212]"
                    style={{
                        opacity: fadeOut ? 0 : 1,
                        transition: 'opacity 0.6s ease',
                        pointerEvents: fadeOut ? 'none' : 'all',
                    }}
                >
                    <img
                        src={logo}
                        className="w-[150px] h-[150px]"
                        style={{ animation: 'logoPulse 1.0s ease-out forwards' }}
                    />
                    <style>{`
                        @keyframes logoPulse {
                            0%   { opacity: 0; transform: scale(0.8); }
                            60%  { opacity: 1; transform: scale(1.05); }
                            100% { opacity: 1; transform: scale(1); }
                        }
                    `}</style>
                </div>
            )}
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
                                <Route path="edit/:id" element={<EditAuraPage/>}/>
                                <Route path="create" element={<CreateAuraPage/>}/>
                                <Route path="preview/:id" element={<AuraPreviewPage/>}/>
                            </Route>
                            <Route path="moodboard/">
                                <Route path="preview/:id" element={<MoodboardPreviewPage/>}/>
                            </Route>

                            <Route path="/collections" element={<Navigate to="/collections/aura" replace />} />
                            <Route path="/collections/aura" element={<CollectionsPage/>}/>
                            <Route path="/collections/moodboard" element={<CollectionsPage/>}/>
                            <Route path="/collections/ai" element={<CollectionsPage/>}/>
                        </Route>
                    </Route>
                </Route>

                <Route element={<AdminRoute/>}>
                    <Route element={<AdminLayout/>}>
                        <Route path="/admin" element={<AdminDashboard/>}/>
                    </Route>
                </Route>

                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </AppInit>
    )
}

export default App
