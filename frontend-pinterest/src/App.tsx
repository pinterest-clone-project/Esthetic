import { Navigate, Route, Routes } from "react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useAppDispatch } from "./store";
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
import { useSelector } from "react-redux";
import { selectUser } from "@/store/selectors/authSelectors.ts";

const FirstPage            = lazy(() => import("@/pages/home/FirstPage.tsx"));
const ReviewPage           = lazy(() => import("@/pages/home/ReviewPage.tsx"));
const SearchPage           = lazy(() => import("@/pages/aura/SearchPage.tsx"));
const CreateAuraPage       = lazy(() => import("./pages/aura/CreateAuraPage.tsx"));
const EditAuraPage         = lazy(() => import("./pages/aura/EditAuraPage.tsx"));
const AuraPreviewPage      = lazy(() => import("./pages/aura/AuraPreviewPage.tsx"));
const ProfilePage          = lazy(() => import("@/pages/profile/ProfilePage.tsx"));
const UserPage             = lazy(() => import("@/pages/user/UserPage.tsx"));
const CollectionsPage      = lazy(() => import("@/pages/collections/CollectionsPage.tsx"));
const MoodboardPreviewPage = lazy(() => import("@/pages/moodboard/MoodboardPreviewPage.tsx"));
const ChatPage             = lazy(() => import("@/pages/chat/ChatPage.tsx"));
const SettingsPage         = lazy(() => import("@/pages/settings/SettingsPage.tsx"));
const DeletedAurasPage     = lazy(() => import("@/pages/aura/DeletedAurasPage.tsx"));
const NotificationsPage    = lazy(() => import("@/pages/notifications/NotificationsPage.tsx"));
const ForgotPasswordPage   = lazy(() => import("@/pages/auth/ForgotPasswordPage.tsx"));
const ResetPasswordPage    = lazy(() => import("@/pages/auth/ResetPasswordPage.tsx"));
const NotFoundPage         = lazy(() => import("./pages/NotFoundPage.tsx"));
const BlockedPage          = lazy(() => import("@/pages/auth/BlockedPage.tsx"));
const AboutPage            = lazy(() => import("@/pages/static/AboutPage.tsx"));
const ForBusinessPage      = lazy(() => import("@/pages/static/ForBusinessPage.tsx"));
const NewsPage             = lazy(() => import("@/pages/static/NewsPage.tsx"));
const NewsDetailPage       = lazy(() => import("@/pages/static/NewsDetailPage.tsx"));

const AdminDashboard       = lazy(() => import("@/pages/admin/AdminDashboard.tsx"));
const AdminUsersPage       = lazy(() => import("@/pages/admin/AdminUsersPage.tsx"));
const AdminReportsPage     = lazy(() => import("@/pages/admin/AdminReportsPage.tsx"));
const AdminTagsPage        = lazy(() => import("@/pages/admin/AdminTagsPage.tsx"));
const AdminCategoriesPage  = lazy(() => import("@/pages/admin/AdminCategoriesPage.tsx"));
const AdminPinsPage        = lazy(() => import("@/pages/admin/AdminPinsPage.tsx"));
const AdminBoardsPage      = lazy(() => import("@/pages/admin/AdminBoardsPage.tsx"));
const AdminNewsPage        = lazy(() => import("@/pages/admin/AdminNewsPage.tsx"));

const PageLoader = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-[#121212]">
        <img src={logo} className="w-[80px] h-[80px] animate-pulse" alt="Esthetic logo" />
    </div>
);

const AppInit = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const { data, isSuccess, isLoading } = useGetMeQuery();
    const [showLoader, setShowLoader] = useState(true);

    useChatRealtime();
    useNotificationRealtime();

    useEffect(() => {
        if (isSuccess && data) {
            dispatch(setUser(data));
        }
    }, [isSuccess, data, dispatch]);

    useEffect(() => {
        if (!isLoading) {
            const hideTimer = setTimeout(() => setShowLoader(false), 700);
            return () => clearTimeout(hideTimer);
        }
    }, [isLoading]);

    return (
        <>
            <AnimatePresence>
                {showLoader && (
                    <motion.div
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-[#121212]"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <motion.img
                            src={logo}
                            alt=""
                            className="w-[150px] h-[150px]"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            {children}
        </>
    );
};

const RootPage = () => {
    const user = useSelector(selectUser);
    return user ? <ReviewPage /> : <FirstPage />;
};

const App = () => {
    const user = useSelector(selectUser);

    return (
        <MotionConfig reducedMotion="user">
        <ToastProvider>
            <AppInit>
                <Suspense fallback={<PageLoader />}>
                    {user?.isBlocked ? (
                        <BlockedPage />
                    ) : (
                        <Routes>
                            <Route element={<Layout />}>
                                <Route path="/">
                                    <Route index element={<RootPage />} />
                                    <Route path="review" element={<ReviewPage />} />
                                    <Route path="forgot-password" element={<ForgotPasswordPage />} />
                                    <Route path="reset-password" element={<ResetPasswordPage />} />
                                    <Route path="about" element={<AboutPage />} />
                                    <Route path="business" element={<ForBusinessPage />} />
                                    <Route path="news" element={<NewsPage />} />
                                    <Route path="news/:id" element={<NewsDetailPage />} />
                                </Route>

                                <Route element={<PrivateRoute />}>
                                    <Route path="/profile" element={<ProfilePage />} />

                                    <Route path="user">
                                        <Route path=":id" element={<UserPage />} />
                                    </Route>
                                    <Route path="aura">
                                        <Route path="search" element={<SearchPage />} />
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

                                    <Route path="/chat" element={<ChatPage />} />
                                    <Route path="/settings" element={<SettingsPage />} />
                                    <Route path="/deleted-auras" element={<DeletedAurasPage />} />
                                    <Route path="/notifications" element={<NotificationsPage />} />
                                </Route>
                            </Route>

                            <Route element={<AdminRoute />}>
                                <Route element={<AdminLayout />}>
                                    <Route path="/admin" element={<AdminDashboard />} />
                                    <Route path="/admin/users" element={<AdminUsersPage />} />
                                    <Route path="/admin/reports" element={<AdminReportsPage />} />
                                    <Route path="/admin/pins" element={<AdminPinsPage />} />
                                    <Route path="/admin/boards" element={<AdminBoardsPage />} />
                                    <Route path="/admin/tags" element={<AdminTagsPage />} />
                                    <Route path="/admin/categories" element={<AdminCategoriesPage />} />
                                    <Route path="/admin/news" element={<AdminNewsPage />} />
                                </Route>
                            </Route>

                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    )}
                </Suspense>
            </AppInit>
        </ToastProvider>
        </MotionConfig>
    );
};

export default App;