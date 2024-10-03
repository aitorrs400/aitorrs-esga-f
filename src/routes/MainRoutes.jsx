import { Routes, Route, Navigate } from 'react-router-dom';
import { GasolinerasPage, GasolinerasCrearPage, HomePage, RecibosVerEditarPage, RecibosPage, GasolinerasVerEditarPage, VehiculosPage, VehiculosCrearPage, VehiculosVerEditarPage, EstadisticasPage } from '../pages';
import { MainLayout } from '../layouts/MainLayout';
import { RecibosCrearPage } from '../pages/RecibosCrearPage';
import { Typography } from '@mui/material';

export const MainRoutes = () => {

    return (
        <>
            <MainLayout>
                <Routes>
                    <Route path="home" element={ <HomePage /> } />
                    <Route path="gasolineras" element={ <GasolinerasPage /> } />
                    <Route path="gasolineras/detalles/:id" element={ <GasolinerasVerEditarPage edicion={ false } /> } />
                    <Route path="gasolineras/editar/:id" element={ <GasolinerasVerEditarPage edicion={ true } /> } />
                    <Route path="gasolineras/nueva" element={ <GasolinerasCrearPage /> } />
                    <Route path="vehiculos" element={ <VehiculosPage /> } />
                    <Route path="vehiculos/detalles/:id" element={ <VehiculosVerEditarPage edicion={ false } /> } />
                    <Route path="vehiculos/editar/:id" element={ <VehiculosVerEditarPage edicion={ true } />} />
                    <Route path="vehiculos/nuevo" element={ <VehiculosCrearPage /> } />
                    <Route path="recibos" element={ <RecibosPage /> } />
                    <Route path="recibos/detalles/:id" element={ <RecibosVerEditarPage edicion={ false } /> } />
                    <Route path="recibos/editar/:id" element={ <RecibosVerEditarPage edicion={ true } /> } />
                    <Route path="recibos/nuevo" element={ <RecibosCrearPage /> } />
                    <Route path="/estadisticas" element={ <EstadisticasPage /> } />
                    <Route path="/" element={ <Navigate to="home" /> } />
                </Routes>
            </MainLayout>
        </>
    )
}
