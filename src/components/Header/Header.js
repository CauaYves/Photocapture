import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { loadAppSettings } from '../../config/configLoader';
import { signOut } from '../../services/api';
import { faultMessages } from '../Modal/FaultMessagesModal';
import './Header.scss';

function Header({ ShowSignOutHeader }) {
    const [config, setConfig] = useState({ clientName: '' });
    const [logoPath, setLogoPath] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                if (config.clientName) {
                    setLogoPath(`${config.baseUrl}/themes/${config.clientName}/logo.svg`);
                }
                const appSettings = await loadAppSettings();
                setConfig(appSettings);
            } catch (error) {
                faultMessages.showError(
					"Como isso aconteceu?",
					"Parece que as configurações não vieram junto comigo. Se você recarregar a página elas devem aparecer.",
                    undefined,
                    true
				);
                console.error(error);
            }
        };
        fetchConfig();
    }, [config]);

    const handleSignOut = async (e) => {
        e.preventDefault();
        try {
            const response = await signOut();
            if (response.status === 200) {
                navigate('/entrar');
            }
        } catch (error) {
            faultMessages.showError(
                "Ops, a porta travou",
                "Parece que houve um problema ao tentar te desconectar. Recarregue a página e tente de novo, isso deve resolver.",
                undefined,
                true
            );
            console.error(error);
        }
    };

    return (
        <header className="header">
            <div className="container">
                <div className="row">
                    {ShowSignOutHeader ? (
                        <div className="loggedIn">
                            <div className="logo">
                                {logoPath && (
                                    <img src={logoPath} className="logoImage" alt={config.clientName} />
                                )}
                            </div>
                            <button onClick={handleSignOut} className="signOutLink">
                                <LogOut className='iconLogout'/>
                                <p className="exit">Sair</p>
                            </button>
                        </div>
                    ) : (
                        <div className="loggedOut">
                            <div className="logo">
                                {logoPath && (
                                    <img src={logoPath} className="logoImage" alt={config.clientName} />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
