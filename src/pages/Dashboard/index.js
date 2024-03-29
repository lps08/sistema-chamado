import { useState, useEffect } from "react";
import './dashborad.css'

import Header from "../../components/Header";
import Title from '../../components/Title';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi'
import { Link } from "react-router-dom";
import { format } from 'date-fns';

import firebase from '../../services/firebaseConnection';
import Modal from "../../components/Modal";

export default function Dashboard() {
    // const { signOut } = useContext(AuthContext);
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDoc, setLastDoc] = useState();
    const [showPostModal, setShowPostModal] = useState(false);
    const [detail, setDetail] = useState();

    useEffect(() => {

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

        loadChamados();
        // quando o componente for desmontado
        return () => {

        }
    }, []); //sem colchehtes, dados ficam redundantes

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

    function toggleSearchModal(item) {
        // cada clique no butao, ativa ou desativa o modal
        setShowPostModal(!showPostModal);
        setDetail(item);
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
                                                <span className="badge" style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999'}}>{item.status}</span>
                                            </td>
                                            <td data-label="Cadastrado">{item.createdFormated}</td>
                                            <td data-label="#">
                                                <button className="action" style={{backgroundColor: '#3583f6'}} onClick={ () => toggleSearchModal(item) }>
                                                    <FiSearch color="#fff" size={17}/>
                                                </button>
                                                <Link className="action" style={{backgroundColor: '#f6a935'}} to={`/new/${item.id}`}>
                                                    <FiEdit2 color="#fff" size={17}/>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        
                        { loadingMore && <h3 style={{textAlign: 'center', marginTop: 15}}>Buscando dados...</h3> }
                        { !loadingMore && !isEmpty && <button className="btn-more" onClick={ handleMore } >Buscar mais</button>}
                    </>
                )}
            </div>
            
            { showPostModal && (
                <Modal 
                    // recebe os conteudos no caomponente do modal 
                    conteudo={detail}
                    close={toggleSearchModal}
                />
            )}

        </div>
    );
}