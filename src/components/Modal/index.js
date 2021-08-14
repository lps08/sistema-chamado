
import './modal.css';

import { FiX } from 'react-icons/fi';

export default function Modal({conteudo, close}) {
    return (
        <div className="modal">
            <div className="container">
                <button className="close" onClick={close}>
                    <FiX size={23} color="fff" / >
                        Voltar
                </button>

                <div>
                    <h2>Detalhe do chamado</h2>

                    <div className="row">
                        <span>
                            Cliente: <a>{conteudo.cliente}</a>
                        </span>
                    </div>

                    <div className="row">
                        <span>
                            Assunto: <a>{conteudo.assunto}</a>
                        </span>

                        <span>
                            Cadastrado em: <a>{conteudo.createdFormated}</a>
                        </span>
                    </div>

                    <div className="row">
                        <span className="status">
                            Status: <a style={{backgroundColor: conteudo.status === 'Aberto' ? '#5cb85c' : '#999', color:'#fff'}}>{conteudo.status}</a>
                        </span>
                    </div>

                    {/* podendo ou não ser mostrado o complemento, pois é opcional */}
                    {conteudo.complemento !== '' && (
                        <>
                            <h3>Complemento</h3>

                            <p>
                                {conteudo.complemento}
                            </p>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}