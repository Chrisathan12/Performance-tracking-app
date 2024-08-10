/**
 * Página Capacitaciones
 * 
 * Esta página gestiona la visualización y registro de capacitaciones para un docente específico.
 * Incluye una barra de navegación, un formulario para registrar nuevas capacitaciones, y una tabla 
 * que muestra las capacitaciones existentes.
 * 
 * Funcionalidades:
 * - Cargar y mostrar las capacitaciones del docente actual.
 * - Proporcionar un formulario para agregar nuevas capacitaciones.
 * - Actualizar la tabla de capacitaciones después de registrar una nueva capacitación.
 * 
 * Props:
 * - estadoSemestre: Booleano que indica si el semestre está activo o no. Si está inactivo, 
 *   el formulario para registrar nuevas capacitaciones estará deshabilitado.
 * 
 * Inspiración: https://www.figma.com/design/ihvX1EY7yVl6tCnNEyzsZQ/DCU?node-id=0-1&t=gWOszDEJakzBQ7qB-1
 * 
 * Uso:
 * Importa esta página y úsala dentro de la aplicación para gestionar las capacitaciones 
 * de un docente específico.
 * 
 * Ejemplo de uso:
 * <Capacitaciones estadoSemestre={true} />
 * 
 * Integrantes del proyecto:
 * - William Moyano
 * - Christopher Zambrano
 * - Luis De La Cruz
 */

import { useState, useEffect } from 'react';
import BarraNavegacion from "../components/BarraNavegacion";
import FormularioCapacitaciones from "../components/FormularioCapacitaciones";
import TablaCapacitaciones from "../components/TablaCapacitaciones";
import { obtenerCapacitacionesPorDocente } from '../services/Capacitaciones';
import { useContextoGlobal } from '../ContextoGlobal';
import type { Capacitacion } from '../types/Capacitaciones';

type CapacitacionesProps = {
  estadoSemestre: boolean;
};

function Capacitaciones({ estadoSemestre }: CapacitacionesProps) {
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);
  const { docente } = useContextoGlobal();

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
      <FormularioCapacitaciones 
        actualizarCapacitaciones={cargarCapacitaciones} 
        estadoSemestre={estadoSemestre} // Asegúrate de pasar la prop correctamente
      />
      <TablaCapacitaciones capacitaciones={capacitaciones} />
    </div> 
  );
}

export default Capacitaciones;
