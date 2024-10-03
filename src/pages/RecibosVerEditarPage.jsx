import { Alert, Box, Button, Card, CardActions, CardMedia, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormHelperText, Grid, InputAdornment, InputLabel, MenuItem, Paper, Select, Slide, Snackbar, TextField, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { mensajesBack } from "../helpers/mensajesBack";
import { axiosFileInstance, axiosInstance } from "../helpers/axios";

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import CloseIcon from "@mui/icons-material/Close";
import UploadIcon from '@mui/icons-material/Upload';
import { MuiFileInput } from "mui-file-input";
import { green } from "@mui/material/colors";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import moment from 'moment';
import 'moment/locale/es'; // Importa el idioma español

// Librerías de Google Maps API
const { Map } = await google.maps.importLibrary("maps");
const { Marker } = await google.maps.importLibrary("marker");

// Configuramos MomentJS
moment.locale('es');

export const RecibosVerEditarPage = ({ edicion }) => {

    // Obtenemos el ID del recibo a ver
    const navigate = useNavigate();
    const { id } = useParams();
    let mapRef = useRef(null);

    // Iniciamos estados
    const [recibo, setRecibo] = useState({ codigo: '', precioE: '', litros: '', precioEL:'', carburante: -1, fecha: moment(), gasolinera: '', vehiculo: '', fotoURL: '', fotoID: '' });
    const [gasolinera, setGasolinera] = useState({ nombre: '', direccion: '', numero: '', localidad: '', cp: '', provincia: '', pais: '', coordenadas: { lat: '0.0000000', lng: '0.0000000' } });
    const [vehiculo, setVehiculo] = useState({ nombre: '', marca: '', modelo: '', ano: '', matricula: '', foto: '' });
    const [gasolinerasList, setGasolinerasList] = useState([]);
    const [vehiculosList, setVehiculosList] = useState([]);
    const [file, setFile] = useState(null);
    const [map, setMap] = useState();
    const [marker, setMarker] = useState();
    const [modalEliminar, setModalEliminar] = useState({ abierto: false, id: '' });
    const [isFileUploading, setIsFileUploading] = useState(false);
    const [formErrors, setFormErrors] = useState({ codigo: false, precioE: false, precioEnum: false, litros: false, litrosNum: false, precioEL: false, precioELnum: false, carburante: false, fecha: false, gasolinera: false, vehiculo: false });
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
            setMarker(new Marker({ position: { lat: 0.0, lng: 0.0 }, title: gasolinera.nombre }));

        }
    },[mapRef]);

    // Cargar la gasolinera si cambia
    useEffect(() => {

        if( gasolinerasList.length > 0 ) {

            const gasolineraFiltrada = gasolinerasList.filter( v => v.id === recibo.gasolinera )[0];
            if( gasolineraFiltrada !== undefined ) {
                setGasolinera(gasolinerasList.filter( v => v.id === recibo.gasolinera )[0]);
            } else {
                setGasolinera({ nombre: '', direccion: '', numero: '', localidad: '', cp: '', provincia: '', pais: '', coordenadas: { lat: '0.0000000', lng: '0.0000000' } });
            }
        }

    },[gasolinerasList, recibo.gasolinera]);

    // Cargar el vehículo si cambia
    useEffect(() => {

        if( vehiculosList.length > 0 ) {

            const vehiculoFiltrado = vehiculosList.filter( v => v.id === recibo.vehiculo )[0];
            if( vehiculoFiltrado !== undefined ) {
                setVehiculo(vehiculosList.filter( v => v.id === recibo.vehiculo )[0]);
            } else {
                setVehiculo({ nombre: '', marca: '', modelo: '', ano: '', matricula: '', foto: '' });
            }
        }

    },[vehiculosList, recibo.vehiculo]);

    // Actualizar el mapa
    useEffect(() => {
        if( map !== undefined && marker !== undefined ) {

            // Ajustamos el mapa
            map.setZoom(18);
            map.setCenter(gasolinera.coordenadas);
            marker.setPosition(gasolinera.coordenadas);
            marker.setMap(map);

        }
    },[gasolinera.coordenadas]);

    // Funciones
    const peticionesApi = async () => {

        try {

            // Obtenemos el recibo
            const reciboApi = await axiosInstance.get('/api/recibos/'+id);
            setRecibo({
                ...reciboApi.data.data,
                fecha: moment(reciboApi.data.data.fecha),
                precioE: reciboApi.data.data.precioE.$numberDecimal.toString(),
                litros: reciboApi.data.data.litros.$numberDecimal.toString(),
                precioEL: reciboApi.data.data.precioEL.$numberDecimal.toString(),
            });

            // Obtenemos el listado de gasolineras
            const listaGasolineras = await axiosInstance.get('/api/gasolineras');
            setGasolinerasList(listaGasolineras.data.gasolineras);

            // Obtenemos el listado de vehículos
            const listaVehiculos = await axiosInstance.get('/api/vehiculos');
            setVehiculosList(listaVehiculos.data.vehiculos);

        } catch ( error ) {

            // Generamos el mensaje de error
            let mensaje = mensajesBack(error);

            // Si hay algún error, mostramos un mensaje
            setSnackState({
                ...snackState,
                text: 'Error al obtener datos de la API. Motivo: '+mensaje,
                severity: 'error',
                open: true,
                autoHide: null
            });

        }

    }

    const handleChange = (newFile) => {
        setFile(newFile);
    }

    const hadleFileSubmit = async (e) => {
        e.preventDefault();

        // Seteamos el estado de carga de archivos
        setIsFileUploading(true);

        try {

            // Preparamos el archivo
            const formData = new FormData();
            formData.append('recibo', file);

            // Enviamos el archivo al back
            const result = await axiosFileInstance.post('/api/archivos/recibo/'+id, formData);
            
            // Seteamos la URL al objeto
            setRecibo( prev => ({ ...prev, fotoURL: result.data.url, fotoID: result.data.id }));

            // Mostramos mensaje informativo
            setSnackState({
                ...snackState,
                text: 'Imagen del recibo subida correctamente',
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
        setModalEliminar({ abierto: true, id: recibo.id });

    }

    const handleDeleteFileConfirm = async (id) => {

        // Cerramos el modal
        handleModalEliminar();

        // Llamamos al back para eliminar la foto
        try {

            // Hacemos la petición
            await axiosInstance.delete('/api/archivos/recibo/'+id);

            // Seteamos los valores del vehículo
            setRecibo(prev => ({ ...prev, fotoURL: '', fotoID: '' }));

            // Mostramos mensaje informativo
            setSnackState({
                ...snackState,
                text: 'Imagen eliminada correctamente',
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

    const handleSnackClose = () => {
        setSnackState({ ...snackState, open: false });
    }

    const handleAtras = (e) => {
        navigate('/recibos', { replace: true });
    }

    const handleModalEliminar = (e) => {
        setModalEliminar({ abierto: false, id: '', nombre: '' });
    }

    const handleBlur = (e) => {

        const valor = e.target.value;
        const clave = e.target.id;

        if( valor != '' ) {
            if( !isNaN(valor) ) {
                if ( !valor.includes('.') ) {
                    setRecibo((prev) => ({ ...prev, [clave]: valor+'.00' }));
                }
            }
        }

    }

    const handleSave = async (e) => {

        console.log('Save')

        let errors = false;
        let errorsForm = { codigo: false, precioE: false, precioEnum: false, litros: false, litrosNum: false, precioEL: false, precioELnum: false, carburante: false, fecha: false, gasolinera: false, vehiculo: false };

        // Validamos todos los campos primero
        if( recibo.codigo === '' ) {
            errorsForm.codigo = true;
            errors = true;
        }

        if( recibo.precioE === '' ) {
            errorsForm.precioE = true;
            errors = true;
        } else if( isNaN(recibo.precioE) ) {
            errorsForm.precioEnum = true;
            errors = true;
        }

        if( recibo.litros === '' ) {
            errorsForm.litros = true;
            errors = true;
        } else if( isNaN(recibo.litros) ) {
            errorsForm.litrosNum = true;
            errors = true;
        }

        if( recibo.precioEL === '' ) {
            errorsForm.precioEL = true;
            errors = true;
        } else if( isNaN(recibo.precioEL) ) {
            errorsForm.precioELnum = true;
            errors = true;
        }

        if( recibo.carburante === -1 ) {
            errorsForm.carburante = true;
            errors = true;
        }

        if( recibo.fecha === '' ) {
            errorsForm.fecha = true;
            errors = true;
        }

        if( recibo.gasolinera === '' ) {
            errorsForm.gasolinera = true;
            errors = true;
        }

        if( recibo.vehiculo === '' ) {
            errorsForm.vehiculo = true;
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
                const result = await axiosInstance.put('/api/recibos/'+id, recibo);
    
                // Mostramos mensaje informativo
                setSnackState({
                    ...snackState,
                    text: 'Recibo editado correctamente',
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
                text: 'Error al editar el recibo. Motivo: '+mensaje,
                severity: 'error',
                open: true
            });

        }

    }


    return (
        <Grid container spacing={3}>

            {/* Datos en campos */}
            <Grid item xs={ 12 } sm={ 8 } md={ 8 } lg={ 8 }>
                <Grid container spacing={3}>

                    {/* Datos generales */}
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Detalles básicos del recibo
                            </Typography>
                            <Typography component="p">Código: { recibo.codigo }</Typography>
                            <Divider />
                            <Grid container sx={{ mt: 2 }}>
                                <Grid item xs={12} md={ 4 }>
                                    <Typography component="p" variant="h4" sx={{ textAlign: 'center' }}>{ recibo.precioE } €</Typography>
                                </Grid>
                                <Grid item xs={12} md={ 4 }>
                                    <Typography component="p" variant="h4" sx={{ textAlign: 'center' }}>{ recibo.litros } L</Typography>
                                </Grid>
                                <Grid item xs={12} md={ 4 }>
                                    <Typography component="p" variant="h4" sx={{ textAlign: 'center' }}>{ recibo.precioEL } €/L</Typography>
                                </Grid>
                            </Grid>        
                        </Paper>
                    </Grid>

                    {/* Datos */}
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Datos del recibo
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        required
                                        disabled={ !edicion }
                                        error={ formErrors.codigo }
                                        helperText={ formErrors.codigo ? "Campo obligatorio" : "" }
                                        id="codigo"
                                        label="Código del recibo"
                                        variant="filled"
                                        value={ recibo.codigo }
                                        onChange={ (e) => setRecibo(prev => ({ ...prev, codigo: e.target.value })) }
                                        sx={{ width: '100%' }}
                                    />      
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        required
                                        disabled={ !edicion }
                                        error={ formErrors.precioE || formErrors.precioEnum }
                                        helperText={ formErrors.precioE ? "Campo obligatorio" : formErrors.precioEnum ? "Número no válido" : "" }
                                        id="precioE"
                                        label="Precio"
                                        variant="filled"
                                        value={ recibo.precioE }
                                        onChange={ (e) => setRecibo(prev => ({ ...prev, precioE: e.target.value })) }
                                        onBlur={ (e) => handleBlur(e) }
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">€</InputAdornment>,
                                        }}
                                        sx={{ width: '100%' }}
                                    />      
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        required
                                        disabled={ !edicion }
                                        error={ formErrors.litros || formErrors.litrosNum }
                                        helperText={ formErrors.litros ? "Campo obligatorio" : formErrors.litrosNum ? "Número no válido" : "" }
                                        id="litros"
                                        label="Litros"
                                        variant="filled"
                                        value={ recibo.litros }
                                        onChange={ (e) => setRecibo(prev => ({ ...prev, litros: e.target.value })) }
                                        onBlur={ (e) => handleBlur(e) }
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">L</InputAdornment>,
                                        }}
                                        sx={{ width: '100%' }}
                                    />      
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        required
                                        disabled={ !edicion }
                                        error={ formErrors.precioEL || formErrors.precioELnum }
                                        helperText={ formErrors.precioEL ? "Campo obligatorio" : formErrors.precioELnum ? "Número no válido" : "" }
                                        id="precioEL"
                                        label="Precio"
                                        variant="filled"
                                        value={ recibo.precioEL }
                                        onChange={ (e) => setRecibo(prev => ({ ...prev, precioEL: e.target.value })) }
                                        onBlur={ (e) => handleBlur(e) }
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">€/L</InputAdornment>,
                                        }}
                                        sx={{ width: '100%' }}
                                    />      
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControl required disabled={ !edicion } variant="filled" sx={{ width: '100%', minWidth: 120 }} error={ formErrors.carburante }>
                                        <InputLabel id="carburante-label">Carburante</InputLabel>
                                        <Select
                                            id="carburante"
                                            value={ recibo.carburante }
                                            onChange={ (e) => { setRecibo(prev => ({ ...prev, carburante: e.target.value }))} }
                                        >
                                            <MenuItem value={-1}><em>Seleccionar</em></MenuItem>
                                            <MenuItem value={0}>Sin plomo 95</MenuItem>
                                            <MenuItem value={1}>Sin plomo 98</MenuItem>
                                            <MenuItem value={2}>Gasóleo A</MenuItem>
                                            <MenuItem value={3}>Gasóleo B</MenuItem>
                                            <MenuItem value={4}>Gasóleo C</MenuItem>
                                        </Select>
                                        { formErrors.carburante && (<FormHelperText>Campo obligatorio</FormHelperText>) }
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <FormControl required disabled={ !edicion } variant="filled" sx={{ width: '100%', minWidth: 120 }} error={ formErrors.gasolinera }>
                                        <InputLabel id="gasolinera-label">Gasolinera</InputLabel>
                                        <Select
                                            id="gasolinera"
                                            value={ recibo.gasolinera }
                                            onChange={ (e) => setRecibo(prev => ({ ...prev, gasolinera: e.target.value })) }
                                        >
                                            <MenuItem value=""><em>Seleccionar</em></MenuItem>
                                            {
                                                gasolinerasList.map( item => (
                                                    <MenuItem key={ item.id } value={ item.id }>{ item.nombre }</MenuItem>
                                                ))
                                            }
                                        </Select>
                                        { formErrors.gasolinera && (<FormHelperText>Campo obligatorio</FormHelperText>) }
                                    </FormControl>     
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <FormControl required disabled={ !edicion } variant="filled" sx={{ width: '100%', minWidth: 120 }} error={ formErrors.vehiculo }>
                                        <InputLabel id="vehiculo-label">Vehículo</InputLabel>
                                        <Select
                                            id="vehiculo"
                                            value={ recibo.vehiculo }
                                            onChange={ (e) => setRecibo(prev => ({ ...prev, vehiculo: e.target.value })) }
                                        >
                                            <MenuItem value=""><em>Seleccionar</em></MenuItem>
                                            {
                                                vehiculosList.map( item => (
                                                    <MenuItem key={ item.id } value={ item.id }>{ item.nombre }</MenuItem>
                                                ))
                                            }
                                        </Select>
                                        { formErrors.vehiculo && (<FormHelperText>Campo obligatorio</FormHelperText>) }
                                    </FormControl>       
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                        <DateTimePicker
                                            label="Fecha y hora"
                                            ampm={ false }
                                            format="DD/MM/YYYY HH:mm"
                                            value={ recibo.fecha }
                                            onChange={ (newValue) => setRecibo(prev => ({ ...prev, fecha: newValue })) }
                                            disabled={ !edicion }
                                        />
                                    </LocalizationProvider>
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

                    {/* Datos de la gasolinera */}
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Datos de la gasolinera
                            </Typography>
                            <Grid item xs={12} md={12} lg={12}>
                                <TextField
                                    disabled
                                    id="nombreGasolinera"
                                    label="Nombre"
                                    variant="filled"
                                    value={ gasolinera.nombre }
                                    sx={{ width: '100%', mb: 2 }}
                                />
                            </Grid>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12} md={9} lg={9}>
                                    <TextField
                                        disabled
                                        id="direccionGasolinera"
                                        label="Dirección"
                                        variant="filled"
                                        value={ gasolinera.direccion }
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3} lg={3}>
                                    <TextField
                                        disabled
                                        id="numeroGasolinera"
                                        label="Número"
                                        variant="filled"
                                        value={ gasolinera.numero }
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12} md={8} lg={8}>
                                    <TextField
                                        disabled
                                        id="localidadGasolinera"
                                        label="Localidad"
                                        variant="filled"
                                        value={ gasolinera.localidad }
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4} lg={4}>
                                    <TextField
                                        disabled
                                        id="cpGasolinera"
                                        label="Código postal"
                                        variant="filled"
                                        value={ gasolinera.cp }
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12} md={6} lg={6}>
                                    <TextField
                                        disabled
                                        id="provinciaGasolinera"
                                        label="Provincia"
                                        variant="filled"
                                        value={ gasolinera.provincia }
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} lg={6}>
                                    <TextField
                                        disabled
                                        id="paisGasolinera"
                                        label="País"
                                        variant="filled"
                                        value={ gasolinera.pais }
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <TextField
                                    disabled
                                    id="coordsGasolinera"
                                    label="Coordenadas"
                                    variant="filled"
                                    value={ '('+gasolinera.coordenadas.lat+', '+gasolinera.coordenadas.lng+')' }
                                    sx={{ width: '100%' }}
                                />
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Datos del vehículo */}
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Datos del vehículo
                            </Typography>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12} md={7} lg={7}>
                                    <TextField
                                        disabled
                                        id="nombreVehiculo"
                                        label="Nombre"
                                        variant="filled"
                                        value={ vehiculo.nombre }
                                        sx={{ width: '100%', mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={5} lg={5}>
                                    <TextField
                                        disabled
                                        id="marcaVehiculo"
                                        label="Marca"
                                        variant="filled"
                                        value={ vehiculo.marca }
                                        sx={{ width: '100%' }}
                                    />
                                </Grid> 
                            </Grid>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12} md={5} lg={5}>
                                    <TextField
                                        disabled
                                        id="modeloVehiculo"
                                        label="Modelo"
                                        variant="filled"
                                        value={ vehiculo.modelo }
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3} lg={3}>
                                    <TextField
                                        disabled
                                        id="anoVehiculo"
                                        label="Año"
                                        variant="filled"
                                        value={ vehiculo.ano }
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4} lg={4}>
                                    <TextField
                                        disabled
                                        id="matriculaVehiculo"
                                        label="Matrícula"
                                        variant="filled"
                                        value={ vehiculo.matricula }
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    
                </Grid>
            </Grid>

            {/* Imagen recibo */}
            <Grid item xs={ 12 } sm={ 4 } md={ 4 } lg={ 4 }>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                        Imagen del recibo
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            {
                                recibo.fotoURL !== ''
                                    ? (
                                        <Card>
                                            <CardMedia
                                                component="img"
                                                image={ recibo.fotoURL }
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
                                        <Typography>Este recibo no tiene ninguna imagen subida</Typography>
                                    )
                            }
                        </Grid>
                        <Grid item xs={12}>
                            {
                                edicion && recibo.fotoURL === '' && (
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

            {/* Imagen del vehículo y mapa */}
            <Grid item xs={ 12 } md={ 12 } lg={ 12 }>
                <Grid container spacing={3}>

                    {/* Mapa de la gasolinera */}
                    <Grid item xs={ 12 } md={ 6 } lg={ 6 }>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Mapa de la gasolinera
                            </Typography>
                            <div id="map" ref={ mapRef }></div>
                        </Paper>
                    </Grid>

                    {/* Imagen del vehículo */}
                    <Grid item xs={ 12 } md={ 6 } lg={ 6 }>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                                Foto del vehículo
                            </Typography>
                                <Grid item xs={12}>
                                    {
                                        vehiculo.fotoURL !== ''
                                            ? (
                                                <Card>
                                                    <CardMedia
                                                        component="img"
                                                        image={ vehiculo.fotoURL }
                                                    />
                                                </Card>
                                            ) : (
                                                <Typography>Este vehículo no tiene ninguna foto subida</Typography>
                                            )
                                    }
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
            <Dialog
                open={ modalEliminar.abierto }
                keepMounted
                onClose={ handleModalEliminar }
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Eliminar foto del recibo</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        ¿Estás seguro que quieres eliminar la foto del recibo?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={ handleModalEliminar }>Cancelar</Button>
                    <Button color="error" variant="contained" onClick={ () => handleDeleteFileConfirm(modalEliminar.id) }>Eliminar</Button>
                </DialogActions>
            </Dialog>

        </Grid>
    )
}