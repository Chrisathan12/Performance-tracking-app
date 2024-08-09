from ..exceptions.not_found import ObjectNotFound
from ..models.puntuacion_docente import Puntuacion_docente
class PuntuacionDocenteService:
    def __init__(self):
        self.id_puntuacion = None
        self.puntaje = None
        self.id_docente = None
        self.periodo_id = None

    def get_lista_puntuaciones(self, id_docente):
        puntuaciones = Puntuacion_docente.objects.filter(id_docente=id_docente).select_related('periodo').values('puntaje', 'periodo__nombre')

        if not puntuaciones.exists():
            raise ObjectNotFound(Puntuacion_docente._meta.model_name,
                                 "No se han encontrado registros para los parámetros dados")
        else:
            return puntuaciones
