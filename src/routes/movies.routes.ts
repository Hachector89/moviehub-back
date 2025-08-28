import express from 'express';

import { getPopularMovies, getMovieDetails, getMovieDetailsSimple } from '../controllers/movies.controller';
import { verifyAuth } from '../middlewares/verifyAuth'


const router = express.Router();

router.get('/popular', getPopularMovies);
router.get('/:id/simple', getMovieDetailsSimple);
router.get('/:id', getMovieDetails);

export default router;