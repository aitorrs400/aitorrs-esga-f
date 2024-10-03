import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { Grid, Paper, Typography } from "@mui/material";
import { BarChart } from "../components/BarChart";
import { getChartData, getEurosPorMes, getLitrosPorMes, getMediaPorMes, getRecibosPorMes } from "../helpers/getChartData";

export const HomePage = () => {

    const { user } = useContext( AuthContext );
   
    const mesesEs = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    // Definimos los estados
    const [dataEuroLitros, setDataEuroLitros] = useState([]);
    const [dataLitros, setDataLitros] = useState([]);
    const [dataEuros, setDataEuros] = useState([]);

    // Efecto para obtener los datos de los gráficos
    useEffect(() => {
        datosGraficos();  
    }, []);
    
    // Función para obtener los datos
    const datosGraficos = async () => {
        
        const resp = await getChartData();
        const recibosPorMes = getRecibosPorMes(resp);

        const mediaPorMes = getMediaPorMes(recibosPorMes);
        const litrosPorMes = getLitrosPorMes(recibosPorMes);
        const eurosPorMes = getEurosPorMes(recibosPorMes);

        setDataEuroLitros(mediaPorMes);
        setDataLitros(litrosPorMes);
        setDataEuros(eurosPorMes);

    }


    return (
        <>
            <Typography variant="h1" sx={{ fontSize: { xs: "24px", sm: "32px", md: "38px" }, mb: 2 }}>Hola { user.nombre }!</Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: "16px", sm: "24px", md: "30px" }, mb: 3 }}>Aquí tienes un resumen de tus estadísticas</Typography>
            <Grid container spacing={3}>

                <Grid item xs={12} md={12} lg={6}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Gastos de gasolina por mes
                        </Typography>
                        
                        <BarChart label="Precio €" vertical={ dataEuros } horizontal={ mesesEs } min={ 0 } max={ 2 } />

                    </Paper>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Media de euro el litro por mes
                        </Typography>
                        
                        <BarChart label="Precio €/L" vertical={ dataEuroLitros } horizontal={ mesesEs } min={ 0 } max={ 2 } />

                    </Paper>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Litros por mes
                        </Typography>
                        
                        <BarChart label="Litros (L)" vertical={ dataLitros } horizontal={ mesesEs } min={ 0 } max={ 200 } />

                    </Paper>
                </Grid>
                

                {/* Mensaje de alerta */}
                {/* <Snackbar
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
                </Snackbar> */}

            </Grid>
        </>
    )
}
