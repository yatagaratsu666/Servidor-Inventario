/**
 * @description Define la estructura de un objeto Épico en el sistema.
 */
export interface EpicInterface {
  /** @description Ruta o URL de la imagen asociada al objeto. */
  image: string;

  /** @description Identificador único del objeto. */
  id: number;

  /** @description Nombre del objeto. */
  name: string;

  /** @description Tipo de héroe al que está destinado el objeto. */
  heroType: string;

  /** @description Descripción detallada del objeto. */
  description: string;

  /** @description Estado actual del objeto (activo o inactivo). */
  status: boolean;

  /** @description Cantidad disponible en inventario. */
  stock: number;

  /**
   * @description Lista de efectos asociados al objeto.
   */
  effects: {
    /** @description Tipo de efecto (ejemplo: daño, defensa, curación, etc.). */
    effectType: string;

    /** @description Valor del efecto, puede ser numérico o textual. */
    value: number | string;

    /** @description Duración del efecto en turnos. */
    durationTurns: number;
  }[];

  /** @description Tiempo de espera (cooldown) en turnos para volver a usar el objeto. */
  cooldown: number;

  /** @description Indica si el objeto está disponible para ser utilizado. */
  isAvailable: boolean;

  /** @description Probabilidad de éxito al usar el objeto maestro. */
  masterChance: number;
}
