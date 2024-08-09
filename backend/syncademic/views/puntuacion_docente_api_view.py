from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from ..exceptions.not_found import ObjectNotFound
from ..models.puntuacion_docente import Puntuacion_docente
from ..serializers import PuntuacionesDocenteSerializer
from ..services import PuntuacionDocenteService

class PuntuacionDocenteAPIView(viewsets.ModelViewSet):
    queryset = Puntuacion_docente.objects.all()
    serializer_class = PuntuacionesDocenteSerializer
    service = PuntuacionDocenteService()

    @action(detail=False, methods=['get'], url_path='historialPuntuaciones/(?P<id_docente>[^/.]+)')
    def get_lista_puntaje_docente(self, request, id_docente):
        try:
            puntuaciones = self.service.get_lista_puntuaciones(id_docente)
            return Response(puntuaciones, status=status.HTTP_200_OK)
        except ObjectNotFound as e:
            return Response({'Error': e.detail}, status=status.HTTP_404_NOT_FOUND)