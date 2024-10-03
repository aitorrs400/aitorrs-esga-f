import { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, Grid, Paper, Slide, Snackbar, TextField, Typography } from "@mui/material";

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../helpers/axios";
import { mensajesBack } from "../helpers/mensajesBack";

// Librerías de Google Maps API
const { Map } = await google.maps.importLibrary("maps");
const { Marker } = await google.maps.importLibrary("marker");

export const GasolinerasVerEditarPage = ({ edicion }) => {

    // Obtenemos el ID de la gasolinera a ver
    const { id } = useParams();

    // Inicializamos variables
    const navigate = useNavigate();
    let mapRef = useRef(null);

    const [map, setMap] = useState();
    const [marker, setMarker] = useState();
    const [formErrors, setFormErrors] = useState({ nombre: false, direccion: false, numero: false, localidad: false, cp: false, provincia: false, pais: false, coordenadas: false });
    const [dirGasolinera, setDirGasolinera] = useState({ nombre: '', direccion: '', numero: '', localidad: '', cp: '', provincia: '', pais: '', coordenadas: '' });
    const [snackState, setSnackState] = useState({ open: false, Transition: Slide, text: 'Snackbar sin asignar', severity: 'info' });

    // Efectos
    useEffect(() => {
        peticionesApi();
    },[]);

    // Crear el mapa
    useEffect(() => {
        if( mapRef.current !== null ) {

            // Creamos el mapa
            setMap(new Map(document.getElementById("map"), {
                zoom: 0,
                center: { lat: 0.0, lng: 0.0 },
                mapId: "DEMO_MAP_ID",
            }));

            // Creamos el marcador
            setMarker(new Marker({ position: { lat: 0.0, lng: 0.0 }, title: dirGasolinera.nombre }));

        }
    },[mapRef]);

    // Actualizar el mapa
    useEffect(() => {
        if( map !== undefined && marker !== undefined ) {

            // Ajustamos el mapa
            map.setZoom(18);
            map.setCenter(dirGasolinera.coordenadas);
            marker.setPosition(dirGasolinera.coordenadas);
            marker.setMap(map);

        }
    },[dirGasolinera.coordenadas]);

    const handleSave = async (e) => {

        let errors = false;
        let errorsForm = { direccion: false, numero: false, localidad: false, cp: false, provincia: false, pais: false, nombre: false, coordenadas: false };

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

        if( dirGasolinera.coordenadas === '' ) {
            errorsForm.coordenadas = true;
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
                const result = await axiosInstance.put('/api/gasolineras/'+id, dirGasolinera);
    
                // Mostramos mensaje informativo
                setSnackState({
                    ...snackState,
                    text: 'Gasolinera actualizada correctamente',
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

    const peticionesApi = async () => {

        try {

            // Obtenemos la gasolinera
            const gasolinera = await axiosInstance.get('/api/gasolineras/'+id);
            setDirGasolinera( gasolinera.data.data );

        } catch ( error ) {

            // Generamos el mensaje de error
            let mensaje = mensajesBack(error);

            // Si hay algún error, mostramos un mensaje
            setSnackState({
                ...snackState,
                text: 'Error al obtener la gasolinera. Motivo: '+mensaje,
                severity: 'error',
                open: true,
                autoHide: null
            });

        }

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

                                    <Grid item xs={12} sm={12} lg={12}>
                                        <TextField
                                            required
                                            disabled={ !edicion }
                                            error={ formErrors.nombre }
                                            helperText={ formErrors.nombre ? "Campo obligatorio" : "" }
                                            id="nombre"
                                            label="Nombre"
                                            variant="filled"
                                            value={ dirGasolinera.nombre }
                                            onChange={ (e) => setDirGasolinera(prev => ({ ...prev, nombre: e.target.value })) }
                                            sx={{ width: '100%', mb: 2 }}
                                        />
                                    </Grid>

                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid item xs={12} sm={9} md={9} lg={9}>
                                            <TextField
                                                required
                                                disabled={ !edicion }
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
                                                disabled={ !edicion }
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
                                                disabled={ !edicion }
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
                                                disabled={ !edicion }
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

                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField
                                                required
                                                disabled={ !edicion }
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
                                                disabled={ !edicion }
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

                                    <Grid item xs={12} md={12} lg={12}>
                                        <TextField
                                            required
                                            error={ formErrors.coordenadas }
                                            helperText={ formErrors.coordenadas ? "Campo obligatorio. Busca una dirección para asignar coordenadas" : "" }
                                            disabled
                                            id="coords"
                                            label="Coordenadas"
                                            variant="filled"
                                            value={ '('+dirGasolinera.coordenadas.lat+', '+dirGasolinera.coordenadas.lng+')' }
                                            sx={{ width: '100%' }}
                                        />
                                    </Grid>

                                    <Box sx={{ mt: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: '8px', sm: '0' }, justifyContent: 'space-between' }}>
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

                    {/* Mapa */}
                    <Grid item xs={12} md={6} lg={6}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Mapa de la gasolinera
                            </Typography>
                            <div id="map" ref={ mapRef }></div>
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
    )
}