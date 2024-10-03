import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Grid, IconButton, Paper, Tooltip, Typography, Slide, Zoom, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { mensajesBack } from "../helpers/mensajesBack";
import { axiosInstance } from "../helpers/axios";
import moment from 'moment';
import 'moment/locale/es'; // Importa el idioma español

// Configuramos MomentJS
moment.locale('es');


export const RecibosPage = () => {

    // Preparamos las variables necesarias
    const navigate = useNavigate();

    // Preparamos los estados necesarios
    const [loading, setLoading] = useState(true);
    const [recibosList, setRecibosList] = useState([]);
    const [modalEliminar, setModalEliminar] = useState({ abierto: false, id: '', nombre: '' });
    const [snackState, setSnackState] = useState({ open: false, Transition: Slide, text: 'Snackbar sin asignar', severity: 'info', autoHide: 5000 });

    // Listado de columnas que tendrá la tabla
    const columns = [
        { field: 'codigo', headerName: 'Código', width: 240 },
        { field: 'fecha', headerName: 'Fecha', width: 130 },
        { field: 'hora', headerName: 'Hora', width: 110 },
        { field: 'precioE', headerName: 'Precio (€)', width: 110 },
        { field: 'litros', headerName: 'Litros (L)', width: 110 },
        { field: 'precioEL', headerName: 'Precio (€/L)', width: 90 },
        { field: 'carburante', headerName: 'Carburante', width: 120 },
        {
            field: 'actions',
            headerName: 'Acciones',
            type: 'actions',
            headerAlign: 'center',
            width: 120,
            renderCell: (params) => {
    
                const navigate = useNavigate();
                    
                    const handleDetails = (e) => {
                        e.stopPropagation(); // don't select this row after clicking
                        navigate('/recibos/detalles/'+params.id, { replace: true });
                    };
    
                    const handleEdit = (e) => {
                        e.stopPropagation(); // don't select this row after clicking
                        navigate('/recibos/editar/'+params.id, { replace: true });
                    };
    
                    const handleDelete = (e) => {
                        e.stopPropagation();
                        setModalEliminar({ abierto: true, id: params.id, nombre: params.row.codigo });
                    }
          
                return (
                    <>
                        <Tooltip arrow title="Detalles" placement="left" TransitionComponent={Zoom}>
                            <IconButton color="primary" onClick={ handleDetails }>
                                <InfoIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow title="Editar" placement="right" TransitionComponent={Zoom}>
                            <IconButton color="warning" onClick={ handleEdit }>
                                <ModeEditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow title="Eliminar" placement="right" TransitionComponent={Zoom}>
                            <IconButton color="error" onClick={ handleDelete }>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                );
            }       
        },
    ];

    // Preparamos los efectos necesarios
    useEffect(() => {
        peticionesApi();
    },[]);

    // Función para realizar las peticiones al back
    const peticionesApi = async () => {

        // Obtenemos el listado de recibos
        try {

            const data = await axiosInstance.get('/api/recibos');

            const parsed = data.data.recibos.map(el => {

                const fechaMoment = moment(el.fecha);
                
                const fecha = fechaMoment.format('DD/MM/YYYY');
                const hora = fechaMoment.format('HH:mm');
    
                return {
                    ...el,
                    fecha,
                    hora,
                    precioE: el.precioE.$numberDecimal.toString(),
                    litros: el.litros.$numberDecimal.toString(),
                    precioEL: el.precioEL.$numberDecimal.toString(),
                }
            });

            setRecibosList(parsed);
            setLoading(false);

        } catch ( error ) {

            // Generamos el mensaje de error
            let mensaje = mensajesBack(error);

            // Si hay algún error, mostramos un mensaje
            setSnackState({
                ...snackState,
                text: 'Error al cargar el listado de recibos. Motivo: '+mensaje,
                severity: 'error',
                open: true,
                autoHide: null
            });

        }

    }

    const handleAdd = () => {
        navigate('/recibos/nuevo', { replace: true });
    }

    const handleModalEliminar = (e) => {
        setModalEliminar({ abierto: false, id: '', nombre: '' });
    }

    const handleSnackClose = () => {
        setSnackState({ ...snackState, open: false, autoHide: 5000 });
    }

    const handleEliminar = async (id) => {
        
        // Cerramos el modal
        handleModalEliminar();

        try {

            // Hacemos la petición al back
            const result = await axiosInstance.delete('/api/recibos/'+id);

            // Mostramos mensaje informativo
            setSnackState({
                ...snackState,
                text: 'Recibo eliminado correctamente',
                severity: 'success',
                open: true
            }); 
            
            // Volvemos a hacer petición a la API
            peticionesApi();

        } catch( error ) {

            // Generamos el mensaje de error
            let mensaje = mensajesBack(error);

            // Si hay algún error, mostramos un mensaje
            setSnackState({
                ...snackState,
                text: 'Error al eliminar el recibo. Motivo: '+mensaje,
                severity: 'error',
                open: true
            });

        }

    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Mis recibos
                        </Typography>
                        {
                            loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    <div style={{ width: '100%', marginBottom: '16px' }}>
                                        <DataGrid
                                            rows={ recibosList }
                                            columns={ columns }
                                            initialState={{
                                                pagination: {
                                                    paginationModel: { page: 0, pageSize: 5 },
                                                },
                                            }}
                                            pageSizeOptions={[5, 10]}
                                        />
                                    </div>
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: '8px', mt: 2 }}>
                                        <Button variant="contained" color="success" endIcon={ <AddIcon /> } onClick={ handleAdd }>Añadir nuevo</Button>
                                        <Button variant="contained" color="primary" endIcon={ <RefreshIcon /> } onClick={ peticionesApi }>Actualizar</Button>
                                    </Box>
                                </>
                            )
                        }
                    </Paper>
                </Grid>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    open={ snackState.open }
                    onClose={ handleSnackClose }
                    autoHideDuration={ snackState.autoHide }
                    TransitionComponent={ snackState.Transition }
                >
                    <Alert
                        onClose={ handleSnackClose }
                        severity={ snackState.severity }
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        { snackState.text }
                    </Alert>
                </Snackbar>
            </Grid>
            <Dialog
                open={ modalEliminar.abierto }
                keepMounted
                onClose={ handleModalEliminar }
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Eliminar recibo</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        ¿Estás seguro que quieres eliminar el recibo { modalEliminar.nombre }?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={ handleModalEliminar }>Cancelar</Button>
                    <Button color="error" variant="contained" onClick={ () => handleEliminar(modalEliminar.id) }>Eliminar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}