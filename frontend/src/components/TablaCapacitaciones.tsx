/**
 * Componente TablaCapacitaciones
 * 
 * Este componente muestra una tabla con la lista de capacitaciones, permitiendo filtrar por periodo (semestre)
 * y descargar los documentos asociados a cada capacitación. Los periodos se cargan desde un servicio externo 
 * y se presentan en un menú desplegable para que el usuario seleccione el semestre deseado.
 * 
 * Integrantes del proyecto:
 * - William Moyano
 * - Christopher Zambrano
 * - Luis De La Cruz
 * 
 * Inspiración: https://www.figma.com/design/ihvX1EY7yVl6tCnNEyzsZQ/DCU?node-id=0-1&t=gWOszDEJakzBQ7qB-1
 * 
 * Funcionalidades:
 * - Cargar periodos desde un servicio externo.
 * - Filtrar capacitaciones por semestre seleccionado.
 * - Descargar documentos de capacitación.
 * 
 * Uso:
 * Importa este componente y úsalo dentro de cualquier parte de la aplicación donde 
 * se necesite visualizar y gestionar la información de las capacitaciones.
 * 
 * Ejemplo de uso:
 * <TablaCapacitaciones capacitaciones={capacitaciones} />
 */
import { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import file from '../assets/file.svg';
import { obtenerPeriodos } from '../services/Capacitaciones';
import { Capacitacion, Periodo } from '../types/Capacitaciones';

type TablaCapacitacionesProps = {
  capacitaciones: Capacitacion[];
};

function TablaCapacitaciones({ capacitaciones }: TablaCapacitacionesProps) {
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [semestreSeleccionado, setSemestreSeleccionado] = useState<number | null>(null);

  useEffect(() => {
    const cargarPeriodos = async () => {
      try {
        const periodosObtenidos = await obtenerPeriodos();
        setPeriodos(periodosObtenidos);
      } catch (error) {
        console.error('Error al cargar los periodos:', error);
      }
    };

    cargarPeriodos();
  }, []);

  const manejarDescarga = (url: string): void => {
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.setAttribute('download', '');
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
  };

  const capacitacionesFiltradas = semestreSeleccionado
    ? capacitaciones.filter(cap => cap.periodo_id=== semestreSeleccionado)
    : capacitaciones;

  return (
    <div style={{ maxWidth: '80%', margin: '0 auto' }}>
      <Form.Select
        aria-label="Selecciona un semestre"
        value={semestreSeleccionado !== null ? semestreSeleccionado.toString() : ''}
        onChange={e => setSemestreSeleccionado(e.target.value ? parseInt(e.target.value) : null)}
        style={{ marginBottom: '20px', width: '15%', justifyContent: 'center' }}
      >
        <option value="">Mostrar todos</option>
        {periodos.map(periodo => (
          <option key={periodo.id_periodo} value={periodo.id_periodo}>
            {periodo.nombre}
          </option>
        ))}
      </Form.Select>
      <Table striped bordered hover className="text-center">
        <thead>
          <tr>
            <th>Capacitación</th>
            <th>Área</th>
            <th>Documento</th>
          </tr>
        </thead>
        <tbody>
          {capacitacionesFiltradas.map(capacitacion => (
            <tr key={capacitacion.id_capacitacion}>
              <td>{capacitacion.nombre_capacitacion}</td>
              <td>{capacitacion.area}</td>
              <td>
                <Button variant="link" onClick={() => manejarDescarga("url-to-download-document-3.pdf")}>
                  <img src={file} alt="Descargar" style={{ width: 24, height: 24 }} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default TablaCapacitaciones;


