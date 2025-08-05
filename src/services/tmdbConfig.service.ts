import axios from 'axios';

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchTMDBCongif() {
    const url = `${TMDB_BASE_URL}/configuration`;

    if (!TMDB_ACCESS_TOKEN) {
        throw new Error('TMDB API token is missing');
    }

    try {
        const response = await axios.get(url, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
            }
        });

        return response.data;

    } catch (err: any) {
        throw new Error(`TMDB API request failed: ${err.message}`);
    }

}