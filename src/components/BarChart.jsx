import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export const BarChart = ({ label, vertical, horizontal, min, max }) => {

    const options = {
        responsive: true,
        animation: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            // y: { min, max },
            x: { ticks: { color: '#9E9E9E' }}
        }
    };

    const data = {
        labels: horizontal,
        datasets: [
            {
                label: label,
                data: vertical,
                backgroundColor: '#9E9E9E'
            }
        ]
    };

    return <Bar data={ data } options={ options } />
    
}
