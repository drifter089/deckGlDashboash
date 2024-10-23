from rest_framework import serializers
from .models import Bus, Line, TotalGenerationByAcBus, GenerationMix, TotalDemand
import math

class BusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bus
        fields = '__all__'

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        for key, value in ret.items():
            if isinstance(value, float):
                if math.isinf(value) or math.isnan(value):
                    ret[key] = None
        return ret

class InfinityFloatField(serializers.FloatField):
    def to_representation(self, value):
        if value is None:
            return None
        if math.isinf(value):
            return 'Infinity' if value > 0 else '-Infinity'
        if math.isnan(value):
            return 'NaN'
        return super().to_representation(value)

class LineSerializer(serializers.ModelSerializer):
    # Aplicar InfinityFloatField a todos los campos FloatField
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            if isinstance(field, serializers.FloatField):
                self.fields[field_name] = InfinityFloatField()

    class Meta:
        model = Line
        fields = ['Line', 'bus0', 'bus1', 'num_parallel', 'length', 'carrier', 'type', 's_max_pu', 's_nom', 
                  'capital_cost', 'x', 'r', 'b', 'x_pu_eff', 'r_pu_eff', 's_nom_opt', 'v_nom', 'g', 
                  's_nom_extendable', 's_nom_min', 's_nom_max', 'build_year', 'lifetime', 
                  'terrain_factor', 'v_ang_min', 'v_ang_max', 'sub_network', 'x_pu', 'r_pu', 
                  'g_pu', 'b_pu', 'country_code', 'x_0', 'y_0', 'x_1', 'y_1', 'geometry']

class TotalGenerationByAcBusSerializer(serializers.ModelSerializer):
    class Meta:
        model = TotalGenerationByAcBus
        fields = ['bus', 'carrier', 'generation', 'country_code']

class GenerationMixSerializer(serializers.ModelSerializer):
    class Meta:
        model = GenerationMix
        fields = ['carrier', 'generation_twh', 'country_code']

class TotalDemandSerializer(serializers.ModelSerializer):
    class Meta:
        model = TotalDemand
        fields = ['country_code', 'total_demand_twh']
