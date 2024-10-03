import HomeIcon from '@mui/icons-material/Home';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import DashboardIcon from '@mui/icons-material/Dashboard';


export const sidebarData = [
    {
        label: 'Página principal',
        icon: HomeIcon,
        link: '/home'
    },
    {
        label: 'Mis gasolineras',
        icon: LocalGasStationIcon,
        link: '/gasolineras'
    },
    {
        label: 'Mis vehículos',
        icon: DriveEtaIcon,
        link: '/vehiculos'
    },
    {
        label: 'Mis recibos',
        icon: ReceiptIcon,
        link: '/recibos'
    },
    {
        label: 'Mis estadísticas',
        icon: ShowChartIcon,
        link: '/estadisticas'
    }
]
