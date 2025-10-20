/**
 * DOM Patch para prevenir errores de removeChild/insertBefore
 *
 * Este parche soluciona un bug conocido de Radix UI Portal cuando
 * extensiones de Chrome (como Google Translate) modifican el DOM.
 *
 * Referencias:
 * - https://github.com/radix-ui/primitives/issues/2578
 * - https://github.com/radix-ui/primitives/issues/1293
 */

// Guardar referencias a los métodos originales
const originalRemoveChild = Node.prototype.removeChild;
const originalInsertBefore = Node.prototype.insertBefore;

/**
 * Parchear Node.prototype.removeChild para manejar errores gracefully
 *
 * Las extensiones del navegador pueden modificar el DOM agregando nodos
 * (ej: <font> tags de Google Translate). Cuando React intenta limpiar,
 * puede intentar eliminar nodos que ya no son hijos directos.
 */
Node.prototype.removeChild = function<T extends Node>(child: T): T {
  try {
    return originalRemoveChild.call(this, child) as T;
  } catch (e) {
    // Silenciar error si el nodo ya no es hijo (probablemente modificado por extensión)
    if (e instanceof DOMException && e.name === 'NotFoundError') {
      console.warn(
        '[DOM Patch] Prevented removeChild error (likely from browser extension):',
        e.message
      );
      return child;
    }
    // Re-lanzar otros errores
    throw e;
  }
};

/**
 * Parchear Node.prototype.insertBefore para manejar errores gracefully
 *
 * Similar a removeChild, las extensiones pueden causar que nodos de
 * referencia sean inválidos cuando React intenta insertar elementos.
 */
Node.prototype.insertBefore = function<T extends Node>(
  newNode: T,
  referenceNode: Node | null
): T {
  try {
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  } catch (e) {
    // Silenciar error si el nodo de referencia no es válido
    if (e instanceof DOMException && e.name === 'NotFoundError') {
      console.warn(
        '[DOM Patch] Prevented insertBefore error (likely from browser extension):',
        e.message
      );
      // Intentar agregar al final si insertBefore falla
      try {
        return this.appendChild(newNode) as T;
      } catch {
        return newNode;
      }
    }
    // Re-lanzar otros errores
    throw e;
  }
};

console.log('[DOM Patch] DOM methods patched successfully to prevent Portal errors');

// Exportar vacío para que pueda ser importado como módulo
export {};
