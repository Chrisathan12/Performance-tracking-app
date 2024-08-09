from ..exceptions.not_found import ObjectNotFound
from ..models.periodo import Periodo
class PeriodoService:
    def __init__(self):
        self.id_periodo = None
        self.nombre = None
        self.estado = None

    def get_periodos(self):
        periodos = Periodo.objects.all()
        if not periodos.exists():
            raise ObjectNotFound(Periodo._meta.model_name, "No se han encontrado registros")
        return periodos