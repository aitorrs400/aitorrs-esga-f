import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Paper, Slide, Snackbar, Tooltip, Typography, Zoom } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

import { axiosInstance } from '../helpers/axios';
import { mensajesBack } from "../helpers/mensajesBack";


export const GasolinerasPage = () => {

    // Preparamos los estados necesarios
    const [loading, setLoading] = useState(true);
    const [gasolinerasList, setGasolinerasList] = useState([]);
    const [modalEliminar, setModalEliminar] = useState({ abierto: false, id: '', nombre: '' });
    const [snackState, setSnackState] = useState({ open: false, Transition: Slide, text: 'Snackbar sin asignar', severity: 'info', autoHide: 5000 });

    const navigate = useNavigate();

    // Listado de columnas que tendrá la tabla
    const columns = [
        { field: 'nombre', headerName: 'Nombre', width: 220 },
        { field: 'direccion', headerName: 'Dirección', width: 240 },
        { field: 'numero', headerName: 'Núm.', width: 100 },
        { field: 'localidad', headerName: 'Localidad', width: 220 },
        { field: 'cp', headerName: 'CP', width: 90 },
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
                    navigate('/gasolineras/detalles/'+params.id, { replace: true });
                };

                const handleEdit = (e) => {
                    e.stopPropagation(); // don't select this row after clicking
                    navigate('/gasolineras/editar/'+params.id, { replace: true });
                };

                const handleDelete = (e) => {
                    e.stopPropagation();
                    setModalEliminar({ abierto: true, id: params.id, nombre: params.row.nombre });
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

        try {

            // Obtenemos el listado de gasolineras
            const data = await axiosInstance.get('/api/gasolineras');
            setGasolinerasList(data.data.gasolineras);
            setLoading(false);

        } catch ( error ) {

            // Generamos el mensaje de error
            let mensaje = mensajesBack(error);

            // Si hay algún error, mostramos un mensaje
            setSnackState({
                ...snackState,
                text: 'Error al obtener el listado de gasolineras. Motivo: '+mensaje,
                severity: 'error',
                open: true,
                autoHide: null
            });

        }

    }

    const handleAdd = () => {
        navigate('/gasolineras/nueva', { replace: true });
    }

    const handleModalEliminar = (e) => {
        setModalEliminar({ abierto: false, id: '', nombre: '' });
    }

    const handleSnackClose = () => {
        setSnackState({ ...snackState, open: false });
    }

    const handleEliminar = async (id) => {
        
        // Cerramos el modal
        handleModalEliminar();

        try {

            // Hacemos la petición al back
            const result = await axiosInstance.delete('/api/gasolineras/'+id);

            // // Mostramos mensaje informativo
            setSnackState({
                ...snackState,
                text: 'Gasolinera eliminada correctamente',
                severity: 'success',
                open: true,
                autoHide: 5000
            }); 
            
            // Volvemos a hacer petición a la API
            peticionesApi();

        } catch( error ) {

            // Generamos el mensaje de error
            let mensaje = mensajesBack(error);

            // Si hay algún error, mostramos un mensaje
            setSnackState({
                ...snackState,
                text: 'Error al eliminar la gasolinera. Motivo: '+mensaje,
                severity: 'error',
                open: true
            });

        }

    }

    return (
        <>
            <Grid container spacing={3}>

                {/* Lista */}
                <Grid item xs={12} md={12} lg={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Mis gasolineras
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
                                            rows={ gasolinerasList }
                                            columns={ columns }
                                            initialState={{
                                                pagination: {
                                                    paginationModel: { page: 0, pageSize: 5 },
                                                },
                                            }}
                                            pageSizeOptions={[5, 10]}
                                        />
                                    </div>
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: '8px' }}>
                                        <Button variant="contained" color="success" endIcon={ <AddIcon /> } onClick={ handleAdd }>Añadir nueva</Button>
                                        <Button variant="contained" color="primary" endIcon={ <RefreshIcon /> } onClick={ peticionesApi }>Actualizar</Button>
                                    </Box>
                                </>
                            )
                        }
                    </Paper>
                </Grid>

                {/* Mensaje de alerta */}
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

            {/* Modalde eliminar */}
            <Dialog
                open={ modalEliminar.abierto }
                keepMounted
                onClose={ handleModalEliminar }
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Eliminar gasolinera</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        ¿Estás seguro que quieres eliminar la gasolinera { modalEliminar.nombre }?
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