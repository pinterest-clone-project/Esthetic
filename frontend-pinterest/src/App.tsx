import { Navigate, Route, Routes } from "react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./store";
import { setUser } from "./store/slices/authSlice";
import { useGetMeQuery } from "./services/accountService";
import { useChatRealtime } from "@/hooks/useChatRealtime.ts";
import { useNotificationRealtime } from "@/hooks/useNotificationRealtime.ts";
import { ToastProvider } from "@/components/ui/Toast/ToastProvider.tsx";
import logo from "@/assets/logo.png";

import Layout from "@/layouts/Layout.tsx";
import AdminLayout from "@/layouts/AdminLayout.tsx";
import PrivateRoute from "@/components/routes/PrivateRoute.tsx";
import AdminRoute from "@/components/routes/AdminRoute.tsx";

const FirstPage            = lazy(() => import("@/pages/home/FirstPage.tsx"));
const ReviewPage           = lazy(() => import("@/pages/home/ReviewPage.tsx"));
const CreateAuraPage       = lazy(() => import("./pages/aura/CreateAuraPage.tsx"));
const EditAuraPage         = lazy(() => import("./pages/aura/EditAuraPage.tsx"));
const AuraPreviewPage      = lazy(() => import("./pages/aura/AuraPreviewPage.tsx"));
const ProfilePage          = lazy(() => import("@/pages/profile/ProfilePage.tsx"));
const CollectionsPage      = lazy(() => import("@/pages/collections/CollectionsPage.tsx"));
const MoodboardPreviewPage = lazy(() => import("@/pages/moodboard/MoodboardPreviewPage.tsx"));
const AdminDashboard       = lazy(() => import("@/pages/admin/AdminDashboard.tsx"));
const ThemePage            = lazy(() => import("@/pages/settings/ThemePage.tsx"));
const NotFoundPage         = lazy(() => import("./pages/NotFoundPage.tsx"));

const PageLoader = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-[#121212]">
        <img src={logo} className="w-[80px] h-[80px] animate-pulse" />
    </div>
);

const AppInit = ({ children }: { children: React.ReactNode }) => {
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
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-[#121212]"
                    style={{
                        opacity: fadeOut ? 0 : 1,
                        transition: "opacity 0.6s ease",
                        pointerEvents: fadeOut ? "none" : "all",
                    }}
                >
                    <img
                        src={logo}
                        className="w-[150px] h-[150px]"
                        style={{ animation: "logoPulse 1.0s ease-out forwards" }}
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
    const user = useAppSelector((state) => state.auth.user);
    return user ? <ReviewPage /> : <FirstPage />;
};

const App = () => {
    return (
        <ToastProvider>
            <AppInit>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="/">
                                <Route index element={<RootPage />} />
                                <Route path="review" element={<ReviewPage />} />
                            </Route>

                            <Route element={<PrivateRoute />}>
                                <Route path="/profile" element={<ProfilePage />} />

                                <Route path="aura">
                                    <Route path="create" element={<CreateAuraPage />} />
                                    <Route path="edit/:id" element={<EditAuraPage />} />
                                    <Route path="preview/:id" element={<AuraPreviewPage />} />
                                </Route>

                                <Route path="moodboard">
                                    <Route path="preview/:id" element={<MoodboardPreviewPage />} />
                                </Route>

                                <Route path="/collections" element={<Navigate to="/collections/aura" replace />} />
                                <Route path="/collections/aura" element={<CollectionsPage />} />
                                <Route path="/collections/moodboard" element={<CollectionsPage />} />
                                <Route path="/collections/ai" element={<CollectionsPage />} />

                                <Route path="/theme" element={<ThemePage />} />
                            </Route>
                        </Route>

                        <Route element={<AdminRoute />}>
                            <Route element={<AdminLayout />}>
                                <Route path="/admin" element={<AdminDashboard />} />
                            </Route>
                        </Route>

                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Suspense>
            </AppInit>
        </ToastProvider>
    );
};

export default App;
