import { useState } from 'react'
import './custumers.css';
import Title from '../../components/Title';
import Header from '../../components/Header';
import firebase from '../../services/firebaseConnection';
import { FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function Custumers() {

    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');

    async function handleAdd(e) {
        // previne a pagina de recarregar
        e.preventDefault()

        if (nomeFantasia !== '' && cnpj !== '' && endereco !== '') {
            firebase.firestore().collection('customers')
            .add({
                nomeFantasia: nomeFantasia,
                cnpj: cnpj,
                endereco: endereco
            })
            .then(() => {
                setNomeFantasia('');
                setCnpj('');
                setEndereco('');
                toast.success('Empresa cadastrada com sucesso!');
            })
            .catch((e) => {
                console.log('Error ' + e);
                toast.error('Erro ao cadastrar a empresa!');
            })
        }else {
            toast.error('Preencha todos os campos!');
        }

    }

    return (
        <div>
            <Header/>
            
            <div className="content">
                <Title name="Clientes">
                    <FiUser size={25}/>
                </Title>

                <div className="container">
                    <form className="form-profile customers" onSubmit={ handleAdd }>
                        <label>Nome fantasia</label>
                        <input type="text" placeholder="Nome da empresa" value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)}/>

                        <label>CNPJ</label>
                        <input type="text" placeholder="CNPJ da empresa" value={cnpj} onChange={(e) => setCnpj(e.target.value)}/>

                        <label>Endereço</label>
                        <input type="text" placeholder="Endereço da empresa" value={endereco} onChange={(e) => setEndereco(e.target.value)}/>

                        <button type="submit" >Cadastrar</button>

                    </form>
                </div>
            </div>
        </div>
    );
}