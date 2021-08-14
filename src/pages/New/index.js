import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';

import firebase from '../../services/firebaseConnection';
import { useHistory, useParams } from 'react-router-dom';

import './new.css';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';

import { FiPlusCircle } from 'react-icons/fi'

export default function New() {

    const { id } = useParams();
    const history = useHistory();

    const [ loadCustomers, setLoadCustomers ] = useState(true);
    const [ customers, setCustomers ] = useState([]);
    const [ custumersSelected, setCustumersSelected ] = useState(0);

    // começa como padrão como suporte
    const [ assunto, setAssunto ] = useState('Suporte');
    const [ status, setStatus ] = useState('Aberto');
    const [ complemento, setComplemento ] = useState('');

    const [idCostomer, setIdCustomer] = useState(false);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        async function loadCustomers() {
            await firebase.firestore().collection('customers')
            .get()
            .then((snapshot) => {
                let lista = []

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    });
                })

                if ( lista.length === 0 ) {
                    console.log('Nenhum cliente encontrado!');
                    // caso der error colocar um dado vazio para n ter erros
                    setCustomers({id: 1, nomeFantasia: ''});
                    setLoadCustomers(false);
                    return;
                }

                setCustomers(lista);
                setLoadCustomers(false);

                if (id) {
                    loadId(lista);
                }
            })
            .catch((e) => {
                console.log('Error: ' + e);
                setLoadCustomers(false);
                // caso der error colocar um dado vazio para n ter erros
                setCustomers({id: 1, nomeFantasia: ''});
            })
        }

        loadCustomers();
    }, [id]);

    async function loadId(lista) {
        await firebase.firestore().collection('chamados').doc(id)
        .get()
        .then((snapshot) => {
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().complemento);

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
            setCustumersSelected(index);
            setIdCustomer(true);
        })
        .catch((err) => {
            console.log('Error: ', err);
            setIdCustomer(false);
        })
    }

    async function handleRegister(e) {
        e.preventDefault();

        if (idCostomer) {
            await firebase.firestore().collection('chamados')
            .doc(id)
            .update({
                clienteId: customers[custumersSelected].id,
                cliente: customers[custumersSelected].nomeFantasia,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid
            })
            .then(() => {
                toast.success('Chamado editado com sucesso!');
                setCustumersSelected(0);
                setComplemento('')
                history.push('/dashboard');
            })
            .catch((err) => {
                console.log('Error: ', err);
                toast.error('Erro ao editar, tente mais tarde!');
            })

            // acabar a realização do restando do método
            return
        }

        await firebase.firestore().collection('chamados')
        .add({
            crated: new Date(),
            clienteId: customers[custumersSelected].id,
            cliente: customers[custumersSelected].nomeFantasia,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid
        })
        .then(() => {
            toast.success('Registrado com sucesso!');
            // limpa os campos após os registros
            setComplemento('');
            setCustumersSelected(0);
        })
        .catch((err) => {
            toast.error('Algo deu errado ao cadastrar!');
            console.log('Error: ' + err);
        })
    }

    function handleChangeSelect(e) {
        setAssunto(e.target.value);
    }

    function handleOptionChange(e) {
        setStatus(e.target.value);
    }

    function handleChangeCustomers(e) {
        // index selecionado
        setCustumersSelected(e.target.value);
    }

    return (
        <div>
            <Header/>

            <div className="content">
                <Title name="Novo chamado">
                    <FiPlusCircle size={25}/>
                </Title>

                <div className="container">
                    
                    <form className="form-profile" onSubmit={ handleRegister }>

                        <label>Clientes</label>

                        {loadCustomers ? (
                            <input type="text" disabled={true} value="Carregando clientes..." />
                        ) : (
                            <select value={ custumersSelected } onChange={ handleChangeCustomers }>
                                {customers.map((item, index) => {
                                    return (
                                        <option key={item.id} value={index}>
                                            {item.nomeFantasia}
                                        </option>
                                    );
                                })}
                            </select>
                        )}
                        
                        <label>Assunto</label>
                        <select value={assunto} onChange={ handleChangeSelect }>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita tecnica">Visita tecnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input 
                                type="radio"
                                name="radio"
                                value="Aberto" 
                                onChange={ handleOptionChange }
                                checked={status === "Aberto"}
                            />
                            <span>Em aberto</span>

                            <input 
                                type="radio"
                                name="radio"
                                value="Progresso" 
                                onChange={ handleOptionChange }
                                checked={status === "Progresso"}
                            />
                            <span>Progresso</span>

                            <input 
                                type="radio"
                                name="radio"
                                value="Atendido" 
                                onChange={ handleOptionChange }
                                checked={status === "Atendido"}
                            />
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea 
                            type="text"
                            placeholder="Descreva seu problema (opcional)."
                            value={complemento}
                            onChange={ (e) => setComplemento(e.target.value)}
                        />

                        <button type="submit">Registrar</button>

                    </form>

                </div>
            </div>
        </div>
    );
}