/**
 * @description Define la estructura de un objeto Ítem en el sistema.
 */
export default interface ItemInterface {
  /** @description Identificador único del ítem (opcional). */
  id?: number;

  /** @description Ruta o URL de la imagen asociada al ítem. */
  image: string;

  /** @description Tipo de héroe al que está asociado el ítem. */
  heroType: string;

  /** @description Descripción detallada del ítem. */
  description: string;

  /** @description Nombre del ítem. */
  name: string;

  /** @description Estado actual del ítem (activo o inactivo). */
  status: boolean;

  /** @description Cantidad disponible en inventario. */
  stock: number;

  /**
   * @description Lista de efectos que puede aplicar el ítem.
   */
  effects: {
    /** @description Tipo de efecto (ejemplo: curación, daño, defensa, etc.). */
    effectType: string;

    /** @description Valor numérico del efecto aplicado por el ítem. */
    value: number;

    /** @description Duración del efecto en turnos. */
    durationTurns: number;
  }[];

  /** @description Probabilidad de obtener el ítem como recompensa. */
  dropRate: number;
}
