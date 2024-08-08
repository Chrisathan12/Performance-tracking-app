from rest_framework import serializers
from ..models.capacitacion import Capacitacion


class CapacitacionSerializer(serializers.ModelSerializer):
    """ Serializer para modelo Capacitacion

                Utilizado para Feature 8
                Creado por Christopher Zambrano
    """
    class Meta:
        model = Capacitacion
        fields = '__all__'
