const client = require('./db');

async function registrarCliente() {
    try {
        const query = `
      CALL registrar_cliente_inscripcion_pago(
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      );
    `;

        const values = [
            'Laura',               
            'Gomez',               
            'laura.gomez@mail.com',
            '1990-11-20',          
            'Femenino',           
            2,                    
            8,                   
            'Tarjeta',           
            95000                
        ];

        await client.query(query, values);

        console.log('? Cliente, inscripción y pago registrados con éxito');
    } catch (err) {
        console.error('? Error ejecutando procedure:', err);
    } finally {
        await client.end();
    }
}

registrarCliente();
