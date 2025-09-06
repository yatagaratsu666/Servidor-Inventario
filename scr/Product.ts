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
 * @description Punto de entrada principal de la aplicación. Aquí se inicializan los modelos,
 * controladores y vistas para cada entidad (Hero, Item, Weapon, Epic, Armor) y se configura
 * el servidor Express.
 */

// Inicialización de Hero (Product)
const productModel = new ProductModel();

/** @description Controlador de héroes, gestiona la lógica de negocio relacionada con ellos. */

const productController = new ProductController(productModel);

/** @description Vista de héroes, define las rutas relacionadas con los héroes. */

const productView = new ProductView(productController);

// Inicialización de Item
const itemModel = new ItemModel();

/** @description Controlador de ítems, gestiona la lógica de negocio de los ítems. */

const itemController = new ItemController(itemModel);

/** @description Vista de ítems, define las rutas relacionadas con los ítems. */

const itemView = new ItemView(itemController);

// Inicialización de Weapon
const weaponModel = new WeaponModel();

/** @description Controlador de armas, gestiona la lógica de negocio de las armas. */

const weaponController = new WeaponController(weaponModel);

/** @description Vista de armas, define las rutas relacionadas con las armas. */

const weaponView = new WeaponView(weaponController);

// Inicialización de Epic

const epicModel = new EpicModel();

/** @description Controlador de épicas, gestiona la lógica de negocio de los objetos épicos. */

const epicController = new EpicController(epicModel);

/** @description Vista de épicas, define las rutas relacionadas con los objetos épicos. */

const epicView = new EpicView(epicController);

// Inicialización de Armor

const armorModel = new ArmorModel();

/** @description Controlador de armaduras, gestiona la lógica de negocio de las armaduras. */

const armorController = new ArmorController(armorModel);

/** @description Vista de armaduras, define las rutas relacionadas con las armaduras. */

const armorView = new ArmorView(armorController);

/**
 * @description Servidor principal de la aplicación. Recibe las vistas y expone las rutas a través de Express.
 */

const server = new Server(productView, itemView, weaponView, epicView, armorView);

/** @description Inicia la aplicación y levanta el servidor. */

server.start();
