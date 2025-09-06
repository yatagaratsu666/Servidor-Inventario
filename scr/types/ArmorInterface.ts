/**
 * @description Representa la estructura de un objeto de tipo armadura en el sistema.
 */
export interface ArmorInterface {
  /** @description URL o ruta de la imagen asociada a la armadura. */
  image: string;

  /** @description Identificador único de la armadura. */
  id: number;

  /** @description Nombre de la armadura. */
  name: string;

  /** @description Tipo de armadura (ejemplo: ligera, pesada, mágica, etc.). */
  armorType: string;

  /** @description Tipo de héroe al que pertenece o que puede usar esta armadura. */
  heroType: string;

  /** @description Descripción detallada de la armadura y sus características. */
  description: string;

  /** @description Estado de la armadura (activa o inactiva). */
  status: boolean;

  /** @description Cantidad disponible en inventario (stock). */
  stock: number;

  /**
   * @description Lista de efectos que otorga la armadura al héroe que la equipa.
   */
  effects: {
    /** @description Tipo de efecto (ejemplo: defensa, resistencia, regeneración, etc.). */
    effectType: string;

    /** @description Valor del efecto, puede ser un número o un texto. */
    value: number | string;

    /** @description Número de turnos durante los cuales el efecto permanece activo. */
    durationTurns: number;
  }[];

  /** @description Probabilidad de que la armadura aparezca como botín (drop rate). */
  dropRate: number;
}
