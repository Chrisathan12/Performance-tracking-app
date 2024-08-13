from behave import *
from django.db import transaction
from django.conf import settings
from django.test.utils import setup_test_environment

from syncademic.models.capacitacion import Capacitacion
from syncademic.services.asignatura_service import AsignaturaService
from syncademic.services.capacitacion_service import CapacitacionService
from syncademic.models.docente import Docente
from syncademic.models.periodo import Periodo


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
    with transaction.atomic():
        service.save_capacitacion(data)
        try:
            capacitacion = Capacitacion.objects.filter(area=area, docente__id_docente=service.id_docente)
            assert capacitacion is not None
            transaction.set_rollback(True)
        except Capacitacion.DoesNotExist:
            assert False, f'No se encontró una capacitación en el área de {area}'

@step('su puntuación final será de "{puntuacion_final}"')
def step_impl(context, puntuacion_final):
    service = CapacitacionService()
    with (transaction.atomic()):
        puntaje_esperado = service.aumentar_puntaje(context.docente.id_docente, context.area)
        puntuacion_final = int(puntuacion_final)
        puntaje_esperado = int(puntaje_esperado)
        assert puntaje_esperado == puntuacion_final
        transaction.set_rollback(True)


@step('que el docente tiene "{capacitaciones}" registradas')
def step_impl(context, capacitaciones):
    """
        :type context: behave.runner.Context
        :type capacitaciones: str
    """
    context.docente = Docente.objects.get(id_docente=2)
    service = CapacitacionService()
    service.id_docente = 2
    if int(capacitaciones) != 0:
        periodo = Periodo.objects.get(id_periodo=1)

        data = {
            'id_docente': service.id_docente,
            'nombre_capacitacion': 'Capacitación de Prueba',
            'area': 'Fisica',
            'periodo': periodo
        }
        with transaction.atomic():
            service.save_capacitacion(data)
            context.docente.capacitaciones = Capacitacion.objects.filter(docente__id_docente=service.id_docente).count()
            assert context.docente.capacitaciones == int(capacitaciones)
            transaction.set_rollback(True)
    else:
        context.docente.capacitaciones = Capacitacion.objects.filter(docente__id_docente=service.id_docente).count()
        assert context.docente.capacitaciones == int(capacitaciones)


@step('se marca al registro del docente como "{estado}"')
def step_impl(context, estado):
    """
    :type context: behave.runner.Context
    :type estado: str
    """
    service = CapacitacionService()
    estado_esperado = 'incompleto'
    with transaction.atomic():
        if context.docente.capacitaciones != 0:
            estado_esperado = service.cambiar_estado(id_docente=context.docente.id_docente)
        assert estado_esperado == estado
        transaction.set_rollback(True)


@step('la institución decide que "{envia}" un denota al docente')
def step_impl(context, envia):
    context.envia = envia.strip()
    if context.envia == 'si':
        assert 'si' == context.envia
    elif context.envia == 'no':
        assert 'no' == context.envia
