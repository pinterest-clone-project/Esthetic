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
import { LoadingProvider } from "./context/LoadingContext.tsx";
import GlobalLoadingOverlay from "./components/ui/GlobalLoadingOverlay.tsx";

createRoot(document.getElementById('root')!).render(
    <Suspense fallback={null}>
        <ThemeProvider>
            <LoadingProvider>
                <Provider store={store}>
                    <BrowserRouter>
                        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                            <App/>
                            <GlobalLoadingOverlay />
                        </GoogleOAuthProvider>
                    </BrowserRouter>
                </Provider>
            </LoadingProvider>
        </ThemeProvider>
    </Suspense>
)
