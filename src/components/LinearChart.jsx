import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export const LinearChart = ({ label, vertical, horizontal, min, max }) => {

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

    return <Line data={ data } options={ options } />
    
}
