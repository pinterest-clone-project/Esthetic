import {Route, Routes} from "react-router";
import HomePage from "./pages/home/HomePage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import Layout from "./layout/Layout.tsx";
import { useEffect } from "react";
import { useAppDispatch } from "./store";
import { setUser } from "./store/slices/authSlice";
import { useGetMeQuery } from "./services/accountService";
import ProfilePage from "@/pages/profile/ProfilePage.tsx";

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
              </Route>

              <Route path="/profile">
                  <Route index element={<ProfilePage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
          </Route>

      </Routes>
    </AppInit>
  )
}

export default App
