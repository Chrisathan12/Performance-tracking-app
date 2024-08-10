
export type Capacitacion = {
  id_capacitacion: number;
  docente: number; // ID del docente
  nombre_capacitacion: string;
  area: string;
  periodo: number;
};

export type Docente = {
  id_docente: number;
  nombre: string;
  correo: string;
  estado_capacitacion?: string;
  carrera: string;
  puntaje_actual?: number;       // Suponiendo que puede ser opcional
};

export type Historico = {
  puntaje: number;
  periodo__nombre : string;
}

export type Periodo = {
  id_periodo: number;
  nombre: string;
  estado: string;
};

export type Area = {
  area:string;
}