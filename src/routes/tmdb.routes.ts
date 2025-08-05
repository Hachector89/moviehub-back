import express from 'express';

import { getTMDBConfig } from '../controllers/tmdbConfig.controller';

const router = express.Router();

router.get('/config', getTMDBConfig);

export default router;