import Server from "./express/Server";
import ProductView from "./view/HeroView";
import ProductController from "./controller/HeroController";
import ProductModel from "./model/HeroModel";
import ItemModel from "./model/ItemModel";
import ItemController from "./controller/ItemController";
import ItemView from "./view/ItemView";

const productModel = new ProductModel()
const productController = new ProductController(productModel)
const productView = new ProductView(productController)

const itemModel = new ItemModel()
const itemController = new ItemController(itemModel)
const itemView = new ItemView(itemController)

const server = new Server(productView, itemView)
server.start();