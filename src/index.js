import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './pages/App/App';
import { getBasename } from "./utils/BasenameHandler";

const rootElement = document.getElementById('root');

getBasename().then((baseUrl) => {
    if (rootElement) {
        const root = ReactDOM.createRoot(rootElement);

        root.render(
            <BrowserRouter basename={new URL(baseUrl).pathname}>{/* Passa o basename calculado */} 
                <App />
            </BrowserRouter>
        );
    }
});
