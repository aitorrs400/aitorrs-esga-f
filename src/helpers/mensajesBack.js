
export const mensajesBack = (error) => {

    let mensaje = '';
    console.log(error)

    // Primero comprobamos que tengamos la response
    if ( error.response ) {

        // Preparamos la variable de los datos
        const { errors } = error.response.data;

        if ( Array.isArray(errors) ) {

            // Generamos el mensaje de error
            errors.forEach((err, index) => {
                mensaje += err.msg;
                if(index + 1 !== errors.length) {
                    mensaje += ', ';
                }
            });

        } else {
            mensaje = error.message
        }
        
    } else {
        mensaje = error.message;
    }

    return mensaje;

}
