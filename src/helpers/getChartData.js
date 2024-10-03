import moment from "moment";
import { axiosInstance } from "./axios";

const mesesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


export const getChartData = async () => {

    const data = await axiosInstance.get('/api/recibos');
    const recibos = data.data.recibos;

    return recibos;

}

export const getRecibosPorMes = (recibos) => {

    // Convertimos la fecha a objeto moment y agrupamos recibos por mes
    const recibosPorMes = recibos.reduce((acc, recibo) => {
    
        const mes = moment(recibo.fecha).format('MMMM');
        
        if (!acc[mes]) {
          acc[mes] = [];
        }

        acc[mes].push(recibo);
        return acc;
        
    }, {});

    return recibosPorMes;

}

export const getMediaPorMes = (recibosPorMes) => {

    const mediaPorMes = mesesEn.map((mes) => {
    
        if (recibosPorMes[mes] && recibosPorMes[mes].length > 0) {
    
            const totalRecibos = recibosPorMes[mes].length;
            const sumaPrecioEL = recibosPorMes[mes].reduce((sum, recibo) => {
                return sum + parseFloat(recibo.precioEL.$numberDecimal);
            }, 0);
    
            const media = sumaPrecioEL / totalRecibos;
            return parseFloat(media.toFixed(2));
    
        } else {
          return 0.00;
        }
    
    });

    return mediaPorMes;

}

export const getLitrosPorMes = (recibosPorMes) => {

    // Calculamos la media de precioEL por mes
    const litrosPorMes = mesesEn.map((mes) => {
    
        if (recibosPorMes[mes] && recibosPorMes[mes].length > 0) {
    
            const sumaLitros = recibosPorMes[mes].reduce((sum, recibo) => {
                return sum + parseFloat(recibo.litros.$numberDecimal);
            }, 0);
    
            return parseFloat(sumaLitros.toFixed(2));
    
        } else {
          return 0.00;
        }
    
    });

    return litrosPorMes;

}

export const getEurosPorMes = (recibosPorMes) => {

    const eurosPorMes = mesesEn.map((mes) => {
    
        if (recibosPorMes[mes] && recibosPorMes[mes].length > 0) {
    
            const sumaEuros = recibosPorMes[mes].reduce((sum, recibo) => {
                return sum + parseFloat(recibo.precioE.$numberDecimal);
            }, 0);
    
            return parseFloat(sumaEuros.toFixed(2));
    
        } else {
          return 0.00;
        }
    
    });

    return eurosPorMes;

}
