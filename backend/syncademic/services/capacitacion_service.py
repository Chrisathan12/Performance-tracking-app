from ..exceptions.not_found import ObjectNotFound
from ..models.asignatura import Asignatura
from ..models.docente import Docente
from ..models.capacitacion import Capacitacion
from ..models.puntuacion_docente import Puntuacion_docente

class CapacitacionService:

    def __init__(self):
        self.periodo = None
        self.id_docente = None
        self.id_asignatura = None
        self.nombre_capacitacion = None
        self.area_capacitacion = None

    # Lista de Puntuaciones

    def get_lista_docentes(self):
        docentes = Docente.objects.values('id_docente', 'nombre', 'carrera', 'correo', 'estado_capacitacion', 'puntaje_actual')
        return docentes

    def get_docente(self, id_docente):
        try:
            docente = Docente.objects.filter(
                id_docente=id_docente
            ).values('id_docente', 'nombre', 'estado_capacitacion', 'carrera', 'correo', 'puntaje_actual')
            if not docente:
                raise ObjectNotFound(Docente._meta.model_name, "Docente no encontrado")
            return docente[0]
        except Exception as e:
            raise ObjectNotFound(Docente._meta.model_name, detail=str(e))

    def get_lista_capacitaciones(self, id_docente):
        capacitaciones = Capacitacion.objects.select_related('docente', 'periodo').filter(docente_id=id_docente)
        return capacitaciones

    def save_capacitacion(self, data):
        try:
            docente_bd = Docente.objects.get(id_docente=data['id_docente'])

            Capacitacion.objects.create(
                docente=docente_bd,
                nombre_capacitacion=data['nombre_capacitacion'],
                area=data['area'],
                periodo=data['periodo']
            )

        except Exception as e:
            raise ObjectNotFound(Capacitacion._meta.model_name, detail=str(e))

    def get_alertas(self):
        alerta = {
            'Capacitacion_agregada': "true",
            'Registro_minimo': "completado"
        }

        return alerta

    @property
    def periodo(self):
        return self._periodo

    @periodo.setter
    def periodo(self, periodo):
        self._periodo = periodo

    @property
    def id_docente(self):
        return self._id_docente

    @id_docente.setter
    def id_docente(self, id_docente):
        self._id_docente = id_docente

    @property
    def id_asignatura(self):
        return self._id_asignatura

    @id_asignatura.setter
    def id_asignatura(self, id_asignatura):
        self._id_asignatura = id_asignatura

    @property
    def nombre_capacitacion(self):
        return self._nombre_capacitacion

    @nombre_capacitacion.setter
    def nombre_capacitacion(self, nombre_capacitacion):
        self._nombre_capacitacion = nombre_capacitacion

    @property
    def area_capacitacion(self):
        return self._area_capacitacion

    @area_capacitacion.setter
    def area_capacitacion(self, area_capacitacion):
        self._area_capacitacion = area_capacitacion

    @property
    def imagen_capacitacion(self):
        return self._imagen_capacitacion

    @imagen_capacitacion.setter
    def imagen_capacitacion(self, imagen_capacitacion):
        self._imagen_capacitacion = imagen_capacitacion
