import { Request, Response } from 'express';
import { fetchPopularMovies, fetchMovieDetails, fetchMovieDetailsSimple } from '../services/movies.service';

export async function getPopularMovies(req: Request, res: Response) {
    try {
        const language = req.query.language as string || 'en-US';
        const page = req.query.page as string || '1';

        const data = await fetchPopularMovies(language, page);
        res.status(200).json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export async function getMovieDetailsSimple(req: Request, res: Response) {
    const movieId = req.params.id;

    try {
        const language = req.query.language as string || 'en-US';
        const data = await fetchMovieDetailsSimple(movieId, language);
        res.status(200).json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export async function getMovieDetails(req: Request, res: Response) {
    const movieId = req.params.id;

    try {
        const language = req.query.language as string || 'en-US';
        const data = await fetchMovieDetails(movieId, language);
        res.status(200).json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}