import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, FormControl, FormHelperText, Grid, InputAdornment, InputLabel, MenuItem, Paper, Select, Slide, Snackbar, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { axiosInstance } from "../helpers/axios";
import { mensajesBack } from "../helpers/mensajesBack";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import moment from 'moment';
import 'moment/locale/es'; // Importa el idioma español

// Configuramos MomentJS
moment.locale('es');

export const RecibosCrearPage = () => {

    // Inicializamos variables
    const navigate = useNavigate();

    // Declaramos los estados
    const [gasolinerasList, setGasolinerasList] = useState([]);
    const [vehiculosList, setVehiculosList] = useState([]);
    const [formErrors, setFormErrors] = useState({ codigo: false, precioE: false, precioEnum: false, litros: false, litrosNum: false, precioEL: false, precioELnum: false, carburante: false, fecha: false, hora: false, gasolinera: false, vehiculo: false });
    const [snackState, setSnackState] = useState({ open: false, Transition: Slide, text: 'Snackbar sin asignar', severity: 'info' });
    const [recibo, setRecibo] = useState({
        codigo: '',
        precioE: '',
        litros: '',
        precioEL:'',
        carburante: -1,
        fecha: moment(),
        gasolinera: '',
        vehiculo: ''
    });

    // Efectos
    useEffect(() => {
        peticionesApi();
    },[]);

    // Funciones
    const peticionesApi = async () => {

        try {

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
                open: true
            });

        }


    }

    const handleCrear = async (e) => {

        let errors = false;
        let errorsForm = { codigo: false, precioE: false, precioEnum: false, litros: false, litrosNum: false, precioEL: false, precioELnum: false, carburante: false, fecha: false, hora: false, gasolinera: false, vehiculo: false };

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
                const result = await axiosInstance.post('/api/recibos', {
                    ...recibo,
                    precioE: parseFloat(recibo.precioE),
                    litros: parseFloat(recibo.litros),
                    precioEL: parseFloat(recibo.precioEL)
                });
    
                // Mostramos mensaje informativo
                setSnackState({
                    ...snackState,
                    text: 'Recibo creado correctamente',
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
                text: 'Error al crear el recibo. Motivo: '+mensaje,
                severity: 'error',
                open: true
            });

        }

    }

    const handleAtras = (e) => {
        navigate('/recibos', { replace: true });
    }

    const handleSnackClose = () => {
        setSnackState({ ...snackState, open: false });
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

    return (
        <Grid container spacing={3}>

            {/* Lista */}
            <Grid item xs={12} md={12} lg={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                        Añadir nuevo recibo
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
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
                        <Grid item xs={12} sm={3}>
                            <TextField
                                required
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
                        <Grid item xs={12} sm={3}>
                            <TextField
                                required
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
                        <Grid item xs={12} sm={3}>
                            <TextField
                                required
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
                        <Grid item xs={12} sm={4}>
                            <FormControl required variant="filled" sx={{ width: '100%', minWidth: 120 }} error={ formErrors.carburante }>
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
                        <Grid item xs={12} sm={5}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DateTimePicker
                                    label="Fecha y hora"
                                    ampm={ false }
                                    format="DD/MM/YYYY HH:mm"
                                    value={ recibo.fecha }
                                    onChange={ (newValue) => setRecibo(prev => ({ ...prev, fecha: newValue })) }
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <FormControl required variant="filled" sx={{ width: '100%', minWidth: 120 }} error={ formErrors.gasolinera }>
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
                        <Grid item xs={12} sm={5}>
                            <FormControl required variant="filled" sx={{ width: '100%', minWidth: 120 }} error={ formErrors.vehiculo }>
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
                    </Grid>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: '8px', sm: '0' }, justifyContent: 'space-between', mt: 3 }}>
                        <Button color="primary" variant="contained" onClick={ handleAtras } startIcon={ <ArrowBackIosIcon /> }>
                            Atrás
                        </Button>
                        <Button color="success" variant="contained"onClick={ handleCrear } endIcon={ <AddIcon /> }>
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