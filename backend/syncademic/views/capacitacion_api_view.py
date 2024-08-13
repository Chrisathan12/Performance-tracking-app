from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework import permissions

from ..models.capacitacion import Capacitacion
from ..models.docente import Docente
from ..serializers import DocenteSerializer
from ..serializers import CapacitacionSerializer
from ..services import CapacitacionService
from ..exceptions.not_found import ObjectNotFound


class CapacitacionAPIView(viewsets.ModelViewSet):
    """ API Endpoint para ControlAreas.
        Utilizado para Feature 8
        Creado por Sebastian Moyano & Christopher Zambrano
    """
    queryset = Capacitacion.objects.all()
    serializer_class = CapacitacionSerializer
    permission_classes = (permissions.AllowAny,)
    service = CapacitacionService()

    @action(detail=False, methods=['get'], url_path='capacitaciones/(?P<id_docente>[^/.]+)')
    def get_lista_capacitaciones_docente(self, request, id_docente):
        try:
            capacitaciones = self.service.get_lista_capacitaciones(id_docente)
            serializer = CapacitacionSerializer(capacitaciones, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ObjectNotFound as e:
            return Response({'Error': e.detail}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='docentes')
    def get_lista_docentes(self, request):
        try:
            docentes = self.service.get_lista_docentes()
            serializer = DocenteSerializer(docentes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ObjectNotFound as e:
            return Response({'Error': e.detail}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='docentePorId/(?P<id_docente>[^/.]+)')
    def get_docente_by_id(self, request, id_docente):
        try:
            docente = self.service.get_docente(id_docente)
            return Response(docente, status=status.HTTP_200_OK)
        except ObjectNotFound as e:
            return Response({'Error': e.detail}, status=status.HTTP_404_NOT_FOUND)


    @action(detail=False, methods=['post'], url_path='capacitacion')
    def create_capacitacion(self, request):
        self.service.save_capacitacion(request.data)
        try:
            return Response({'status': 'Capacitacion saved'}, status=status.HTTP_201_CREATED)
        except ObjectNotFound as e:
            return Response({'Error': e.detail}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['put'], url_path='capacitacionAumentarPuntaje')
    def aumentar_puntaje(self, request):
        docente_id = request.data.get('docente_id')  # Cambiado a docente_id
        area = request.data.get('area')

        if not docente_id or not area:
            return Response({'Error': 'docente_id and area are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            self.service.aumentar_puntaje(docente_id, area)
            return Response({'status': 'Puntaje actualizado correctamente'}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist as e:
            return Response({'Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Error': 'Error inesperado: ' + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['put'], url_path='capacitacionCambiarEstado')
    def cambiar_estado(self, request):
        docente_id = request.data.get('docente_id')
        if not docente_id:
            return Response({'Error': 'docente_id and area are required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            docente = Docente.objects.get(id_docente=docente_id)
            docente.estado_capacitacion = 'completo'
            docente.save()
            return Response({'status': 'Estado actualizado correctamente'}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist as e:
            return Response({'Error': 'Docente no encontrado: ' + str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Error': 'Error inesperado: ' + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

