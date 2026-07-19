import './i18n';
import { createRoot } from 'react-dom/client'
import { Suspense } from 'react'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux";
import {store} from "./store";
import {BrowserRouter} from "react-router";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {ThemeProvider} from "./context/ThemeContext.tsx";

createRoot(document.getElementById('root')!).render(
    <Suspense fallback={null}>
        <ThemeProvider>
            <Provider store={store}>
                <BrowserRouter>
                    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                        <App/>
                    </GoogleOAuthProvider>
                </BrowserRouter>
            </Provider>
        </ThemeProvider>
    </Suspense>
)
