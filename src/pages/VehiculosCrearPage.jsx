import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Paper, Typography, TextField, Box, Button, Snackbar, Alert, Slide } from "@mui/material";
import { axiosInstance } from "../helpers/axios";

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AddIcon from '@mui/icons-material/Add';
import { mensajesBack } from "../helpers/mensajesBack";


export const VehiculosCrearPage = () => {

    // Inicializamos variables
    const navigate = useNavigate();

    // Declaración de estados
    const [vehiculo, setVehiculo] = useState({ nombre: '', marca: '', modelo: '', matricula: '', ano: '' });
    const [formErrors, setFormErrors] = useState({ nombre: false, marca: false, modelo: false, matricula: false });
    const [snackState, setSnackState] = useState({ open: false, Transition: Slide, text: 'Snackbar sin asignar', severity: 'info' });

    // Declaración de funciones
    const handleCrear = async (e) => {

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
                const result = await axiosInstance.post('/api/vehiculos', vehiculo);
    
                // Mostramos mensaje informativo
                setSnackState({
                    ...snackState,
                    text: 'Vehículo creado correctamente',
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
                text: 'Error al crear el vehículo. Motivo: '+mensaje,
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

    return (
        <Grid container spacing={3}>

            <Grid item xs={12} md={12} lg={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                        Añadir nuevo vehiculo
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={5}>
                            <TextField
                                required
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
                        <Grid item xs={12} sm={3}>
                            <TextField
                                required
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
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
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
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
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
                        <Grid item xs={12} sm={3}>
                            <TextField
                                id="ano"
                                label="Año"
                                variant="filled"
                                value={ vehiculo.ano }
                                onChange={ (e) => setVehiculo(prev => ({ ...prev, ano: e.target.value })) }
                                sx={{ width: '100%' }}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: '8px', sm: '0' }, justifyContent: 'space-between' }}>
                        <Button variant="contained" onClick={ handleAtras } startIcon={ <ArrowBackIosIcon /> }>
                            Atrás
                        </Button>
                        <Button variant="contained" color="success" onClick={ handleCrear } endIcon={ <AddIcon /> }>
                            Crear
                        </Button>
                    </Box>
                </Paper>
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