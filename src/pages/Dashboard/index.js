import { useState, useEffect } from "react";
import './dashborad.css'

import Header from "../../components/Header";
import Title from '../../components/Title';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi'
import { Link } from "react-router-dom";
import { format } from 'date-fns';

import firebase from '../../services/firebaseConnection';

export default function Dashboard() {
    // const { signOut } = useContext(AuthContext);
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDoc, setLastDoc] = useState();

    useEffect(() => {
        loadChamados();
        // quando o componente for desmontado
        return () => {

        }
    }, []); //sem colchehtes, dados ficam redundantes

    async function loadChamados() {
        await firebase.firestore().collection('chamados').orderBy('crated', 'desc').limit(5)
        .get()
        .then((snapshot) => {
            updateState(snapshot);
        })
        .catch((err) => {
            console.log('Error: ' + err);
            setLoadingMore(false);
        })

        setLoading(false);
    }

    async function updateState(snapshot) {
        const isCollectionEmpty = snapshot.size === 0;

        if (!isCollectionEmpty) {
            let lista = [];

            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    clienteId: doc.data().clienteId,
                    cliente: doc.data().cliente,
                    // create == created - escrito errado
                    created: doc.data().crated,
                    createdFormated: format(doc.data().crated.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento
                });
            });

            const lastDoc = snapshot.docs[snapshot.docs.length - 1]; // pegando os ultimos documentos
            setChamados(chamados => [...chamados, ...lista]);
            setLastDoc(lastDoc);
            
        } else {
            setIsEmpty(true);
        }

        setLoadingMore(false);
    }

    async function handleMore() {
        setLoadingMore(true);
        await firebase.firestore().collection('chamados').orderBy('crated', 'desc')
        .startAfter(lastDoc).limit(5)
        .get()
        .then((snapshot) => {
            // nao precisando recriar a função novamente ao buscar novos items
            updateState(snapshot);
        })
    }

    if(loading) {
        return (
            <div>
                <Header/>
                
                <div className="content">
                    <Title name="Atendimentos">
                        <FiMessageSquare size={25}/>
                    </Title>

                    <div className="container dashboard">
                        <span>Buscando chamados.</span>
                    </div>
                </div>
            </div>
        );
    }

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
                                {chamados.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td data-label="Cliente">{item.cliente}</td>
                                            <td data-label="Assunto">{item.assunto}</td>
                                            <td data-label="Status">
                                        <span className="badge" style={{backgroundColor: "#5cb85c"}}>Em aberto</span>
                                    </td>
                                            <td data-label="Cadastrado">{item.createdFormated}</td>
                                            <td data-label="#">
                                                <button className="action" style={{backgroundColor: '#3583f6'}}>
                                                    <FiSearch color="#fff" size={17}/>
                                                </button>
                                                <button className="action" style={{backgroundColor: '#f6a935'}}>
                                                    <FiEdit2 color="#fff" size={17}/>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
}