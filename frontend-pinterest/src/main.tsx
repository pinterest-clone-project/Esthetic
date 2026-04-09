import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux";
import {store} from "./store";
import {BrowserRouter} from "react-router";
import {GoogleOAuthProvider} from "@react-oauth/google";

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <BrowserRouter>
            <GoogleOAuthProvider clientId="911542527173-rsr0s8elapousvqvskvqnmns61j9i3ev.apps.googleusercontent.com">
                <App/>
            </GoogleOAuthProvider>
        </BrowserRouter>
    </Provider>
)
