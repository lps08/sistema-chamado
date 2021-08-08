import { useState } from "react";
import './dashborad.css'

import Header from "../../components/Header";
import Title from '../../components/Title';
import { FiMessageSquare, FiPlus } from 'react-icons/fi'
import { Link } from "react-router-dom";

export default function Dashboard() {
    // const { signOut } = useContext(AuthContext);
    const [chamados, setChamados] = useState([]);

    return(
        <div>
            <Header/>
            
            <div className="content">
                <Title name="Atendimentos">
                    <FiMessageSquare size={25}/>
                </Title>

                { chamados.length === 0 ? (
                    <div className="container dashboard">
                        <span>Nenhum chamado encontrado.</span>

                        <Link to="/new" className="new">
                            <FiPlus size={25} color="#fff"/>
                            Novo chamado
                        </Link>
                    </div>
                ) : (
                    <div className="container dashboard">
                        <h1>Chamados encontrados</h1>
                    </div>
                )}
            </div>
        </div>
    );
}