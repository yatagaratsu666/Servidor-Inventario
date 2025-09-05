import express, { Application } from "express";
import ProductView from "../view/HeroView";
import ItemView from "../view/ItemView";
import WeaponView from "../view/WeaponView";
import EpicView from "../view/EpicView";
import ArmorView from "../view/ArmorView";
import path from "path";
import cors from "cors";
import { environment } from "../enviroment/enviroment";

export default class Server {
  private readonly app: Application;

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

    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  };

  readonly routes = (): void => {
    this.app.use("/", this.productView.router);
    this.app.use("/", this.itemView.router);
    this.app.use("/", this.weaponView.router);
    this.app.use("/", this.epicView.router);
    this.app.use("/", this.armorView.router);
  };

  readonly static = (): void => {
    this.app.use(express.static(path.join(__dirname, "../../", environment.staticPath)));
  };

  readonly start = (): void => {
    this.app.listen(environment.port, "0.0.0.0", () => {
      console.log(`Server running on port ${environment.port}`);
    });
  };
}
