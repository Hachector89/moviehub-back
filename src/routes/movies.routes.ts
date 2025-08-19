import express from 'express';

import { getPopularMovies, getMovieDetails } from '../controllers/movies.controller';
import { verifyAuth } from '../middlewares/verifyAuth'


const router = express.Router();

router.get('/popular', getPopularMovies);
router.get('/:id', getMovieDetails);

export default router;