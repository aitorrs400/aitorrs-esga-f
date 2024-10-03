import { useState, createContext } from 'react';
import { axiosInstance } from '../helpers/axios';
import { mensajesBack } from '../helpers/mensajesBack';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    // Preparamos variables necesarias
    const token = localStorage.getItem('token');
    const userStorage = JSON.parse(localStorage.getItem('user'));

    // Preparamos los estados
    const [logged, setLogged] = useState( token ? true : false);
    const [user, setUser] = useState(userStorage ? userStorage : null);

    // Funciones
    const login = async (correo, contrasena) => {
        try {

            // Hacemos una petición al back para loguearnos
            const result = await axiosInstance.post('/api/auth/login', { correo, contrasena });

            // Si todo va bien, guardamos el token en el storage
            localStorage.setItem('token', result.data.token);
            localStorage.setItem('user', JSON.stringify(result.data.usuario));

            // Seteamos en el auth el estado
            setLogged(true);
            setUser(result.data.usuario);

            return { error: false, token: result.data.token };

        } catch ( error ) {

            // Generamos el mensaje de error
            let mensaje = mensajesBack( error );
            return { error: true, msg: mensaje };
            
        }
    }

    const logout = () => {

        // Destruimos los datos del storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLogged(false);

    }

    return (
        <AuthContext.Provider value={{ logged, user, login, logout }}>
            { children }
        </AuthContext.Provider>
    )
}