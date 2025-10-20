/**
 * Hook personalizado para capturar gráficas Recharts como imágenes
 * Usa conversión nativa SVG → PNG para evitar problemas con colores oklch()
 */
import { useState, useCallback } from 'react';
import { convertContainerSvgToPng } from '../utils/svg-to-png';

interface ChartImage {
  dataUrl: string;
  width: number;
  height: number;
}

export function useChartCapture() {
  const [capturing, setCapturing] = useState(false);

  /**
   * Captura un elemento del DOM como imagen base64
   * Busca el SVG dentro del contenedor y lo convierte a PNG
   * @param element - Elemento HTML que contiene el SVG de Recharts
   * @param scale - Factor de escala para mayor resolución (default: 2)
   * @returns Objeto con dataUrl y dimensiones
   */
  const captureChart = useCallback(async (
    element: HTMLElement,
    scale: number = 2
  ): Promise<ChartImage> => {
    if (!element) {
      throw new Error('Elemento no encontrado para capturar');
    }

    setCapturing(true);

    try {
      // Buscar el SVG dentro del contenedor y convertirlo a PNG
      const result = await convertContainerSvgToPng(element, scale, '#ffffff');

      return {
        dataUrl: result.dataUrl,
        width: result.width,
        height: result.height
      };
    } catch (error) {
      console.error('Error capturando gráfica:', error);
      throw new Error(
        `Error al capturar gráfica: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    } finally {
      setCapturing(false);
    }
  }, []);

  /**
   * Captura múltiples elementos en secuencia
   * @param elements - Array de elementos HTML a capturar
   * @param scale - Factor de escala para mayor resolución
   * @returns Array de objetos con dataUrl y dimensiones
   */
  const captureMultipleCharts = useCallback(async (
    elements: HTMLElement[],
    scale: number = 2
  ): Promise<ChartImage[]> => {
    setCapturing(true);

    try {
      const images: ChartImage[] = [];

      for (const element of elements) {
        if (element) {
          const image = await captureChart(element, scale);
          images.push(image);
        }
      }

      return images;
    } finally {
      setCapturing(false);
    }
  }, [captureChart]);

  return {
    captureChart,
    captureMultipleCharts,
    capturing
  };
}
