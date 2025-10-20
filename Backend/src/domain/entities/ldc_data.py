"""
Entidad de Dominio: LDCData
Representa los datos de la Load Duration Curve (Curva de Duración de Carga)
"""
from dataclasses import dataclass
from typing import List, Tuple


@dataclass
class LDCData:
    """
    Load Duration Curve (LDC) - Curva de Duración de Carga.

    La LDC muestra las potencias ordenadas de mayor a menor vs su duración.
    Es fundamental para diseño de sistemas fotovoltaicos porque permite:
    - Determinar el dimensionamiento del sistema
    - Identificar potencia base vs potencia pico
    - Optimizar el balance entre generación y consumo

    Attributes:
        power_values: Lista de potencias ordenadas de mayor a menor (kW)
        duration_percentage: Lista de porcentajes de duración acumulada (0-100%)
        total_hours: Total de horas analizadas
        base_load: Carga base (potencia que se mantiene el 100% del tiempo)
        peak_load: Carga pico (potencia máxima)
    """

    power_values: List[float]
    duration_percentage: List[float]
    total_hours: int
    base_load: float
    peak_load: float

    def __post_init__(self):
        """Validaciones de dominio"""
        self._validate_lists()
        self._validate_duration()
        self._validate_loads()

    def _validate_lists(self) -> None:
        """Valida que las listas tengan el mismo tamaño"""
        if len(self.power_values) != len(self.duration_percentage):
            raise ValueError(
                f"Las listas deben tener el mismo tamaño: "
                f"power_values={len(self.power_values)}, "
                f"duration_percentage={len(self.duration_percentage)}"
            )

        if len(self.power_values) == 0:
            raise ValueError("Las listas no pueden estar vacías")

    def _validate_duration(self) -> None:
        """Valida que los porcentajes de duración sean válidos"""
        if not all(0 <= p <= 100 for p in self.duration_percentage):
            raise ValueError("Los porcentajes de duración deben estar entre 0 y 100")

        # La duración debe empezar cerca de 0% y terminar cerca de 100%
        if self.duration_percentage[0] > 5:
            raise ValueError(f"La duración inicial debe ser cercana a 0%, recibido: {self.duration_percentage[0]}")

        if self.duration_percentage[-1] < 95:
            raise ValueError(f"La duración final debe ser cercana a 100%, recibido: {self.duration_percentage[-1]}")

    def _validate_loads(self) -> None:
        """Valida que las cargas sean coherentes"""
        if self.base_load < 0:
            raise ValueError(f"Carga base no puede ser negativa: {self.base_load}")

        if self.peak_load < self.base_load:
            raise ValueError(
                f"Carga pico ({self.peak_load}) no puede ser menor que "
                f"carga base ({self.base_load})"
            )

        if self.total_hours <= 0:
            raise ValueError(f"Total de horas debe ser positivo: {self.total_hours}")

    def get_power_at_duration(self, duration_percent: float) -> float:
        """
        Obtiene la potencia a un porcentaje de duración específico.

        Args:
            duration_percent: Porcentaje de duración (0-100)

        Returns:
            Potencia en kW para ese porcentaje de duración

        Example:
            power_50 = ldc.get_power_at_duration(50.0)  # Potencia al 50% del tiempo
        """
        if not 0 <= duration_percent <= 100:
            raise ValueError(f"duration_percent debe estar entre 0 y 100, recibido: {duration_percent}")

        # Búsqueda del índice más cercano
        for i, duration in enumerate(self.duration_percentage):
            if duration >= duration_percent:
                return self.power_values[i]

        # Si no se encuentra, retornar la última potencia (carga base)
        return self.power_values[-1]

    def get_curve_points(self, num_points: int = 100) -> List[Tuple[float, float]]:
        """
        Obtiene puntos de la curva para graficar.

        Args:
            num_points: Número de puntos a retornar

        Returns:
            Lista de tuplas (duration_%, power_kW)
        """
        if num_points > len(self.power_values):
            # Si se piden más puntos de los disponibles, retornar todos
            return list(zip(self.duration_percentage, self.power_values))

        # Muestreo uniforme
        step = len(self.power_values) // num_points
        indices = range(0, len(self.power_values), step)

        return [
            (self.duration_percentage[i], self.power_values[i])
            for i in indices
        ]

    def calculate_average_load(self) -> float:
        """
        Calcula la carga promedio a partir de la LDC.

        Returns:
            Potencia promedio en kW
        """
        if not self.power_values:
            return 0.0
        return sum(self.power_values) / len(self.power_values)

    def to_dict(self) -> dict:
        """Convierte la LDC a diccionario para serialización"""
        return {
            "power_values": [round(p, 3) for p in self.power_values],
            "duration_percentage": [round(d, 2) for d in self.duration_percentage],
            "total_hours": self.total_hours,
            "base_load": round(self.base_load, 3),
            "peak_load": round(self.peak_load, 3),
            "average_load": round(self.calculate_average_load(), 3),
            "curve_points_100": self.get_curve_points(100),
        }

    def __repr__(self) -> str:
        return (
            f"LDCData("
            f"points={len(self.power_values)}, "
            f"base={self.base_load:.2f} kW, "
            f"peak={self.peak_load:.2f} kW, "
            f"hours={self.total_hours})"
        )
