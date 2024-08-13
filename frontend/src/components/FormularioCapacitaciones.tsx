/**
 * Componente FormularioCapacitacion
 * 
 * Este componente proporciona un formulario para registrar una nueva capacitación. 
 * Permite al usuario ingresar el nombre de la capacitación, seleccionar el área correspondiente, 
 * y subir un archivo asociado. El formulario también deshabilita el botón de registro 
 * si el semestre está inactivo.
 * 
 * Integrantes del proyecto:
 * - William Moyano
 * - Christopher Zambrano
 * - Luis De La Cruz
 * 
 *  Inspiración: https://www.figma.com/design/ihvX1EY7yVl6tCnNEyzsZQ/DCU?node-id=0-1&t=gWOszDEJakzBQ7qB-1  
 * 
 * Funcionalidades:
 * - Cargar las áreas disponibles desde un servicio externo para mostrarlas en un menú desplegable.
 * - Manejar el envío del formulario para agregar una nueva capacitación.
 * - Actualizar la lista de capacitaciones después de registrar una nueva.
 * - Deshabilitar el botón de registro cuando el semestre no está activo.
 * 
 * Props:
 * - actualizarCapacitaciones: Función que se ejecuta después de registrar una capacitación para actualizar la lista de capacitaciones.
 * - estadoSemestre: Booleano que indica si el semestre está activo o no. Si está inactivo, el botón de registro estará deshabilitado.
 * 
 * Uso:
 * Importa este componente y úsalo dentro de cualquier parte de la aplicación donde 
 * se necesite registrar nuevas capacitaciones.
 * 
 * Ejemplo de uso:
 * <FormularioCapacitacion actualizarCapacitaciones={actualizarCapacitaciones} estadoSemestre={true} />
 */

import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { agregarCapacitacion, obtenerAreas } from '../services/Capacitaciones'; 
import { useContextoGlobal } from '../ContextoGlobal';
import type { Area} from '../types/Capacitaciones';

type FormularioCapacitacionProps = {
  actualizarCapacitaciones: () => void;
  estadoSemestre: boolean;
};

function FormularioCapacitacion({ actualizarCapacitaciones, estadoSemestre }: FormularioCapacitacionProps) {
  const [nombreCapacitacion, setNombreCapacitacion] = useState('');
  const [areaSeleccionada, setAreaSeleccionada] = useState('');
  const [areas, setAreas] = useState<Area[]>([]); 
  const { periodoActivo, docente } = useContextoGlobal();

  useEffect(() => {
    const cargarAreas = async () => {
      try {
        const areas = await obtenerAreas();
        setAreas(areas); 
      } catch (error) {
        console.error('Error al obtener las áreas:', error);
      }
    };

    cargarAreas();
  }, []);

  const manejarCambioNombre = (evento: React.ChangeEvent<HTMLInputElement>) => {
    setNombreCapacitacion(evento.target.value);
  };

  const manejarCambioArea = (evento: React.ChangeEvent<HTMLSelectElement>) => {
    setAreaSeleccionada(evento.target.value);
  };

  const manejarEnvio = async (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault(); 

    const data = {
      docente_id: docente?.id_docente || 0, 
      nombre_capacitacion: nombreCapacitacion,
      area: areaSeleccionada,
      periodo_id: periodoActivo || 0 
    };

    try {
      await agregarCapacitacion(data);
      alert('Capacitación agregada con éxito');
      actualizarCapacitaciones(); 
    } catch (error) {
      console.error('Error al agregar la capacitación', error);
      alert('Error al registrar la capacitación');
    }
  };
  
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
      <Row className="justify-content-center w-100">
        <Col md={8} lg={6}>
          <h2 className="text-center mb-4">Registrar Capacitación</h2>
          <Form onSubmit={manejarEnvio}>
            <Form.Group className="mb-3" controlId="formCapacitacion">
              <Form.Label>Capacitación:</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ingrese el nombre de la capacitación" 
                value={nombreCapacitacion} 
                onChange={manejarCambioNombre} 
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formArea">
              <Form.Label>Área:</Form.Label>
              <Form.Select value={areaSeleccionada} onChange={manejarCambioArea}>
                <option value="">Seleccione un área</option>
                {areas.map((areaObj, index) => (
                  <option key={index} value={areaObj.area}>
                    {areaObj.area}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formArchivo">
              <Form.Label>Subir Archivo:</Form.Label>
              <Form.Control type="file" />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit" disabled={estadoSemestre}>
                Registrar
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default FormularioCapacitacion;




