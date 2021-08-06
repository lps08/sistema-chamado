import { Route, Redirect } from 'react-router-dom';

export default function RouteWrapper({
    // componente da página da rota
    component: Component,
    // se é privado ou não
    isPrivate,
    // argumentos do Router do react-router-dom
    ...rest
}) {
    // verifica se uma página está carrgando para exibir alguma tela de loagind
    const loading = false;
    // verifica se o usuario está logado, assim permitindo acesso as paginas privadas
    const signed = false;

    // caso se loading for true, devolve a tela de loading
    if (loading) {
        return (
            <div></div>
        );
    }

    // se caso o usuario não estiver logado e tentar acessar uma pagina privada, redireciona para a página principal
    if (!signed && isPrivate) {
        return <Redirect to='/' />
    }

    // caso o usuário estiver logado, redireciona para a dashboard
    if (signed && !isPrivate) {
        return <Redirect to='/dashboard' />
    }

    return (
        <Route
            // argumentos do route do react-router-dom
            {...rest}
            // adiciona o componente com as props passada para a route 
            render={ props => (
                <Component {...props} />
            )}        
        />
    );
}