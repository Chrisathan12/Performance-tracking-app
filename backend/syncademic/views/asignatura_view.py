from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from ..exceptions.not_found import ObjectNotFound
from ..serializers.asignatura_serializer import AsignaturaSerializer

from ..models.asignatura import Asignatura
from ..services import AsignaturaService


class AsignaturaViewSet(viewsets.ModelViewSet):
    queryset = Asignatura.objects.all()
    serializer_class = AsignaturaSerializer
    service = AsignaturaService()

    @action(detail=False, methods=['get'], url_path='areas-por-docente/(?P<docente_id>[^/.]+)')
    def obtener_areas_por_docente(self, request, docente_id):
        self.service.docente_id = docente_id
        try:
            areas = self.service.get_areas_por_docente(docente_id)
            return Response(areas, status=status.HTTP_200_OK)
        except ObjectNotFound as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='areas')
    def obtener_areas(self, request):
        try:
            areas = self.service.get_areas()
            return Response(areas, status=status.HTTP_200_OK)
        except ObjectNotFound as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
