import { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, Grid, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper, Slide, Snackbar, TextField, Typography } from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../helpers/axios";
import { mensajesBack } from "../helpers/mensajesBack";

// Librerías de Google Maps API
const { Map } = await google.maps.importLibrary("maps");
const { Marker } = await google.maps.importLibrary("marker");

export const GasolinerasCrearPage = () => {

    // Inicializamos variables
    const navigate = useNavigate();
    const geocoder = new google.maps.Geocoder();
    let mapRef = useRef(null);

    const [map, setMap] = useState();
    const [marker, setMarker] = useState();
    const [geoLocation, setGeolocation] = useState({ ko: false, status: '' });
    const [address, setAddress] = useState('');
    const [addressList, setAddressList] = useState([]);
    const [formErrors, setFormErrors] = useState({ nombre: false, direccion: false, numero: false, localidad: false, cp: false, provincia: false, pais: false, coordenadas: false });
    const [dirGasolinera, setDirGasolinera] = useState({ nombre: '', direccion: '', numero: '', localidad: '', cp: '', provincia: '', pais: '', coordenadas: '' });
    const [snackState, setSnackState] = useState({ open: false, Transition: Slide, text: 'Snackbar sin asignar', severity: 'info' });

    // Efectos
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
  
    // Funciones
    const handleIntro = (e) => {
        if (e.keyCode === 13) {
            codeAddress();
        }
    }

    const handleCrear = async (e) => {

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

    const codeAddress = () => {
        geocoder.geocode( { 'address': address }, (results, status) => {

            if (status == 'OK') {
                setAddressList(results);
                setGeolocation({ ko: false, status: '' });
            } else {
                setAddressList([]);
                setGeolocation({ ko: true, status });
            }
        });
    }

    const selectAddress = ( addressId ) => {
        
        // Preparamos las variables
        const addressItem = addressList[addressId];
        let numero = '';
        let direccion = '';
        let localidad = '';
        let cp = '';
        let provincia = '';
        let pais = '';

        // Mapeamos los componentes de la dirección
        addressItem.address_components.map( element => {
            switch( element.types[0] ) {
                case 'street_number':
                    numero = element.long_name;
                    break;
                case 'route':
                    direccion = element.long_name;
                    break;
                case 'locality':
                    localidad = element.long_name;
                    break;
                case 'postal_code':
                    cp = element.long_name;
                    break;
                case 'administrative_area_level_2':
                    provincia = element.long_name;
                    break;
                case 'country':
                    pais = element.long_name;
                    break;
            }
        })

        // Finalmente asignamos todos los valores al estado
        setDirGasolinera( prev => ({ ...prev, numero, direccion, localidad, cp, provincia, pais, coordenadas: addressItem.geometry.location }));

        // Ajustamos el mapa
        map.setZoom(18);
        map.setCenter(addressItem.geometry.location);
        marker.setPosition(addressItem.geometry.location);
        marker.setMap(map);

    }

    return (
        <Grid container spacing={3}>

            {/* Cuadro de búsqueda */}
            <Grid item xs={12} md={12} lg={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                        Búsqueda de direcciones
                    </Typography>
                    <TextField
                        id="address"
                        label="Dirección"
                        variant="filled"
                        value={ address }
                        onChange={ (e) => setAddress(e.target.value) }
                        onKeyDown={ handleIntro }
                    />
                    {
                        addressList.length > 0 && (
                            <List sx={{ mt: 2 }} subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                    Direcciones encontradas
                                </ListSubheader>
                            }>
                            {
                                addressList.map( (item, index) => (
                                    <ListItemButton key={ index } onClick={ () => selectAddress(index) }>
                                        <ListItemIcon>
                                            <PlaceIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={ item.formatted_address } secondary={ item.plus_code ? item.plus_code.global_code : '' } />
                                    </ListItemButton>
                                ))
                            } 
                            </List>
                        )
                    }
                    {
                        geoLocation.ko && (<Alert severity="error" sx={{ mt: 2 }}>La geolocalización no ha funcionado. Motivo: <b>{ geoLocation.status }</b></Alert>)
                    }
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" onClick={ codeAddress } endIcon={ <SearchIcon /> }>
                            Buscar
                        </Button>
                    </Box>
                </Paper>
            </Grid>

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

                                        <Grid item xs={12} sm={6} md={12} lg={12}>
                                            <TextField
                                                required
                                                error={ formErrors.coordenadas }
                                                helperText={ formErrors.coordenadas ? "Campo obligatorio. Busca una dirección para asignar coordenadas" : "" }
                                                disabled
                                                id="coords"
                                                label="Coordenadas"
                                                variant="filled"
                                                value={ dirGasolinera.coordenadas }
                                                onChange={ (e) => setDirGasolinera(prev => ({ ...prev, coordenadas: e.target.value })) }
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