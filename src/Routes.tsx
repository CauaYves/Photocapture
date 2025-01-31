import { Route, Routes } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Teste from "./components/Teste";
import Teste2 from "./components/Teste2";
import Teste3 from "./components/Teste3";
import Capture from "./pages/Capture/Capture";
import CaptureNoAI from "./pages/CaptureNoAI/CaptureNoAI";
import HomePage from "./pages/Home/Home";
import SignInPage from './pages/SignIn/SignIn';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/entrar" element={<SignInPage />}></Route>
            <Route path="/teste" element={<Teste />}></Route>
            <Route path="/teste2" element={<Teste2 />}></Route>
            <Route path="/teste3" element={<Teste3 />}></Route>
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePage />}></Route>
                <Route path="/capturar" element={<Capture />}></Route>
                <Route path="/capturarSemIa" element={<CaptureNoAI />}></Route>
            </Route>
        </Routes>
    )
}

export default AppRoutes;