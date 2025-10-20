/**
 * API Client - Cliente HTTP para comunicación con el Backend FastAPI
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ApiError {
  success: false;
  error: string;
  message: string;
  details?: any;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  records_processed: number;
  records_valid: number;
  errors: string[];
}

export interface MetricsResponse {
  total_energy_kwh: number;
  average_power_kw: number;
  peak_power_kw: number;
  min_power_kw: number;
  total_records: number;
  start_date: string;
  end_date: string;
  period_days: number;
  daily_average_kwh?: number;
  monthly_average_kwh?: number;
  peak_timestamp?: string;
  diurnal_percentage?: number;
  nocturnal_percentage?: number;
  weekday_average_kwh?: number;
  weekend_average_kwh?: number;
  load_factor: number;
}

export interface LDCResponse {
  power_values: number[];
  duration_percentage: number[];
  total_hours: number;
  base_load: number;
  peak_load: number;
  average_load: number;
  curve_points_100: [number, number][];
}

export interface ProfileResponse {
  diurnal_kwh: number;
  nocturnal_kwh: number;
  total_kwh: number;
  diurnal_percentage: number;
  nocturnal_percentage: number;
  diurnal_hours: {
    start: number;
    end: number;
    range: string;
  };
  pattern: string;
  weekday_kwh?: number;
  weekend_kwh?: number;
  weekday_percentage?: number;
  weekend_percentage?: number;
}

export interface HeatmapResponse {
  hours: number[];
  dates: string[];
  values: number[][];
  max_value: number;
  min_value: number;
}

export interface StatusResponse {
  data_loaded: boolean;
  records_count: number;
  message: string;
  date_range?: {
    start: string;
    end: string;
    start_date: string;
    end_date: string;
    start_year: number;
    start_month: number;
    start_week: number;
  };
}

export interface HourlyDataResponse {
  date: string;
  hours: number[];
  consumption: number[];
  total_kwh: number;
  peak_hour: number;
  peak_value: number;
}

export interface WeeklyDataResponse {
  week: number;
  year: number;
  start_date: string;
  end_date: string;
  days: string[];
  dates: string[];
  consumption: number[];
  total_kwh: number;
  peak_day: string;
  peak_value: number;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP Error: ${response.status} ${response.statusText}`,
      }));
      throw new Error(error.message || error.detail || 'API Error');
    }
    return response.json();
  }

  /**
   * Subir archivo CSV o Excel
   */
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseURL}/api/v1/upload`, {
      method: 'POST',
      body: formData,
    });

    return this.handleResponse<UploadResponse>(response);
  }

  /**
   * Obtener métricas de consumo
   */
  async getMetrics(): Promise<MetricsResponse> {
    const response = await fetch(`${this.baseURL}/api/v1/metrics`);
    return this.handleResponse<MetricsResponse>(response);
  }

  /**
   * Obtener Load Duration Curve
   */
  async getLDC(year?: number, month?: number): Promise<LDCResponse> {
    const params = new URLSearchParams();
    if (year !== undefined) params.append('year', year.toString());
    if (month !== undefined) params.append('month', month.toString());

    const url = params.toString()
      ? `${this.baseURL}/api/v1/ldc?${params.toString()}`
      : `${this.baseURL}/api/v1/ldc`;

    const response = await fetch(url);
    return this.handleResponse<LDCResponse>(response);
  }

  /**
   * Calcular perfil de consumo
   */
  async getProfile(
    diurnalStart: number = 7,
    diurnalEnd: number = 20,
    year?: number,
    month?: number
  ): Promise<ProfileResponse> {
    const response = await fetch(`${this.baseURL}/api/v1/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        diurnal_start_hour: diurnalStart,
        diurnal_end_hour: diurnalEnd,
        year: year,
        month: month,
      }),
    });
    return this.handleResponse<ProfileResponse>(response);
  }

  /**
   * Obtener datos de heatmap
   */
  async getHeatmap(): Promise<HeatmapResponse> {
    const response = await fetch(`${this.baseURL}/api/v1/heatmap`);
    return this.handleResponse<HeatmapResponse>(response);
  }

  /**
   * Obtener estado del sistema
   */
  async getStatus(): Promise<StatusResponse> {
    const response = await fetch(`${this.baseURL}/api/v1/status`);
    return this.handleResponse<StatusResponse>(response);
  }

  /**
   * Obtener datos horarios de un día específico
   */
  async getHourlyData(date: string): Promise<HourlyDataResponse> {
    const response = await fetch(`${this.baseURL}/api/v1/hourly?date=${date}`);
    return this.handleResponse<HourlyDataResponse>(response);
  }

  /**
   * Obtener datos semanales (por día de la semana)
   */
  async getWeeklyData(week: number, year: number = 2016): Promise<WeeklyDataResponse> {
    const response = await fetch(`${this.baseURL}/api/v1/weekly?week=${week}&year=${year}`);
    return this.handleResponse<WeeklyDataResponse>(response);
  }

  /**
   * Limpiar datos cargados
   */
  async clearData(): Promise<{ success: boolean; message: string; records_deleted: number }> {
    const response = await fetch(`${this.baseURL}/api/v1/clear`, {
      method: 'DELETE',
    });
    return this.handleResponse(response);
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; service: string; version: string }> {
    const response = await fetch(`${this.baseURL}/health`);
    return this.handleResponse(response);
  }
}

// Exportar instancia singleton
export const apiClient = new ApiClient();

export default apiClient;
