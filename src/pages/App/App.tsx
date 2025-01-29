import { useEffect, useState } from 'react';
import AppRoutes from '../../Routes';
import { faultMessages, FaultMessagesModal } from '../../components/Modal/FaultMessagesModal';
import { SuccessMessagesModal } from '../../components/Modal/SuccessMessagesModal';
import { loadAppSettings } from '../../config/configLoader';
import loadClientStyles from '../../styles/styles-loader';
function resetZoom() {
  document.body.style.setProperty("zoom", "100%");
}
function App() {
  const [theme, setTheme] = useState('Default'); 
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        resetZoom()
        const appSettings = await loadAppSettings();
        setTheme(appSettings.clientName); 
        setBaseUrl(appSettings.baseUrl);
      } catch (error) {
        faultMessages.showError(
          'Como isso aconteceu?', 
          'Parece que as configurações não vieram junto comigo. Se você recarregar a página elas devem aparecer.',
          undefined,
          true
        
        );
        console.error(error);
      }
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    if (theme && baseUrl) {
      try {
        loadClientStyles(theme);
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (favicon) {
          favicon.href = `${baseUrl}/themes/${theme}/favicon.ico`;
        }
      } catch (error) {
        console.error(`Erro ao carregar o tema ${theme}:`, error);
      }
    }
  }, [theme, baseUrl]);

  return (
    <div className='app'>
      <AppRoutes />
      <FaultMessagesModal />
      <SuccessMessagesModal />
    </div>
  );
}

export default App;
