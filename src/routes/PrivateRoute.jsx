import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


export const PrivateRoute = ({ children }) => {

    // Comprobamos si el usuario está autenticado
    const { logged } = useContext( AuthContext );

    // Si lo está, devolvemos las rutas privadas; en caso contrario, redirigimos a la pagina login
    return (logged)
        ? children
        : <Navigate to="/login" />

}
