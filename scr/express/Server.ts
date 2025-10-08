import express, { Application } from 'express';
import ProductView from '../view/HeroView';
import ItemView from '../view/ItemView';
import WeaponView from '../view/WeaponView';
import EpicView from '../view/EpicView';
import ArmorView from '../view/ArmorView';
import path from 'path';
import cors from 'cors';
import { environment } from '../enviroment/enviroment';
import { swaggerDocs } from '../swagger/Swagger';
import UserView from '../view/UserView';
import { Server as HttpServer } from 'http';

/**
 * @class Server
 * @classdesc Clase que configura y gestiona el servidor Express.
 * Se encarga de aplicar middlewares, definir rutas, servir archivos estáticos y habilitar documentación Swagger.
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
    private readonly armorView: ArmorView,
    private readonly userView: UserView,
  ) {
    this.app = express();
    this.configure();
    this.routes();
    this.static();
    this.docs();
  }

  /**
   * @async
   * @function configure
   * @description Configura los middlewares globales del servidor, incluyendo:
   * - CORS con validación de orígenes permitidos.
   * - Middleware para parsear JSON con límite de 10mb.
   * - Middleware para parsear datos de formularios con límite de 10mb.
   * @returns {void}
   */
  
  readonly configure = (): void => {
    console.log(environment.allowedOrigins);
    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || environment.allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error(`CORS policy: ${origin} no permitido`));
          }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      }),
    );

    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  };

  /**
   * @async
   * @function routes
   * @description Define las rutas principales del servidor y asocia cada vista con su router correspondiente.
   * @returns {void}
   */
  readonly routes = (): void => {
    this.app.use('/', this.productView.router);
    this.app.use('/', this.itemView.router);
    this.app.use('/', this.weaponView.router);
    this.app.use('/', this.epicView.router);
    this.app.use('/', this.armorView.router);
    this.app.use('/', this.userView.router);
  };

  /**
   * @async
   * @function static
   * @description Sirve archivos estáticos desde la ruta definida en `environment.staticPath`.
   * @returns {void}
   */
  readonly static = (): void => {
    this.app.use(
      express.static(path.join(__dirname, '../../', environment.staticPath)),
    );
  };

  /**
   * @async
   * @function docs
   * @description Activa la documentación Swagger en la ruta `/api-docs` utilizando la configuración de `swaggerDocs`.
   * @returns {void}
   */
  readonly docs = (): void => {
    swaggerDocs(this.app, environment.port);
  };

  /**
   * @async
   * @function start
   * @description Inicia el servidor en el puerto definido en `environment.port` y escucha conexiones en `0.0.0.0`.
   * Imprime un mensaje en consola indicando que el servidor está corriendo.
   * @returns {void}
   */
  readonly start = (): void => {
    const httpServer = new HttpServer(this.app);
    httpServer.listen(environment.port, '0.0.0.0', () => {
      console.log(`Server running on port ${environment.port}`);
    });
  };
}
