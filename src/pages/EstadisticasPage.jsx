import { FormControl, Grid, InputLabel, MenuItem, Paper, Select, Typography } from "@mui/material";
import { LinearChart } from "../components/LinearChart";
import { getChartData, getRecibosPorMes } from "../helpers/getChartData";
import { useEffect, useState } from "react";

export const EstadisticasPage = () => {

    // Definimos un arreglo de los meses en inglés
    const meses = [
        { id: 0, es: 'Enero', en: 'January' },
        { id: 1, es: 'Febrero', en: 'February' },
        { id: 2, es: 'Marzo', en: 'March' },
        { id: 3, es: 'Abril', en: 'April' },
        { id: 4, es: 'Mayo', en: 'May' },
        { id: 5, es: 'Junio', en: 'June' },
        { id: 6, es: 'Julio', en: 'July' },
        { id: 7, es: 'Agosto', en: 'August' },
        { id: 8, es: 'Septiembre', en: 'September' },
        { id: 9, es: 'Octubre', en: 'October' },
        { id: 10, es: 'Noviembre', en: 'November' },
        { id: 11, es: 'Diciembre', en: 'December' }
    ];

    // Definimos los estados
    const [mesActualId, setMesActualId] = useState(new Date().getMonth());
    const [dataEuroLitros, setDataEuroLitros] = useState([]);
    const [datos, setDatos] = useState({ vertical: [], horizontal:[] });

    const mesActual = meses[mesActualId].en;

    // EFECTOS

    // Efecto para obtener los datos de los gráficos
    useEffect(() => {
        if( mesActualId != -1 ) {
            datosGraficos();  
        }
    }, [mesActualId]);

    // Efecto que procesa los datos
    useEffect(() => {

        // Comprobamos que hayan datos
        if( dataEuroLitros != undefined ) {

            // Obtenemos las fechas
            const fechas = dataEuroLitros.map(objeto => {
    
                const fecha = new Date(objeto.fecha);
    
                // Extraer el día, el mes (sumando 1 porque los meses en JavaScript comienzan en 0) y el año
                const dia = String(fecha.getDate()).padStart(2, '0');  // Asegura que el día tenga dos dígitos
                const mes = String(fecha.getMonth() + 1).padStart(2, '0');  // Asegura que el mes tenga dos dígitos
                const anio = fecha.getFullYear();
    
                // Crear el formato deseado
                const fechaLegible = `${dia}-${mes}-${anio}`;
    
                return fechaLegible;
    
            });
    
            // Obtenemos los datos
            const data = dataEuroLitros.map(objeto => objeto.precioEL.$numberDecimal);
    
            // Seteamos los valores
            setDatos({ vertical: data, horizontal: fechas });

        } else {

            setDatos({ vertical: [], horizontal: [] });
            
        }

    },[dataEuroLitros]);
    
    // FUNCIONES

    // Función para obtener los datos
    const datosGraficos = async () => {
        
        const resp = await getChartData();
        const recibosPorMes = getRecibosPorMes(resp);

        setDataEuroLitros(recibosPorMes[mesActual]);

    }

    return (
        <>
            <Typography variant='h1' sx={{ fontSize: { xs: "24px", sm: "32px", md: "38px" }, mb: 2 }}>Estadísticas page</Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: "16px", sm: "24px", md: "30px" }, mb: 3 }}>Apartado pendiente de programar.</Typography>

            <Grid container spacing={3}>

                <Grid item xs={12} md={12} lg={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Apartado de filtros
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={3}>
                                <FormControl variant="filled" sx={{ width: '100%', minWidth: 120 }}>
                                    <InputLabel id="mes-label">Mes</InputLabel>
                                    <Select
                                        id="mes"
                                        value={ mesActualId }
                                        onChange={ (e) => setMesActualId(prev => (parseInt(e.target.value))) }
                                    >
                                        <MenuItem value={ -1 }><em>Seleccionar</em></MenuItem>
                                        {
                                            meses.map( item => (
                                                <MenuItem key={ item.id } value={ item.id }>{ item.es }</MenuItem>
                                            ))
                                        }
                                    </Select>
                                    {/* { formErrors.gasolinera && (<FormHelperText>Campo obligatorio</FormHelperText>) } */}
                                </FormControl>     
                            </Grid>
                        </Grid>

                    </Paper>
                </Grid>

                <Grid item xs={12} md={12} lg={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Precio por litro en { meses[mesActualId].es }
                        </Typography>

                        <LinearChart label="€ por litro" vertical={ datos.vertical } horizontal={ datos.horizontal } min={ 0 } max={ 2 } />
                        
                        {/* <BarChart label="Precio €" vertical={ dataEuros } horizontal={ mesesEs } min={ 0 } max={ 2 } /> */}

                    </Paper>
                </Grid>

            </Grid>
        </>
    )
}
