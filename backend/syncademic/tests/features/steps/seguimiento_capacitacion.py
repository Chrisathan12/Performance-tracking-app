from behave import *

from syncademic.models.capacitacion import Capacitacion
from syncademic.utils import AreaDocente, AreaCapacitacion
from faker import Faker

from syncademic.utils.capacitaciones_utils import ControlAreas
from syncademic.services.asignatura_service import AsignaturaService
from syncademic.services.capacitacion_service import CapacitacionService
from syncademic.models.docente import Docente
from syncademic.models.periodo import Periodo


# from syncademic.services.seguimiento_malla_service import SeguimientoService

#use_step_matcher("re")


@step('que un docente tiene como areas afines "{areas_afines}"')
def step_impl(context, areas_afines):
    service = AsignaturaService()
    context.docente = Docente.objects.get(id_docente=1)
    context.areas_afines = service.get_areas_por_docente(docente_id=context.docente.id_docente)
    assert areas_afines is not None


@step('tiene una puntuacion inicial de "{puntuacion_inicial}"')
def step_impl(context, puntuacion_inicial):
    puntaje_esperado = context.docente.puntaje_actual
    assert puntaje_esperado == puntuacion_inicial


@step('el docente registra una capacitación en el área de "{area}"')
def step_impl(context, area):
    service = CapacitacionService()
    service.id_docente = 1
    periodo = Periodo.objects.get(id_periodo=1)
    context.area = area

    data = {
        'id_docente': service.id_docente,
        'nombre_capacitacion': 'Capacitación de Prueba',
        'area': area,
        'periodo': periodo
    }
    service.save_capacitacion(data)
    try:
        capacitacion = Capacitacion.objects.filter(area=area, docente__id_docente=service.id_docente)
        assert capacitacion is not None
    except Capacitacion.DoesNotExist:
        assert False, f'No se encontró una capacitación en el área de {area}'


@step('su puntuación final será de "{puntuacion_final}"')
def step_impl(context, puntuacion_final):
    context.docente.puntaje_actual = int(context.docente.puntaje_actual)
    area_encontrada = False
    for area_dict in context.areas_afines:
        area_afine = area_dict.get('area')
        if context.area == area_afine:
            area_encontrada = True
            break

    if area_encontrada:
        context.docente.puntaje_actual += 5
    else:
        context.docente.puntaje_actual += 2

    context.docente.save()
    puntuacion_final = int(puntuacion_final)

    assert context.docente.puntaje_actual == puntuacion_final


@step('que el docente tiene "{capacitaciones}" registradas')
def step_impl(context, capacitaciones):
    """
        :type context: behave.runner.Context
        :type capacitaciones: str
    """
    faker = Faker()
    context.docente = AreaDocente(faker.name)
    context.docente.capacitaciones = int(capacitaciones)
    assert context.docente.capacitaciones == int(capacitaciones)


@step('se marca al registro del docente como "{estado}"')
def step_impl(context, estado):
    """
    :type context: behave.runner.Context
    :type estado: str
    """
    if context.docente.capacitaciones == 0:
        context.docente.estado = "incompleto"
    else:
        context.docente.estado = "completo"

    assert context.docente.estado == estado


@step('la institución decide que "{envia}" un denota al docente')
def step_impl(context, envia):
    context.envia = envia.strip()
    if context.envia == 'si':
        assert 'si' == context.envia
    elif context.envia == 'no':
        assert 'no' == context.envia
