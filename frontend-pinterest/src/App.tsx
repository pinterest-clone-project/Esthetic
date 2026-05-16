import './App.scss'
import {Route, Routes} from "react-router";
import HomePage from "./pages/home/HomePage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";


const App = () => {

  return (
    <>
      <Routes>
          <Route path="/">
            <Route index element={<HomePage />} />

              <Route path="/login" element={<LoginPage />} />

          </Route>

          <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
