/**
 * @description Define la estructura de un objeto Arma en el sistema.
 */
export interface WeaponInterface {
  /** @description Ruta o URL de la imagen asociada al arma. */
  image: string;

  /** @description Identificador único del arma. */
  id: number;

  /** @description Nombre del arma. */
  name: string;

  /** @description Tipo de héroe al que está asociado el arma. */
  heroType: string;

  /** @description Descripción detallada del arma. */
  description: string;

  /** @description Estado actual del arma (activo o inactivo). */
  status: boolean;

  /** @description Cantidad disponible en inventario. */
  stock: number;

  /**
   * @description Lista de efectos que puede aplicar el arma.
   */
  effects: {
    /** @description Tipo de efecto (ejemplo: curación, daño, defensa, etc.). */
    effectType: string;

    /** @description Valor del efecto aplicado por el arma. */
    value: number | string;

    /** @description Duración del efecto en turnos. */
    durationTurns: number;
  }[];

  /** @description Probabilidad de obtener el arma como recompensa. */
  dropRate: number;
}
