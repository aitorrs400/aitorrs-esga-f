import { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Box, Container, Divider, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import { AuthContext } from '../context/AuthContext';
import { sidebarData } from '../data/sidebarData';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Logout } from '@mui/icons-material';



// Preparamos variables estáticas
const drawerWidth = 240;

// Componente de barra superior personalizada, para efecto de movimiento
const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${ drawerWidth }px)`,
            transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

// Componente de drawer personalizado, para efecto de movimiento y mostrar sólo iconos de la lista cuando está plegado
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9),
            },
        }),
    },
}));

export const MainLayout = ({ children }) => {

    // Declaramos estados
    const [open, setOpen] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const accountMenuOpen = Boolean(anchorEl);
    
    // Declaramos hooks
    const { user, logout } = useContext( AuthContext );
    const navigate = useNavigate();
    const { pathname, search } = useLocation();
    
    // Declaramos variables necesarias
    const token = localStorage.getItem('token');
    const lastPath = pathname + search;
    
    // Asignamos el último path
    localStorage.setItem( 'lastPath', lastPath );
    
    // Efectos

    // Efecto para validar el token
    useEffect(() => {
        if( !token ) {

            // Si por algún motivo no hay token, generamos un logout
            onLogout();

        }
    })

    // Declaramos funciones
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleAccountMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleAccountMenuClose = () => {
        setAnchorEl(null);
    };

    // Función para controlar el cierre de sesión
    const onLogout = () => {

        // Cerramos el menú
        handleAccountMenuClose();

        // Funciones para cerrar la sesión
        logout();

        // Redireccionamos a la pantalla de Login
        navigate('/login', { replace: true });

    }

    return (
        <Box sx={{ display: 'flex', height: '100%' }}>

            {/* Barra del menu */}
            <AppBar position="absolute" open={ open }>
                <Toolbar sx={{ pr: '24px' }}> {/* Mantiene el padding derecho cuando el drawer está cerrado */}
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={ toggleDrawer }
                        sx={{
                            marginRight: '36px',
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                        Estadísticas gasolina
                    </Typography>
                    <Tooltip title="Mi cuenta">
                        <IconButton
                            onClick={ handleAccountMenuOpen }
                            color="inherit">
                            <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            {/* Menú del usuario */}
            <Menu
                anchorEl={ anchorEl }
                id="account-menu"
                open={ accountMenuOpen }
                onClose={ handleAccountMenuClose }
                onClick={ handleAccountMenuClose }
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                        },
                        '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem disabled>
                    <Typography>{ user?.nombre }</Typography>
                </MenuItem>
                <MenuItem onClick={ handleAccountMenuClose }>
                    <Avatar /> Mi cuenta
                </MenuItem>
                <Divider />
                <MenuItem onClick={ onLogout }>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Cerrar sesión
                </MenuItem>
            </Menu>

            {/* Menú desplegable */}
            <Drawer variant="permanent" open={ open }>
                <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1] }}>
                    <IconButton onClick={ toggleDrawer }>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component="nav">
                    {
                        sidebarData.map((element, index) => (
                            <NavLink key={ index } to={ element.link } className='link' style={{ textDecoration: 'none', color: '#000000' }}>
                                <ListItemButton key={ index }>
                                    <ListItemIcon>
                                        <element.icon />
                                    </ListItemIcon>
                                    <ListItemText primary={ element.label } />
                                </ListItemButton>
                            </NavLink>
                        ))
                    }
                </List>
            </Drawer>
            
            {/* Contenido de la app */}
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

                    {/* Contenido del layout */}
                    { children }

                    {/* Texto inferior */}
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ pt: 4 }}>
                        {'Aplicación web de Aitor RS. '}
                        <Link color="inherit" href="https://aitorrs.es/">
                            Ir a AitorRS
                        </Link>
                        {'. ESGA-F '}
                        {new Date().getFullYear()}
                        {'.'}
                    </Typography>

                </Container>
            </Box>

        </Box>
    )
}
