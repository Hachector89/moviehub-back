import express from 'express';

import { getPopularMovies } from '../controllers/movies.controller';
import { verifyAuth } from '../middlewares/verifyAuth'


const router = express.Router();

router.get('/popular', getPopularMovies);

export default router;