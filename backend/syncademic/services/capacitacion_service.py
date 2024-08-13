from ..exceptions.not_found import ObjectNotFound
from ..models.asignatura import Asignatura
from ..models.docente import Docente
from ..models.capacitacion import Capacitacion
from ..services.asignatura_service import AsignaturaService

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

            self.aumentar_puntaje(docente_bd.id_docente, data['area'])
            docente_bd.estado_capacitacion = 'completo'
            docente_bd.save()

        except Exception as e:
            raise ObjectNotFound(Capacitacion._meta.model_name, detail=str(e))

    def aumentar_puntaje(self, id_docente, area_ingresada):
        docente_bd = Docente.objects.get(id_docente=id_docente)
        asignatura_service = AsignaturaService()
        areas = asignatura_service.get_areas_por_docente(docente_id=docente_bd.id_docente)

        for area in areas:
            if area['area'] == area_ingresada:
                if isinstance(docente_bd.puntaje_actual, str):
                    docente_bd.puntaje_actual = int(docente_bd.puntaje_actual)
                docente_bd.puntaje_actual += 1
                docente_bd.save()
                break

        return docente_bd.puntaje_actual

    def cambiar_estado(self, id_docente):
        docente_bd = Docente.objects.get(id_docente=id_docente)
        docente_bd.estado_capacitacion = 'completo'
        docente_bd.save()
        return docente_bd.estado_capacitacion

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
