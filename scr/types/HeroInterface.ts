/**
 * @description Define la estructura de un objeto Héroe en el sistema.
 */
export default interface HeroInterface {
  /** @description Ruta o URL de la imagen asociada al héroe. */
  image: string;

  /** @description Identificador único del héroe (opcional). */
  id?: number;

  /** @description Nombre del héroe. */
  name: string;

  /** @description Tipo de héroe (ejemplo: guerrero, mago, arquero, etc.). */
  heroType: string;

  /** @description Descripción detallada del héroe. */
  description: string;

  /** @description Nivel actual del héroe. */
  level: number;

  /** @description EXP acumulada dentro del nivel actual (0..expRequerida-1) */
  experience?: number;

  /** @description Cantidad de poder del héroe. */
  power: number;

  /** @description Puntos de salud del héroe. */
  health: number;

  /** @description Puntos de defensa del héroe. */
  defense: number;

  /** @description Estado actual del héroe (activo o inactivo). */
  status: boolean;

  /** @description Cantidad disponible en inventario. */
  stock: number;

  /** @description Puntos de ataque base del héroe. */
  attack: number;

  /**
   * @description Rango de incremento de ataque que puede obtener el héroe.
   */
  attackBoost: {
    /** @description Valor mínimo del incremento de ataque. */
    min: number;

    /** @description Valor máximo del incremento de ataque. */
    max: number;
  };

  /**
   * @description Rango de daño que puede infligir el héroe.
   */
  damage: {
    /** @description Daño mínimo que puede infligir el héroe. */
    min: number;

    /** @description Daño máximo que puede infligir el héroe. */
    max: number;
  };

  /**
   * @description Lista de acciones especiales que el héroe puede realizar.
   */
  specialActions: {
    /** @description Nombre de la acción especial. */
    name: string;

    /** @description Tipo de acción especial (ejemplo: ataque, defensa, soporte, etc.). */
    actionType: string;

    /** @description Costo en poder para ejecutar la acción. */
    powerCost: number;

    /** @description Tiempo de espera (cooldown) en turnos para volver a usar la acción. */
    cooldown: number;

    /** @description Indica si la acción está disponible para su uso. */
    isAvailable: boolean;

    effect: {
      /** Tipo de efecto (ejemplo: veneno, curación, escudo, etc.). */
      effectType: string;

      /** Valor del efecto, puede ser numérico o textual. */
      value: number | string;

      /**Duración del efecto en turnos. */
      durationTurns: number;
    };
  }[];
  randomEffects: {
    randomEffectType: string;
    percentage: number;
    valueApply: {
      min: number;
      max: number;
    };
  }[];

  /**
   * @description Efecto especial que puede aplicar el héroe.
   */
  effect: {
    /** Tipo de efecto (ejemplo: veneno, curación, escudo, etc.). */
    effectType: string;

    /** Valor del efecto, puede ser numérico o textual. */
    value: number | string;

    /**Duración del efecto en turnos. */
    durationTurns: number;
  };
}
