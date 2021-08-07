import './title.css';

export default function Title({ children, name }) {
    return (
        <div className="title">
            {/* icone a ser exibido */}
            {children}
            <span>{name}</span>
        </div>
    );
}