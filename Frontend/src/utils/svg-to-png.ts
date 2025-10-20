/**
 * Utilidad para convertir elementos SVG a imágenes PNG
 * Soluciona problemas de html2canvas con colores oklch() de Tailwind CSS v4
 */

export interface SvgToPngResult {
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Convierte un elemento SVG a imagen PNG en formato base64
 * @param svgElement - Elemento SVG a convertir
 * @param scale - Factor de escala para mayor resolución (default: 2)
 * @param backgroundColor - Color de fondo opcional (default: transparente)
 * @returns Promise con dataUrl base64, ancho y alto de la imagen
 */
export async function convertSvgToPng(
  svgElement: SVGElement,
  scale: number = 2,
  backgroundColor?: string
): Promise<SvgToPngResult> {
  if (!svgElement || !(svgElement instanceof SVGElement)) {
    throw new Error('El elemento proporcionado no es un SVG válido');
  }

  try {
    // 1. Clonar SVG para no modificar el original
    const svgClone = svgElement.cloneNode(true) as SVGElement;

    // 2. Obtener dimensiones del SVG
    const bbox = svgElement.getBoundingClientRect();
    const width = bbox.width;
    const height = bbox.height;

    // Validar dimensiones
    if (width === 0 || height === 0) {
      throw new Error('El SVG tiene dimensiones inválidas (ancho o alto = 0)');
    }

    // 3. Configurar atributos del SVG clonado
    svgClone.setAttribute('width', width.toString());
    svgClone.setAttribute('height', height.toString());

    // Asegurar que el SVG tenga un viewBox correcto
    if (!svgClone.hasAttribute('viewBox')) {
      svgClone.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }

    // 4. Serializar SVG a string XML
    const svgString = new XMLSerializer().serializeToString(svgClone);

    // 5. Crear blob del SVG
    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8'
    });

    // 6. Crear URL del blob
    const url = URL.createObjectURL(svgBlob);

    // 7. Cargar SVG en una imagen
    const img = await loadImage(url);

    // 8. Crear canvas con escala aplicada
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('No se pudo obtener el contexto 2D del canvas');
    }

    // 9. Aplicar fondo si se especifica
    if (backgroundColor) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 10. Escalar el contexto
    ctx.scale(scale, scale);

    // 11. Dibujar la imagen en el canvas
    ctx.drawImage(img, 0, 0, width, height);

    // 12. Convertir canvas a PNG base64
    const dataUrl = canvas.toDataURL('image/png', 1.0);

    // 13. Limpiar recursos
    URL.revokeObjectURL(url);

    return {
      dataUrl,
      width: canvas.width,
      height: canvas.height
    };
  } catch (error) {
    console.error('Error convirtiendo SVG a PNG:', error);
    throw new Error(
      `Fallo al convertir SVG a PNG: ${error instanceof Error ? error.message : 'Error desconocido'}`
    );
  }
}

/**
 * Carga una imagen desde una URL y retorna una Promise
 * @param url - URL de la imagen a cargar
 * @returns Promise que resuelve con el elemento HTMLImageElement
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);

    img.onerror = () => {
      reject(new Error('Error cargando la imagen desde el blob SVG'));
    };

    // Configurar CORS para evitar problemas de seguridad
    img.crossOrigin = 'anonymous';

    img.src = url;
  });
}

/**
 * Busca y convierte el primer SVG dentro de un contenedor HTML
 * @param container - Elemento HTML que contiene el SVG
 * @param scale - Factor de escala para mayor resolución
 * @param backgroundColor - Color de fondo opcional
 * @returns Promise con dataUrl base64, ancho y alto de la imagen
 */
export async function convertContainerSvgToPng(
  container: HTMLElement,
  scale: number = 2,
  backgroundColor?: string
): Promise<SvgToPngResult> {
  const svgElement = container.querySelector('svg');

  if (!svgElement) {
    throw new Error('No se encontró ningún elemento SVG en el contenedor');
  }

  return convertSvgToPng(svgElement, scale, backgroundColor);
}
