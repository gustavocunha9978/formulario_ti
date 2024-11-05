import 'reflect-metadata';
import '../../config/ts-config-paths'; // registra os paths com com @
import '@shared/config/env';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import routes from '@shared/infra/http/routes';
import '@shared/infra/typeorm';

const app = express();


app.use(cors());

app.use(express.json());

app.use('/apt/t', routes)

export default app;