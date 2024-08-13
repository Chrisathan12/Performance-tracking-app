/**
 * Módulo de servicios para la gestión de capacitaciones y seguimiento de docentes.
 * 
 * Este módulo incluye funciones para interactuar con la API de Syncademic, 
 * permitiendo obtener información de docentes, capacitaciones, periodos, áreas, 
 * y puntajes históricos. Además, proporciona funcionalidades para agregar nuevas capacitaciones.
 * 
 * Feature 8: Relacionada con el seguimiento de profesores, este módulo permite 
 * la gestión y consulta de datos clave sobre los docentes y sus capacitaciones, 
 * facilitando el análisis y la supervisión de su desempeño y progreso.
 * 
 * Integrantes del proyecto:
 * - William Moyano
 * - Christopher Zambrano
 * - Luis De La Cruz
 */

import { Capacitacion, Docente, Historico,Periodo, Area } from '../types/Capacitaciones';

// URL base para el servicio
const API_URL = 'http://127.0.0.1:8000/syncademic/capacitacion/';

const handleResponse = (response: Response) => {
    if (!response.ok) {
      throw new Error(`Error en la respuesta del servidor: ${response.status}`);
    }
    return response.json();
  };

  const handleError = (error: Error, message: string) => {
    console.error(message, error);
    throw new Error(message);
  };

  export const obtenerPeriodos = async (): Promise<Periodo[]> => {
    const url = 'http://127.0.0.1:8000/syncademic/periodo/periodos/';
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener los periodos:', error);
      throw error;
    }
  };

// Obtener capacitaciones por ID de docente
export const obtenerCapacitacionesPorDocente = async (idDocente: number): Promise<Capacitacion[]> => {
  const url = `${API_URL}capacitaciones/${idDocente}/`;
  return fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(handleResponse)
    .catch(error => handleError(error, `Error al obtener capacitaciones para el docente ${idDocente}`));
};

// Obtener lista de docentes
export const obtenerDocentes = async (): Promise<Docente[]> => {
  const url = `${API_URL}docentes/`;
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      console.log(response); 
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text(); 
    })
    .then((data) => {
      return JSON.parse(data); 
    })
  }

// Obtener docente por ID
export const obtenerDocentePorId = async (idDocente: number): Promise<Docente> => {
  const url = `${API_URL}docentePorId/${idDocente}/`;
  return fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(handleResponse)
    .catch(error => handleError(error, `Error al obtener el docente ${idDocente}`));
};

// Obtener puntajes por docente
export const obtenerPuntajes = async (idDocente: number): Promise<Historico[]> => {
  const url = `http://127.0.0.1:8000/syncademic/puntuaciones/historialPuntuaciones/${idDocente}/`;
  return fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(handleResponse)
    .catch(error => handleError(error, `Error al obtener el docente ${idDocente}`));
};

/// Crear nueva capacitación
export const agregarCapacitacion = async (data: Omit<Capacitacion, 'id_capacitacion'>) => {
  try {
    // Primeramente, se hace la llamada POST para crear la capacitación
    const responsePost = await fetch('http://127.0.0.1:8000/syncademic/capacitacion/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const dataPost = await responsePost.json();
    if (!responsePost.ok) {
      console.error('Error al crear capacitación:', dataPost);
      return;
    }
    console.log('Capacitación creada:', dataPost);

    // Obtener el ID del docente y el área de la respuesta
    const docenteId = dataPost.docente;
    const area = dataPost.area;

    // Realizar la llamada PUT para aumentar el puntaje
    const responsePut = await fetch('http://127.0.0.1:8000/syncademic/capacitacion/capacitacionAumentarPuntaje/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        docente_id: docenteId, // Asegúrate de que coincida con el backend
        area: area,
      }),
    });

    const dataPut = await responsePut.json();
    if (!responsePut.ok) {
      console.error('Error al aumentar puntaje:', dataPut);
      return;
    }
    console.log('Puntaje aumentado:', dataPut);

    // Realizar la llamada PUT para cambiar el estado del docente
    const responseEstado = await fetch('http://127.0.0.1:8000/syncademic/capacitacion/capacitacionCambiarEstado/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        docente_id: docenteId, // Asegúrate de que coincida con el backend
      }),
    });

    const dataEstado = await responseEstado.json();
    if (!responseEstado.ok) {
      console.error('Error al cambiar estado:', dataEstado);
      return;
    }
    console.log('Estado cambiado correctamente:', dataEstado);

  } catch (error) {
    console.error('Error:', error);
  }
};


//Obtener areas 
export const obtenerAreas = async():Promise<Area[]> =>{
  const url = `http://127.0.0.1:8000/syncademic/asignatura/areas/`;
  return fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(handleResponse)
    .catch(error => handleError(error, `Error al cargar las áreas`));
}
