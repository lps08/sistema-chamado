import { useState } from "react";
import './dashborad.css'

import Header from "../../components/Header";
import Title from '../../components/Title';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi'
import { Link } from "react-router-dom";

export default function Dashboard() {
    // const { signOut } = useContext(AuthContext);
    const [chamados, setChamados] = useState([1]);

    return(
        <div>
            <Header/>
            
            <div className="content">
                <Title name="Atendimentos">
                    <FiMessageSquare size={25}/>
                </Title>

                {/* verifica se possui chamado, se tiver mostra eles, caso n, mostra a area para criar um */}
                { chamados.length === 0 ? ( 

                    <div className="container dashboard">
                        <span>Nenhum chamado encontrado.</span>

                        <Link to="/new" className="new">
                            <FiPlus size={25} color="#fff"/>
                            Novo chamado
                        </Link>
                    </div>

                ) : (
                    <>
                        <Link to="/new" className="new">
                            <FiPlus size={25} color="#fff"/>
                            Novo chamado
                        </Link>

                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Assunto</th>
                                    <th scope="col">Stattus</th>
                                    <th scope="col">Cadastrado em</th>
                                    <th scope="col">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td data-label="Cliente">Sujeito</td>
                                    <td data-label="Assunto">Suporte</td>
                                    <td data-label="Status">
                                        <span className="badge" style={{backgroundColor: "#5cb85c"}}>Em aberto</span>
                                    </td>
                                    <td data-label="Cadastrado">20/08/2021</td>
                                    <td data-label="#">
                                        <button className="action" style={{backgroundColor: '#3583f6'}}>
                                            <FiSearch color="#fff" size={17}/>
                                        </button>
                                        <button className="action" style={{backgroundColor: '#f6a935'}}>
                                            <FiEdit2 color="#fff" size={17}/>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
}