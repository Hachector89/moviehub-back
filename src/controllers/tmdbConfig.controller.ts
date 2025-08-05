import { Request, Response } from 'express';
import { fetchTMDBCongif } from '../services/tmdbConfig.service';

export async function getTMDBConfig(req: Request, res: Response) {
    try {
        const data = await fetchTMDBCongif();
        res.status(200).json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}