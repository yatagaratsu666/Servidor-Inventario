import Server from "./express/Server";
import ProductView from "./view/HeroView";
import ProductController from "./controller/HeroController";
import ProductModel from "./model/HeroModel";
import ItemModel from "./model/ItemModel";
import ItemController from "./controller/ItemController";
import ItemView from "./view/ItemView";
import WeaponView from "./view/WeaponView";
import WeaponController from "./controller/WeaponController";
import WeaponModel from "./model/WeaponModel";
import EpicModel from "./model/EpicModel";
import EpicController from "./controller/EpicController";
import EpicView from "./view/EpicView";
import ArmorModel from "./model/ArmorModel";
import ArmorController from "./controller/ArmorController";
import ArmorView from "./view/ArmorView";

/**
 * @description Punto de entrada principal de la aplicación.
 * Aquí se inicializan los modelos, controladores y vistas para cada entidad:
 * Hero, Item, Weapon, Epic y Armor, y se configura el servidor Express.
 */

/**
 * @description Inicialización del modelo de héroes.
 * Gestiona la conexión a la base de datos y operaciones CRUD para héroes.
 */
const productModel = new ProductModel();

/**
 * @description Controlador de héroes.
 * Gestiona la lógica de negocio relacionada con los héroes,
 * interactuando con el modelo para procesar datos y realizar operaciones.
 */
const productController = new ProductController(productModel);

/**
 * @description Vista de héroes.
 * Define las rutas relacionadas con los héroes y las vincula con
 * los métodos del controlador correspondiente.
 */
const productView = new ProductView(productController);

/**
 * @description Inicialización del modelo de ítems.
 * Maneja operaciones CRUD y conexión con la base de datos para los ítems.
 */
const itemModel = new ItemModel();

/**
 * @description Controlador de ítems.
 * Gestiona la lógica de negocio de los ítems y llama al modelo según sea necesario.
 */
const itemController = new ItemController(itemModel);

/**
 * @description Vista de ítems.
 * Define las rutas relacionadas con los ítems y las vincula con su controlador.
 */
const itemView = new ItemView(itemController);

/**
 * @description Inicialización del modelo de armas.
 * Gestiona la conexión a la base de datos y operaciones CRUD para las armas.
 */
const weaponModel = new WeaponModel();

/**
 * @description Controlador de armas.
 * Gestiona la lógica de negocio de las armas y se comunica con el modelo correspondiente.
 */
const weaponController = new WeaponController(weaponModel);

/**
 * @description Vista de armas.
 * Define las rutas HTTP relacionadas con las armas y las vincula con el controlador.
 */
const weaponView = new WeaponView(weaponController);

/**
 * @description Inicialización del modelo de épicas.
 * Maneja operaciones CRUD y conexión con la base de datos para los objetos épicos.
 */
const epicModel = new EpicModel();

/**
 * @description Controlador de épicas.
 * Gestiona la lógica de negocio de los objetos épicos.
 */
const epicController = new EpicController(epicModel);

/**
 * @description Vista de épicas.
 * Define las rutas relacionadas con los objetos épicos y las vincula con el controlador.
 */
const epicView = new EpicView(epicController);

/**
 * @description Inicialización del modelo de armaduras.
 * Gestiona la conexión a la base de datos y operaciones CRUD para las armaduras.
 */
const armorModel = new ArmorModel();

/**
 * @description Controlador de armaduras.
 * Gestiona la lógica de negocio de las armaduras y llama al modelo según corresponda.
 */
const armorController = new ArmorController(armorModel);

/**
 * @description Vista de armaduras.
 * Define las rutas HTTP relacionadas con las armaduras y las vincula con su controlador.
 */
const armorView = new ArmorView(armorController);

/**
 * @description Servidor principal de la aplicación.
 * Recibe todas las vistas y expone sus rutas mediante Express.
 * @type {Server}
 */
const server = new Server(productView, itemView, weaponView, epicView, armorView);

/**
 * @description Inicia la aplicación y levanta el servidor.
 * Expone todas las rutas de las vistas registradas y queda a la escucha en el puerto configurado.
 */
server.start();
