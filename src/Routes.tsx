import { Route, Routes } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Capture from "./pages/Capture/Capture";
import CaptureNoAI from "./pages/CaptureNoAI/CaptureNoAI";
import HomePage from "./pages/Home/Home";
import SignInPage from './pages/SignIn/SignIn';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/entrar" element={<SignInPage />}></Route>
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePage />}></Route>
                <Route path="/capturar" element={<Capture />}></Route>
                <Route path="/capturarSemIa" element={<CaptureNoAI />}></Route>
            </Route>
        </Routes>
    )
}

export default AppRoutes;