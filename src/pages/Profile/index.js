import { useState, useContext } from 'react';
import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import avatar from '../../assets/avatar.png';
import { FiSettings, FiUpload } from 'react-icons/fi';
import firebase from '../../services/firebaseConnection';

import { AuthContext } from '../../contexts/auth';

export default function Profile() {

    const { user, signOut, setUser, storageUser } = useContext(AuthContext);

    const [ nome, setNome ] = useState( user && user.nome );
    const [ email, setEmail ] = useState( user && user.email );
    const [ avatarUrl, setAvatarUrl ] = useState( user && user.avatarUrl );
    const [ imageAvatar, setImageAvatar] = useState(null);

    // busca a imagem e setta para a variavel imagemAvatar e setAvatarUrl
    function handleFile(e) {
        if (e.target.files[0]) {
            const image = e.target.files[0];

            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(image))
            }else {
                alert('Permitido imagem .jpeg e .png, apenas.');
                setImageAvatar(null);
                return null;
            }
        }
    }

    async function handleUploadImage() {
        const upTask = await firebase.storage()
        .ref(`images/${user.uid}/${imageAvatar.name}`)
        .put(imageAvatar)
        .then( async () => {
            console.log('Foto enviada com sucesso.');

            // buscando url da imagem
            await firebase.storage().ref(`images/${user.uid}`)
            .child(imageAvatar.name).getDownloadURL()
            .then( async (url) => {
                // apos enviar a foto, busca a url para salvar no firestore do perfil do usuario
                await firebase.firestore().collection('users')
                .doc(user.uid)
                .update({
                    avatarUrl: url,
                    nome: nome
                })
                .then(() => {
                    // atualiza o estado com novas informações, assim como o starage
                    let data = {
                        ...user,
                        avatarUrl: url,
                        nome: nome
                    }
                    setUser(data);
                    storageUser(data);
                })
            })
        })
    }

    async function handleSave(e) {
        // previne para não recarregar a pagina
        e.preventDefault()

        if (imageAvatar === null && nome !== '') {
            await firebase.firestore().collection('users')
            .doc(user.uid)
            .update({
                nome: nome
            })
            .then(() => {
                let data = {
                    ...user,
                    nome: nome
                };
                setUser(data);
                storageUser(data);
            })
        } else if (imageAvatar !== null && nome !== '') {
            handleUploadImage();
        }
    }

    return (
        <div>
            <Header />
            <h1>Profile</h1>

            <div className="content">
                <Title name="Meu perfil">
                    <FiSettings size={23} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={ handleSave }>
                        <label className="label-avatar">
                            <span>
                                <FiUpload color="#fff" size={25} />
                            </span>

                            <input type="file" accept="image/*" onChange={ handleFile } />
                            { avatarUrl === null ?
                                <img src={avatar} width="250" height="250" alt="Avatar user" />
                                :
                                <img src={avatarUrl} width="250" height="250" alt="Avatar user" />
                            }
                        </label>

                        <label>Nome</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

                        <label>Email</label>
                        <input type="text" value={email} disabled={true}/>

                        <button type="submit" >Salvar</button>

                    </form>
                </div>

                <div className="container">
                    <button className="logout-btn" onClick={() => signOut() }>Sair</button>
                </div>

            </div>
        </div>
    );
}