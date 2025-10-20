import pandas as pd
import numpy as np

# Cargar datos
df = pd.read_csv('power_usage_2016_to_2020.csv')

print("=" * 80)
print("ANÁLISIS DEL DATASET DE CONSUMO ELÉCTRICO")
print("=" * 80)

print(f"\n📊 INFORMACIÓN GENERAL:")
print(f"   Total de registros: {len(df):,}")
print(f"   Rango de fechas: {df['StartDate'].min()} → {df['StartDate'].max()}")
print(f"   Columnas: {list(df.columns)}")

print(f"\n📈 TIPOS DE DATOS:")
print(df.dtypes)

print(f"\n📉 ESTADÍSTICAS DE CONSUMO (kWh):")
print(df['Value (kWh)'].describe())

print(f"\n🏷️  CATEGORÍAS EN 'notes':")
print(df['notes'].value_counts())

print(f"\n🏷️  DÍAS DE LA SEMANA (day_of_week):")
print(df['day_of_week'].value_counts().sort_index())

print(f"\n❌ VALORES NULOS:")
print(df.isnull().sum())

# Análisis temporal
df['datetime'] = pd.to_datetime(df['StartDate'])
df['hour'] = df['datetime'].dt.hour
df['date'] = df['datetime'].dt.date
df['month'] = df['datetime'].dt.month
df['year'] = df['datetime'].dt.year

print(f"\n📅 AÑOS EN EL DATASET:")
print(df['year'].value_counts().sort_index())

print(f"\n⏰ CONSUMO PROMEDIO POR HORA DEL DÍA:")
hourly_avg = df.groupby('hour')['Value (kWh)'].mean()
for hour, avg in hourly_avg.items():
    bar = '█' * int(avg * 5)
    print(f"   {hour:02d}:00 → {avg:.3f} kWh {bar}")

print(f"\n📊 RESUMEN PARA EL BACKEND:")
print(f"   - Granularidad: HORARIA (1 registro por hora)")
print(f"   - Período: {(df['datetime'].max() - df['datetime'].min()).days} días")
print(f"   - Total horas: {len(df):,}")
print(f"   - Consumo mínimo: {df['Value (kWh)'].min():.3f} kWh")
print(f"   - Consumo máximo: {df['Value (kWh)'].max():.3f} kWh")
print(f"   - Consumo promedio: {df['Value (kWh)'].mean():.3f} kWh")
print(f"   - Desviación estándar: {df['Value (kWh)'].std():.3f} kWh")

print("\n" + "=" * 80)
