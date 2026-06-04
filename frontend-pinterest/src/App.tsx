import {Route, Routes} from "react-router";
import HomePage from "./pages/home/HomePage.tsx";
import CreateAuraPage from "./pages/aura/CreateAuraPage.tsx";
import AuraPreviewPage from "./pages/aura/AuraPreviewPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import Layout from "./layout/Layout.tsx";
import { useEffect } from "react";
import { useAppDispatch } from "./store";
import { setUser } from "./store/slices/authSlice";
import { useGetMeQuery } from "./services/accountService";

const AppInit = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const { data, isSuccess } = useGetMeQuery(undefined, {
        skip: false,
    });

    useEffect(() => {
        if (isSuccess && data) {
            dispatch(setUser(data));
        }
    }, [isSuccess, data, dispatch]);

    return <>{children}</>;
};


const App = () => {

  return (
    <AppInit>
      <Routes>
          <Route element={<Layout/>}>
              <Route path="/">
                  <Route index element={<HomePage />} />
                  <Route path="aura/">
                      <Route path="create" element={<CreateAuraPage />} />
                      <Route path="preview/:id" element={<AuraPreviewPage />} />
                  </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
          </Route>

      </Routes>
    </AppInit>
  )
}

export default App
