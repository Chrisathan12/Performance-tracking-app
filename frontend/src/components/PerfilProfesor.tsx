/**
 * Componente PerfilProfesor
 * 
 * Este componente muestra el perfil de un profesor, incluyendo su imagen, nombre, carrera, correo electrónico, 
 * y su puntaje actual. Además, se presenta una gráfica de líneas que muestra el historial de puntajes del profesor
 * a lo largo de los diferentes periodos.
 * 
 * Funcionalidades:
 * - Muestra los detalles del profesor seleccionado, incluyendo información básica y puntaje actual.
 * - Carga y muestra un gráfico de líneas con el historial de puntajes del profesor usando Chart.js.
 * - Maneja la carga asincrónica de datos de puntajes desde un servicio externo.
 * 
 * Inspiración: https://www.figma.com/design/ihvX1EY7yVl6tCnNEyzsZQ/DCU?node-id=0-1&t=gWOszDEJakzBQ7qB-1  
 * 
 * Uso:
 * Importa este componente y úsalo dentro de la aplicación para mostrar información detallada de un profesor específico.
 * 
 * Ejemplo de uso:
 * <PerfilProfesor />
 * 
 * Integrantes del proyecto:
 * - William Moyano
 * - Christopher Zambrano
 * - Luis De La Cruz
 */
import { Card, Image, ListGroup } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles/components/PerfilProfesor.css';
import ImagenProfesor from "../assets/profesor.jpg";
import { useState, useEffect } from 'react';
import { useContextoGlobal } from '../ContextoGlobal';
import { obtenerPuntajes } from '../services/Capacitaciones';

// Registrar los componentes de Chart.js
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type DatosGrafica = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    backgroundColor: string;
    borderColor: string;
    tension: number;
  }[];
};

function PerfilProfesor() {
  const { docente } = useContextoGlobal();

  const [datosGrafica, setDatosGrafica] = useState<DatosGrafica>({
    labels: [],
    datasets: [
      {
        label: 'Puntaje',
        data: [],
        fill: false,
        backgroundColor: '#8884d8',
        borderColor: '#8884d8',
        tension: 0.1
      }
    ]
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (docente && docente.id_docente) {
          // Obtener los puntajes y periodos
          const historico = await obtenerPuntajes(docente.id_docente);
          
          // Crear etiquetas (labels) y datos (data) para la gráfica
          const labels = historico.map(item => item.periodo__nombre);
          const data = historico.map(item => item.puntaje);

          // Obtener la calificación actual del docente, si existe
          const puntajeActual = docente.puntaje_actual ?? 0;
          setDatosGrafica({
            labels: [...labels, 'Actual'],
            datasets: [
              {
                label: 'Puntaje',
                data: [...data, puntajeActual],
                fill: false,
                backgroundColor: '#8884d8',
                borderColor: '#8884d8',
                tension: 0.1
              }
            ]
          });
        }
      } catch (error) {
        console.error('Error al cargar los datos de puntuación:', error);
      }
    };

    cargarDatos();
  }, [docente]);

  // Verifica si 'docente' es null o undefined, y proporciona un objeto vacío por defecto
  const docenteInfo = docente ?? {
    nombre: "Nombre Desconocido",
    carrera: "Carrera Desconocida",
    correo: "email@desconocido.com",
    puntaje_actual: 0
  };

  return (
    <div className="contenedor-perfil">
      <div className="tarjeta-perfil">
        <Card className="card-profesor">
          <div className="imagen-profesor">
            <Image src={ImagenProfesor} />
          </div>
          <Card.Body className="body-profesor">
            <Card.Title>{docenteInfo.nombre}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{docenteInfo.carrera}</Card.Subtitle>
            <ListGroup variant="flush">
              <ListGroup.Item>Email: {docenteInfo.correo}</ListGroup.Item>
              <ListGroup.Item>Puntaje actual: {docenteInfo.puntaje_actual}</ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
        <div className="grafico-profesor">
          <Line data={datosGrafica} />        
        </div>
      </div>
    </div>
  );
}

export default PerfilProfesor;
