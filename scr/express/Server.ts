import express, { Application } from "express";
import ProductView from "../view/HeroView";
import ItemView from "../view/ItemView";
import WeaponView from "../view/WeaponView";
import EpicView from "../view/EpicView";
import ArmorView from "../view/ArmorView";
import path from "path";
import cors from "cors";
import { environment } from "../enviroment/enviroment";

/**
 * @description Clase que configura y gestiona el servidor Express.
 * Se encarga de aplicar middlewares, definir rutas y servir archivos estáticos.
 */
export default class Server {
  /**
   * Instancia de la aplicación Express.
   * @private
   * @readonly
   */
  private readonly app: Application;

  /**
   * @constructor
   * @param {ProductView} productView - Vista encargada de gestionar las rutas de productos/héroes.
   * @param {ItemView} itemView - Vista encargada de gestionar las rutas de items.
   * @param {WeaponView} weaponView - Vista encargada de gestionar las rutas de armas.
   * @param {EpicView} epicView - Vista encargada de gestionar las rutas de épicos.
   * @param {ArmorView} armorView - Vista encargada de gestionar las rutas de armaduras.
   */
  constructor(
    private readonly productView: ProductView,
    private readonly itemView: ItemView,
    private readonly weaponView: WeaponView,
    private readonly epicView: EpicView,
    private readonly armorView: ArmorView
  ) {
    this.app = express();
    this.configure();
    this.routes();
    this.static();
  }

  /**
   * @description Configura middlewares globales del servidor (CORS, JSON, URL encoding).
   * @method
   * @returns {void}
   */
  readonly configure = (): void => {
    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || environment.allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error(`CORS policy: ${origin} no permitido`));
          }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    // Middleware para parsear JSON con límite de 10mb
    this.app.use(express.json({ limit: "10mb" }));
    // Middleware para parsear datos de formularios
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  };

  /**
   * @description Define las rutas principales del servidor, asociando las vistas.
   * @method
   * @returns {void}
   */
  readonly routes = (): void => {
    this.app.use("/", this.productView.router);
    this.app.use("/", this.itemView.router);
    this.app.use("/", this.weaponView.router);
    this.app.use("/", this.epicView.router);
    this.app.use("/", this.armorView.router);
  };

  /**
   * @description Sirve archivos estáticos desde la carpeta definida en `environment.staticPath`.
   * @method
   * @returns {void}
   */
  readonly static = (): void => {
    this.app.use(express.static(path.join(__dirname, "../../", environment.staticPath)));
  };

  /**
   * @description Inicia el servidor en el puerto especificado en `environment.port`.
   * @method
   * @returns {void}
   */
  readonly start = (): void => {
    this.app.listen(environment.port, "0.0.0.0", () => {
      console.log(`Server running on port ${environment.port}`);
    });
  };
}
