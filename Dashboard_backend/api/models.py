from django.contrib.gis.db import models

class Bus(models.Model):
    Bus = models.CharField(max_length=255, primary_key=True)
    v_nom = models.FloatField()
    country = models.CharField(max_length=255)
    carrier = models.CharField(max_length=255)
    x = models.FloatField()
    y = models.FloatField()
    control = models.CharField(max_length=255)
    generator = models.CharField(max_length=255)
    type = models.CharField(max_length=255)
    unit = models.CharField(max_length=255)
    v_mag_pu_set = models.FloatField()
    v_mag_pu_min = models.FloatField()
    v_mag_pu_max = models.FloatField()
    sub_network = models.CharField(max_length=255)
    country_code = models.CharField(max_length=10)
    geometry = models.GeometryField(srid=4326)

    class Meta:
        db_table = 'buses'

class Line(models.Model):
    Line = models.CharField(max_length=255, primary_key=True)
    bus0 = models.CharField(max_length=255)
    bus1 = models.CharField(max_length=255)
    num_parallel = models.FloatField()
    length = models.FloatField()
    carrier = models.CharField(max_length=255)
    type = models.CharField(max_length=255)
    s_max_pu = models.FloatField()
    s_nom = models.FloatField()
    capital_cost = models.FloatField()
    x = models.FloatField()
    r = models.FloatField()
    b = models.FloatField()
    x_pu_eff = models.FloatField()
    r_pu_eff = models.FloatField()
    s_nom_opt = models.FloatField()
    v_nom = models.FloatField()
    g = models.FloatField()
    s_nom_extendable = models.BooleanField()
    s_nom_min = models.FloatField()
    s_nom_max = models.FloatField()
    build_year = models.BigIntegerField()
    lifetime = models.FloatField()
    terrain_factor = models.FloatField()
    v_ang_min = models.FloatField()
    v_ang_max = models.FloatField()
    sub_network = models.CharField(max_length=255)
    x_pu = models.FloatField()
    r_pu = models.FloatField()
    g_pu = models.FloatField()
    b_pu = models.FloatField()
    country_code = models.CharField(max_length=10)
    x_0 = models.FloatField()
    y_0 = models.FloatField()
    x_1 = models.FloatField()
    y_1 = models.FloatField()
    geometry = models.GeometryField(srid=4326)

    class Meta:
        db_table = 'lines'

class TotalGenerationByAcBus(models.Model):
    bus = models.CharField(max_length=255, primary_key=True)
    carrier = models.CharField(max_length=255)
    generation = models.FloatField()
    country_code = models.CharField(max_length=10)

    class Meta:
        db_table = 'total_generation_by_ac_bus'
        unique_together = ('bus', 'carrier') 

class GenerationMix(models.Model):
    carrier = models.CharField(max_length=255, primary_key=True)
    generation_twh = models.FloatField()
    country_code = models.CharField(max_length=10)

    class Meta:
        db_table = 'generation_mix'
        unique_together = ('carrier', 'country_code')

    def __str__(self):
        return f"{self.carrier} - {self.country_code}"

class TotalDemand(models.Model):
    country_code = models.CharField(max_length=10, primary_key=True)
    total_demand_twh = models.FloatField()

    class Meta:
        db_table = 'total_demand'

