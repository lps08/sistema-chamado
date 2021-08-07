import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiSettings } from 'react-icons/fi';

export default function Profile() {
    return (
        <div>
            <Header />
            <h1>Profile</h1>

            <div className="content">
                <Title name="Meu perfil">
                    <FiSettings size={23} />
                </Title>
            </div>
        </div>
    );
}