/**
 * Página Profesor
 * 
 * Esta página muestra la información detallada de un profesor específico, incluyendo su perfil 
 * y las capacitaciones en las que ha participado. También permite regresar a la lista de profesores.
 * 
 * Funcionalidades:
 * - Cargar y mostrar el perfil del profesor seleccionado.
 * - Cargar y mostrar las capacitaciones del profesor seleccionado.
 * - Permitir la navegación de regreso a la lista de profesores.
 * 
 * Inspiración: https://www.figma.com/design/ihvX1EY7yVl6tCnNEyzsZQ/DCU?node-id=0-1&t=gWOszDEJakzBQ7qB-1
 * 
 * Uso:
 * Importa esta página y úsala dentro de la aplicación para mostrar información detallada de un profesor específico.
 * 
 * Ejemplo de uso:
 * <Profesor />
 * 
 * Integrantes del proyecto:
 * - William Moyano
 * - Christopher Zambrano
 * - Luis De La Cruz
 */
import { useState, useEffect } from 'react';
import PerfilProfesor from '../components/PerfilProfesor';
import TablaCapacitaciones from "../components/TablaCapacitaciones";
import { Button } from 'react-bootstrap';
import BarraNavegacion from "../components/BarraNavegacion";
import { obtenerCapacitacionesPorDocente } from '../services/Capacitaciones';
import { useContextoGlobal } from '../ContextoGlobal';
import type { Capacitacion } from "../types/Capacitaciones";

function Profesor() {
  const { setPaginaActual, docente } = useContextoGlobal();
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);

  const volverAListaProfesores = () => {
    setPaginaActual('Home');
  };

  const cargarCapacitaciones = async () => {
    if (docente) {
      try {
        const capacitacionesObtenidas = await obtenerCapacitacionesPorDocente(docente.id_docente);
        setCapacitaciones(capacitacionesObtenidas);
      } catch (error) {
        console.error('Error al cargar capacitaciones:', error);
      }
    }
  };

  useEffect(() => {
    cargarCapacitaciones();
  }, [docente]);

  return (
    <div>
      <BarraNavegacion />
      <PerfilProfesor />
      <TablaCapacitaciones capacitaciones={capacitaciones} />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button variant="primary" onClick={volverAListaProfesores}>
          Regresar a la Lista de Profesores
        </Button>
      </div>
    </div>
  );
}

export default Profesor;





