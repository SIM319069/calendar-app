"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Event_1 = require("../models/Event");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'calendar_user',
    password: process.env.DB_PASSWORD || 'calendar_password',
    database: process.env.DB_NAME || 'calendar_db',
    synchronize: true,
    logging: false,
    entities: [Event_1.Event],
    migrations: [],
    subscribers: [],
});
