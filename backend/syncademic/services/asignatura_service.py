from ..exceptions.not_found import ObjectNotFound
from ..models.asignatura import Asignatura


class AsignaturaService:
    def __init__(self):
        self.id_asignatura = None
        self.area = None
        self.docente_id = None

    def get_areas_por_docente(self, docente_id):
        areas = Asignatura.objects.filter(
            docente_id=docente_id
        ).values('area')

        if areas is None:
            raise ObjectNotFound(Asignatura._meta.model_name,
                                 "No se ha encontrado registros")
        else:
            return areas
