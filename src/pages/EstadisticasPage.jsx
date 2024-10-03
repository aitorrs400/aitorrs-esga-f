import { Grid, Paper, Typography } from "@mui/material";
import { LinearChart } from "../components/LinearChart";
import { getChartData, getRecibosPorMes } from "../helpers/getChartData";
import { useEffect, useState } from "react";

export const EstadisticasPage = () => {

    // Definimos un arreglo de los meses en inglés
    const mesesEs = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const mesesEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Obtenemos el mes en el que nos encontramos actualmente
    // TODO: Hacer lógica
    const fechaActual = new Date();
    // const mesActualId = fechaActual.getMonth();
    const mesActualId = 7;
    const mesActual = mesesEn[mesActualId];

    // Definimos los estados
    const [dataEuroLitros, setDataEuroLitros] = useState([]);
    const [datos, setDatos] = useState({ vertical: [], horizontal:[] });

    // Efecto para obtener los datos de los gráficos
    useEffect(() => {
        datosGraficos();  
    }, []);

    // Efecto que procesa los datos
    useEffect(() => {

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

    },[dataEuroLitros]);
    
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
                            Precio por litro en { mesesEs[mesActualId] }
                        </Typography>

                        <LinearChart label="€ por litro" vertical={ datos.vertical } horizontal={ datos.horizontal } min={ 0 } max={ 2 } />
                        
                        {/* <BarChart label="Precio €" vertical={ dataEuros } horizontal={ mesesEs } min={ 0 } max={ 2 } /> */}

                    </Paper>
                </Grid>

            </Grid>
        </>
    )
}
