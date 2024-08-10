/**
 * Componente TablaDocentes
 * 
 * Este componente muestra una tabla con la lista de docentes y su información relevante, 
 * incluyendo nombre, email, carrera, puntaje y estado de la encuesta. Permite enviar recordatorios 
 * a todos los docentes o solo a aquellos con capacitaciones pendientes.
 * 
 * Inspiración: https://www.figma.com/design/ihvX1EY7yVl6tCnNEyzsZQ/DCU?node-id=0-1&t=gWOszDEJakzBQ7qB-1  
 * 
 * Integrantes del proyecto:
 * - William Moyano
 * - Christopher Zambrano
 * - Luis De La Cruz
 * 
 * Funcionalidades:
 * - Obtención de la lista de docentes desde un servicio externo.
 * - Visualización de la tabla de docentes con datos dinámicos.
 * - Envío de recordatorios a todos los docentes o solo a aquellos con capacitaciones pendientes.
 * 
 * Uso:
 * Importa este componente y úsalo dentro de cualquier parte de la aplicación donde 
 * se necesite visualizar y gestionar la información de los docentes.
 * 
 * Ejemplo de uso:
 * <TablaDocentes />
 */
import { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { Docente } from '../types/Capacitaciones';
import { useContextoGlobal } from '../ContextoGlobal';
import { obtenerDocentes } from '../services/Capacitaciones'; 
import ImagenProfesor from "../assets/profesor.jpg";

function TablaDocentes() {
  const { setDocente, setPaginaActual } = useContextoGlobal();
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    const cargarDocentes = async () => {
      try {
        const docentesObtenidos = await obtenerDocentes();
        setDocentes(docentesObtenidos);
      } catch (error) {
        console.error('Error al obtener docentes:', error);
      }
    };

    cargarDocentes();
  }, []);

  const alHacerClicEnFila = (docente: Docente) => {
    setDocente(docente);
    setPaginaActual('Profesor');
  };

  const enviarRecordatorioATodos = () => {
    setMensaje('Recordatorio enviado a todos los docentes.');
    setTimeout(() => setMensaje(null), 5000);
  };

  const enviarRecordatorioAIncompletos = () => {
    const docentesIncompletos = docentes.filter(docente => docente.estado_capacitacion === 'incompleto');
    setMensaje('Recordatorio enviado a todos los docentes con capacitaciones pendientes.');
    setTimeout(() => setMensaje(null), 5000); 
  };

  return (
    <div style={{ width: '97%', height: '100%', margin: '20px 20px' }}>
      {mensaje && <Alert variant="info">{mensaje}</Alert>}
      
      <Table striped bordered hover className="text-center">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Carrera</th>
            <th>Puntaje</th>
            <th>Estado Encuesta</th>
          </tr>
        </thead>
        <tbody>
          {docentes.map(docente => (
            <tr key={docente.id_docente} onClick={() => alHacerClicEnFila(docente)} style={{ cursor: 'pointer' }}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ marginRight: 8 }}>
                    <img src={ImagenProfesor} alt="Docente" style={{ width: 24, height: 24 }} />
                  </div>
                  <div>{docente.nombre}</div>
                </div>
              </td>
              <td>{docente.correo}</td>
              <td>{docente.carrera}</td>
              <td style={{ color: (docente.puntaje_actual || 0) < 7 ? 'red' : 'green' }}>
                {docente.puntaje_actual || 0}
              </td>              
              <td>
                {docente.estado_capacitacion === 'completo' ? (
                  <span style={{ color: 'green' }}>{docente.estado_capacitacion}</span>
                ) : (
                  <span style={{ color: 'red' }}>{docente.estado_capacitacion}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
        <Button variant="primary" onClick={enviarRecordatorioATodos}>
          Enviar Recordatorio a Todos
        </Button>
        <Button variant="warning" onClick={enviarRecordatorioAIncompletos}>
          Enviar Recordatorio a Pendientes
        </Button>
      </div>
    </div>
  );
}

export default TablaDocentes;
