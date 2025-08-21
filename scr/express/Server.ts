import express, { Application } from "express"
import ProductView from "../view/HeroView"
import ItemView from "../view/ItemView"
import WeaponView from "../view/WeaponView"
import EpicView from "../view/EpicView"
import ArmorView from "../view/ArmorView"
import path from "path"
import cors from 'cors';

export default class Server {
    private readonly app: Application

    constructor(private readonly productView: ProductView, private readonly itemView: ItemView, private readonly weaponView: WeaponView, private readonly epicView: EpicView, private readonly armorView: ArmorView){
        this.app = express()
        this.configure()
        this.routes()
        this.static()
    }

    readonly configure = (): void => {
        this.app.use(cors({
            origin: 'http://localhost:4200',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }))

        this.app.use(express.json({ limit: '10mb' }))
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }))
    }

    readonly routes = (): void => {
        this.app.use('/', this.productView.router)
        this.app.use('/', this.itemView.router)
        this.app.use('/', this.weaponView.router)
        this.app.use('/', this.epicView.router)
        this.app.use('/', this.armorView.router)
    }

    readonly static = (): void =>{
        this.app.use(express.static(path.join(__dirname, '../../assets/img')))
    }

    readonly start = (): void => {
        const port = 1882
        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`)
        })
    }
}
