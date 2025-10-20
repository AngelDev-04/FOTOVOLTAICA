/**
 * Custom Hooks para interactuar con la API
 */
import { useState, useCallback } from 'react';
import apiClient, {
  MetricsResponse,
  LDCResponse,
  ProfileResponse,
  HeatmapResponse,
  StatusResponse,
  UploadResponse,
  HourlyDataResponse,
  WeeklyDataResponse,
} from '../services/api-client';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook para subir archivos
 */
export function useUploadFile() {
  const [state, setState] = useState<UseApiState<UploadResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const uploadFile = async (file: File) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await apiClient.uploadFile(file);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error subiendo archivo';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  return { ...state, uploadFile };
}

/**
 * Hook para obtener métricas
 */
export function useMetrics() {
  const [state, setState] = useState<UseApiState<MetricsResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchMetrics = async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await apiClient.getMetrics();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error obteniendo métricas';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  return { ...state, fetchMetrics };
}

/**
 * Hook para obtener LDC
 */
export function useLDC() {
  const [state, setState] = useState<UseApiState<LDCResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchLDC = async (year?: number, month?: number) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await apiClient.getLDC(year, month);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error obteniendo LDC';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  return { ...state, fetchLDC };
}

/**
 * Hook para obtener perfil
 */
export function useProfile() {
  const [state, setState] = useState<UseApiState<ProfileResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchProfile = useCallback(async (
    diurnalStart: number = 7,
    diurnalEnd: number = 20,
    year?: number,
    month?: number
  ) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await apiClient.getProfile(diurnalStart, diurnalEnd, year, month);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error obteniendo perfil';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  return { ...state, fetchProfile };
}

/**
 * Hook para obtener heatmap
 */
export function useHeatmap() {
  const [state, setState] = useState<UseApiState<HeatmapResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchHeatmap = async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await apiClient.getHeatmap();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error obteniendo heatmap';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  return { ...state, fetchHeatmap };
}

/**
 * Hook para obtener estado del sistema
 */
export function useStatus() {
  const [state, setState] = useState<UseApiState<StatusResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchStatus = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await apiClient.getStatus();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error obteniendo estado';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  return { ...state, fetchStatus };
}

/**
 * Hook para obtener datos horarios de un día
 */
export function useHourlyData() {
  const [state, setState] = useState<UseApiState<HourlyDataResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchHourlyData = async (date: string) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await apiClient.getHourlyData(date);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error obteniendo datos horarios';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  return { ...state, fetchHourlyData };
}

/**
 * Hook para obtener datos semanales
 */
export function useWeeklyData() {
  const [state, setState] = useState<UseApiState<WeeklyDataResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchWeeklyData = async (week: number, year: number = 2016) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await apiClient.getWeeklyData(week, year);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error obteniendo datos semanales';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  return { ...state, fetchWeeklyData };
}
