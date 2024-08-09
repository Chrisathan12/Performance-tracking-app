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

    def get_areas(self):
        areas = Asignatura.objects.all().values('area')
        if not areas.exists():
            raise ObjectNotFound(Asignatura._meta.model_name, "No se han encontrado registros")
        return areas
