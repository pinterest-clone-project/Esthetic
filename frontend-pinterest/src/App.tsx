import './App.css'
import {Route, Routes} from "react-router";
import TestingPage from "./pages/TestingPage.tsx";

const App = () => {

  return (
    <>
      <Routes>
          <Route path="/">
            <Route path="testing" element={<TestingPage />} />
          </Route>
      </Routes>
    </>
  )
}

export default App
