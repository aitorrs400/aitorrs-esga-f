import { useState } from "react";
import { Alert, Box, Button, Grid, Paper, Slide, Snackbar, TextField, Typography } from "@mui/material";

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../helpers/axios";
import { mensajesBack } from "../helpers/mensajesBack";


export const GasolinerasCrearPage = () => {

    // Inicializamos variables
    const navigate = useNavigate();

    const [formErrors, setFormErrors] = useState({ nombre: false, direccion: false, numero: false, localidad: false, cp: false, provincia: false, pais: false });
    const [dirGasolinera, setDirGasolinera] = useState({ nombre: '', direccion: '', numero: '', localidad: '', cp: '', provincia: '', pais: '' });
    const [snackState, setSnackState] = useState({ open: false, Transition: Slide, text: 'Snackbar sin asignar', severity: 'info' });

    // Funciones
    const handleCrear = async (e) => {

        let errors = false;
        let errorsForm = { direccion: false, numero: false, localidad: false, cp: false, provincia: false, pais: false, nombre: false };

        // Validamos todos los campos primero
        if( dirGasolinera.direccion === '' ) {
            errorsForm.direccion = true;
            errors = true;
        }
        
        if( dirGasolinera.numero === '' ) {
            errorsForm.numero = true;
            errors = true;
        }
        
        if( dirGasolinera.localidad === '' ) {
            errorsForm.localidad = true;
            errors = true;
        }

        if( dirGasolinera.cp === '' ) {
            errorsForm.cp = true;
            errors = true;
        }

        if( dirGasolinera.provincia === '' ) {
            errorsForm.provincia = true;
            errors = true;
        }

        if( dirGasolinera.pais === '' ) {
            errorsForm.pais = true;
            errors = true;
        }

        if( dirGasolinera.nombre === '' ) {
            errorsForm.nombre = true;
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
                const result = await axiosInstance.post('/api/gasolineras', dirGasolinera);
    
                // // Mostramos mensaje informativo
                setSnackState({
                    ...snackState,
                    text: 'Gasolinera creada correctamente',
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
                text: 'Error al crear la gasolinera. Motivo: '+mensaje,
                severity: 'error',
                open: true
            });

        }

    }

    const handleAtras = (e) => {
        navigate('/gasolineras', { replace: true });
    }

    const handleSnackClose = () => {
        setSnackState({ ...snackState, open: false });
    }

    return (
        <Grid container spacing={3}>

            <Grid item xs={12} md={12} lg={12}>
                <Grid container spacing={3}>

                    <Grid item xs={12} md={6} lg={6}>
                        <Grid container spacing={3}>

                            {/* Dirección */}
                            <Grid item xs={12} md={12} lg={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                        Dirección de la gasolinera
                                    </Typography>

                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid item xs={12} sm={9} md={9} lg={9}>
                                            <TextField
                                                required
                                                error={ formErrors.direccion }
                                                helperText={ formErrors.direccion ? "Campo obligatorio" : "" }
                                                id="direccion"
                                                label="Dirección"
                                                variant="filled"
                                                value={ dirGasolinera.direccion }
                                                onChange={ (e) => setDirGasolinera(prev => ({ ...prev, direccion: e.target.value })) }
                                                sx={{ width: '100%' }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3} md={3} lg={3}>
                                            <TextField
                                                required
                                                error={ formErrors.numero }
                                                helperText={ formErrors.numero ? "Campo obligatorio" : "" }
                                                id="numero"
                                                label="Número"
                                                variant="filled"
                                                value={ dirGasolinera.numero }
                                                onChange={ (e) => setDirGasolinera(prev => ({ ...prev, numero: e.target.value })) }
                                                sx={{ width: '100%' }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid item xs={12} sm={8} md={8} lg={8}>
                                            <TextField
                                                required
                                                error={ formErrors.localidad }
                                                helperText={ formErrors.localidad ? "Campo obligatorio" : "" }
                                                id="localidad"
                                                label="Localidad"
                                                variant="filled"
                                                value={ dirGasolinera.localidad }
                                                onChange={ (e) => setDirGasolinera(prev => ({ ...prev, localidad: e.target.value })) }
                                                sx={{ width: '100%' }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4} md={4} lg={4}>
                                            <TextField
                                                required
                                                error={ formErrors.cp }
                                                helperText={ formErrors.cp ? "Campo obligatorio" : "" }
                                                id="cp"
                                                label="Código postal"
                                                variant="filled"
                                                value={ dirGasolinera.cp }
                                                onChange={ (e) => setDirGasolinera(prev => ({ ...prev, cp: e.target.value })) }
                                                sx={{ width: '100%' }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField
                                                required
                                                error={ formErrors.provincia }
                                                helperText={ formErrors.provincia ? "Campo obligatorio" : "" }
                                                id="provincia"
                                                label="Provincia"
                                                variant="filled"
                                                value={ dirGasolinera.provincia }
                                                onChange={ (e) => setDirGasolinera(prev => ({ ...prev, provincia: e.target.value })) }
                                                sx={{ width: '100%' }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField
                                                required
                                                error={ formErrors.pais }
                                                helperText={ formErrors.pais ? "Campo obligatorio" : "" }
                                                id="pais"
                                                label="País"
                                                variant="filled"
                                                value={ dirGasolinera.pais }
                                                onChange={ (e) => setDirGasolinera(prev => ({ ...prev, pais: e.target.value })) }
                                                sx={{ width: '100%' }}
                                            />
                                        </Grid>
                                    </Grid>

                                </Paper>
                            </Grid>

                            {/* Otros datos */}
                            <Grid item xs={12} md={12} lg={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                        Otros datos
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={12} lg={12}>
                                            <TextField
                                                required
                                                error={ formErrors.nombre }
                                                helperText={ formErrors.nombre ? "Campo obligatorio" : "" }
                                                id="nombre"
                                                label="Nombre"
                                                variant="filled"
                                                value={ dirGasolinera.nombre }
                                                onChange={ (e) => setDirGasolinera(prev => ({ ...prev, nombre: e.target.value })) }
                                                sx={{ width: '100%' }}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: '8px', sm: '0' }, justifyContent: 'space-between' }}>
                                                <Button variant="contained" onClick={ handleAtras } startIcon={ <ArrowBackIosIcon /> }>
                                                    Atrás
                                                </Button>
                                                <Button variant="contained" color="success" onClick={ handleCrear } endIcon={ <AddIcon /> }>
                                                    Crear
                                                </Button>
                                            </Box>
                                        </Grid>

                                    </Grid>


                                </Paper>
                            </Grid>

                        </Grid>
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
    )
}