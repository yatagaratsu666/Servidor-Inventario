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

const productModel = new ProductModel()
const productController = new ProductController(productModel)
const productView = new ProductView(productController)

const itemModel = new ItemModel()
const itemController = new ItemController(itemModel)
const itemView = new ItemView(itemController)

const weaponModel = new WeaponModel()
const weaponController = new WeaponController(weaponModel)
const weaponView = new WeaponView(weaponController)

const epicModel = new EpicModel()
const epicController = new EpicController(epicModel)
const epicView = new EpicView(epicController)

const armorModel = new ArmorModel()
const armorController = new ArmorController(armorModel)
const armorView = new ArmorView(armorController)

const server = new Server(productView, itemView, weaponView, epicView, armorView)
server.start();