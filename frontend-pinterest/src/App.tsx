import './App.css'
import {Route, Routes} from "react-router";
import HomePage from "./pages/home/HomePage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";

const App = () => {

  return (
    <>
      <Routes>
          <Route path="/">
            <Route index element={<HomePage />} />

          </Route>

          <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
