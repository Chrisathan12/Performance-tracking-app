from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from syncademic.exceptions.not_found import ObjectNotFound
from syncademic.models.periodo import Periodo
from syncademic.serializers import PeriodoSerializer
from syncademic.services import PeriodoService


class PeriodoAPIView(viewsets.ModelViewSet):
    queryset = Periodo.objects.all()
    serializer_class = PeriodoSerializer
    service = PeriodoService()

    @action(detail=False, methods=['GET'], url_path='periodos')
    def get_obtener_periodos(self, request):
        try:
            periodos = self.service.get_periodos()
            serializer = PeriodoSerializer(periodos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ObjectNotFound as e:
            return Response(status=status.HTTP_404_NOT_FOUND)
