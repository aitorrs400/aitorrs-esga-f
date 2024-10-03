import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, Slide, Snackbar, TextField, Typography } from "@mui/material";
import { green } from '@mui/material/colors';
import { MuiFileInput } from 'mui-file-input';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import CloseIcon from "@mui/icons-material/Close";
import UploadIcon from '@mui/icons-material/Upload';
import { axiosFileInstance, axiosInstance } from "../helpers/axios";
import { mensajesBack } from "../helpers/mensajesBack";

export const VehiculosVerEditarPage = ({ edicion }) => {

    // Inicializamos variables
    const navigate = useNavigate();
    const { id } = useParams();

    // Iniciamos estados
    const [formErrors, setFormErrors] = useState({ nombre: false, marca: false, modelo: false, matricula: false });
    const [vehiculo, setVehiculo] = useState({ nombre: '', marca: '', modelo: '', ano: '', matricula: '', fotoURL: '', fotoID: '' });
    const [modalEliminar, setModalEliminar] = useState({ abierto: false, id: '' });
    const [snackState, setSnackState] = useState({ open: false, Transition: Slide, text: 'Snackbar sin asignar', severity: 'info' });
    const [file, setFile] = useState(null);
    const [isFileUploading, setIsFileUploading] = useState(false);

    // Efectos
    useEffect(() => {
        peticionesApi();
    },[]);

    // Funciones
    const handleChange = (newFile) => {
        setFile(newFile);
    }

    const handleSave = async (e) => {

        let errors = false;
        let errorsForm = { nombre: false, marca: false, modelo: false, matricula: false };

        // Validamos todos los campos primero
        if( vehiculo.nombre === '' ) {
            errorsForm.nombre = true;
            errors = true;
        }
        
        if( vehiculo.marca === '' ) {
            errorsForm.marca = true;
            errors = true;
        }
        
        if( vehiculo.modelo === '' ) {
            errorsForm.modelo = true;
            errors = true;
        }

        if( vehiculo.matricula === '' ) {
            errorsForm.matricula = true;
            errors = true;
        }

        // Una vez revisados, seteamos todos los resultados en el estado
        setFormErrors(errorsForm);

        try {

            // Si hay algún error, no seguimos
            if( errors ) {

                // Mostramos un mensaje
                setSnackState({
                    ...snackState,
                    text: 'Errores en el formulario. Revisa todos los campos',
                    severity: 'error',
                    open: true
                });

            } else {

                // Hacemos la petición al back
                const result = await axiosInstance.put('/api/vehiculos/'+id, vehiculo);
    
                // Mostramos mensaje informativo
                setSnackState({
                    ...snackState,
                    text: 'Vehículo actualizado correctamente',
                    severity: 'success',
                    open: true
                });

            }

        } catch( error ) {

            // Generamos el mensaje de error
            let mensaje = mensajesBack(error);

            // Si hay algún error, mostramos un mensaje
            setSnackState({
                ...snackState,
                text: 'Error al actualizar el vehículo. Motivo: '+mensaje,
                severity: 'error',
                open: true
            });

        }

    }

    const hadleFileSubmit = async (e) => {
        e.preventDefault();

        // Seteamos el estado de carga de archivos
        setIsFileUploading(true);

        try {

            // Preparamos el archivo
            const formData = new FormData();
            formData.append('foto', file);

            // Enviamos el archivo al back
            const result = await axiosFileInstance.post('/api/archivos/vehiculo/'+id, formData);
            
            // Seteamos la URL al objeto
            setVehiculo( prev => ({ ...prev, fotoURL: result.data.url, fotoID: result.data.id }));

            // Mostramos mensaje informativo
            setSnackState({
                ...snackState,
                text: 'Foto subida correctamente',
                severity: 'success',
                open: true
            });

            // Seteamos el estazdo de carga de archivos
            setIsFileUploading(false);

        } catch ( error ) {

            // Generamos el mensaje de error
            let mensaje = mensajesBack(error);

            // Mostramos un mensaje
            setSnackState({
                ...snackState,
                text: 'Errores al subir la imagen: '+mensaje,
                severity: 'error',
                open: true
            });

            setIsFileUploading(false);

        }

    }

    const handleDeleteFile = async (e) => {

        e.stopPropagation();
        setModalEliminar({ abierto: true, id: vehiculo.id });

    }

    const handleDeleteFileConfirm = async (id) => {

        // Cerramos el modal
        handleModalEliminar();

        // Llamamos al back para eliminar la foto
        try {

            // Hacemos la petición
            await axiosInstance.delete('/api/archivos/vehiculo/'+id);

            // Seteamos los valores del vehículo
            setVehiculo(prev => ({ ...prev, fotoURL: '', fotoID: '' }));

            // Mostramos mensaje informativo
            setSnackState({
                ...snackState,
                text: 'Foto eliminada correctamente',
                severity: 'success',
                open: true
            });

        } catch ( error ) {

            // Generamos el mensaje de error
            let mensaje = mensajesBack(error);

            // Mostramos un mensaje
            setSnackState({
                ...snackState,
                text: 'Error al eliminar la imagen: '+mensaje,
                severity: 'error',
                open: true
            });

        }

    }

    const handleAtras = (e) => {
        navigate('/vehiculos', { replace: true });
    }

    const handleSnackClose = () => {
        setSnackState({ ...snackState, open: false });
    }

    const handleModalEliminar = (e) => {
        setModalEliminar({ abierto: false, id: '', nombre: '' });
    }

    const peticionesApi = async () => {

        try {

            // Obtenemos el vehículo
            const vehiculoApi = await axiosInstance.get('/api/vehiculos/'+id);
            setVehiculo( vehiculoApi.data.data );

        } catch ( error ) {

            // Generamos el mensaje de error
            let mensaje = mensajesBack(error);

            // Si hay algún error, mostramos un mensaje
            setSnackState({
                ...snackState,
                text: 'Error al obtener el vehículo. Motivo: '+mensaje,
                severity: 'error',
                open: true,
                autoHide: null
            });

        }

    }

    return (
        <>
            <Grid container spacing={3}>

                <Grid item xs={12} md={12} lg={12}>
                    <Grid container spacing={3}>

                        <Grid item xs={12} md={6} lg={6}>
                            <Grid container spacing={3}>

                                {/* Datos del vehículo */}
                                <Grid item xs={12} md={12} lg={12}>
                                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                            Datos del vehículo
                                        </Typography>
                                        <Grid container spacing={2} sx={{ mb: 2 }}>
                                            <Grid item xs={12} sm={7} md={7} lg={7}>
                                                <TextField
                                                    required
                                                    disabled={ !edicion }
                                                    error={ formErrors.nombre }
                                                    helperText={ formErrors.nombre ? "Campo obligatorio" : "" }
                                                    id="nombre"
                                                    label="Nombre"
                                                    variant="filled"
                                                    value={ vehiculo.nombre }
                                                    onChange={ (e) => setVehiculo(prev => ({ ...prev, nombre: e.target.value })) }
                                                    sx={{ width: '100%' }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={5} md={5} lg={5}>
                                                <TextField
                                                    required
                                                    disabled={ !edicion }
                                                    error={ formErrors.marca }
                                                    helperText={ formErrors.marca ? "Campo obligatorio" : "" }
                                                    id="marca"
                                                    label="Marca"
                                                    variant="filled"
                                                    value={ vehiculo.marca }
                                                    onChange={ (e) => setVehiculo(prev => ({ ...prev, marca: e.target.value })) }
                                                    sx={{ width: '100%' }}
                                                />
                                            </Grid> 
                                        </Grid>
                                        <Grid container spacing={2} sx={{ mb: 2 }}>
                                            <Grid item xs={12} sm={5} md={5} lg={5}>
                                                <TextField
                                                    required
                                                    disabled={ !edicion }
                                                    error={ formErrors.modelo }
                                                    helperText={ formErrors.modelo ? "Campo obligatorio" : "" }
                                                    id="modelo"
                                                    label="Modelo"
                                                    variant="filled"
                                                    value={ vehiculo.modelo }
                                                    onChange={ (e) => setVehiculo(prev => ({ ...prev, modelo: e.target.value })) }
                                                    sx={{ width: '100%' }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3} md={3} lg={3}>
                                                <TextField
                                                    disabled={ !edicion }
                                                    id="ano"
                                                    label="Año"
                                                    variant="filled"
                                                    value={ vehiculo.ano }
                                                    onChange={ (e) => setVehiculo(prev => ({ ...prev, ano: e.target.value })) }
                                                    sx={{ width: '100%' }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                                <TextField
                                                    required
                                                    disabled={ !edicion }
                                                    error={ formErrors.matricula }
                                                    helperText={ formErrors.matricula ? "Campo obligatorio" : "" }
                                                    id="matricula"
                                                    label="Matrícula"
                                                    variant="filled"
                                                    value={ vehiculo.matricula }
                                                    onChange={ (e) => setVehiculo(prev => ({ ...prev, matricula: e.target.value })) }
                                                    sx={{ width: '100%' }}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                            <Button variant="contained" onClick={ handleAtras } startIcon={ <ArrowBackIosIcon /> }>
                                                Atrás
                                            </Button>
                                            {
                                                edicion && (
                                                    <Button color="warning" variant="contained" onClick={ handleSave } endIcon={ <SaveAsIcon /> }>
                                                        Guardar
                                                    </Button>
                                                )
                                            }
                                        </Box>
                                    </Paper>
                                </Grid>

                            </Grid>
                        </Grid>

                        {/* Foto del vehículo */}
                        <Grid item xs={12} md={6} lg={6}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                    Foto del vehículo
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        {
                                            vehiculo.fotoURL !== ''
                                                ? (
                                                    <Card>
                                                        <CardMedia
                                                            component="img"
                                                            image={ vehiculo.fotoURL }
                                                        />
                                                        {
                                                            edicion && (
                                                                <CardActions sx={{ justifyContent: 'flex-end' }}>
                                                                    <Button variant="contained" color="error" onClick={ handleDeleteFile }>Eliminar</Button>
                                                                </CardActions>
                                                            )
                                                        }
                                                    </Card>
                                                ) : (
                                                    <Typography>Este vehículo no tiene ninguna foto subida</Typography>
                                                )
                                        }
                                    </Grid>
                                    <Grid item xs={12}>
                                        {
                                            edicion && vehiculo.fotoURL === '' && (
                                                <form
                                                    onSubmit={ hadleFileSubmit }
                                                    encType="multipart/form-data"
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        gap: '16px'
                                                    }}
                                                >
                                                    <MuiFileInput
                                                        size="small"
                                                        value={ file }
                                                        onChange={ handleChange }
                                                        disabled={ isFileUploading }
                                                        inputProps={{ accept: '.png, .jpg, .jpeg' }}
                                                        clearIconButtonProps={{ title: "Eliminar", children: <CloseIcon fontSize="small" /> }}
                                                    />
                                                    <Box sx={{ position: 'relative' }}>
                                                        <Button
                                                            type="submit"
                                                            variant="contained"
                                                            disabled={ file === null || isFileUploading }
                                                            endIcon={ <UploadIcon /> }
                                                        >
                                                            Subir
                                                        </Button>
                                                        {
                                                            isFileUploading && (
                                                                <CircularProgress
                                                                    size={24}
                                                                    sx={{
                                                                        color: green[500],
                                                                        position: 'absolute',
                                                                        top: '50%',
                                                                        left: '50%',
                                                                        marginTop: '-12px',
                                                                        marginLeft: '-12px',
                                                                    }}
                                                                />
                                                            )
                                                        }
                                                    </Box>
                                                </form>
                                            )
                                        }
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                    </Grid>
                </Grid>

                {/* Mensaje de alerta */}
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    open={ snackState.open }
                    onClose={ handleSnackClose }
                    autoHideDuration={ 5000 }
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
                <DialogTitle>Eliminar foto del vehículo</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        ¿Estás seguro que quieres eliminar la foto del vehículo?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={ handleModalEliminar }>Cancelar</Button>
                    <Button color="error" variant="contained" onClick={ () => handleDeleteFileConfirm(modalEliminar.id) }>Eliminar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}