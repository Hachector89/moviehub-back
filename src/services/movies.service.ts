import axios from 'axios';

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchPopularMovies(language: string = 'en-US', page: string = '1') {
    const url = `${TMDB_BASE_URL}/movie/popular`;

    if (!TMDB_ACCESS_TOKEN) {
        throw new Error('TMDB API token is missing');
    }

    try {
        const response = await axios.get(url, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
            },
            params: {
                language,
                page
            }
        });

        return response.data;

    } catch (err: any) {
        throw new Error(`TMDB API request failed: ${err.message}`);
    }
}

export async function fetchMovieDetailsSimple(movieId: string, language: string = 'en-US') {
    const url = `${TMDB_BASE_URL}/movie/${movieId}`;

    if (!TMDB_ACCESS_TOKEN) {
        throw new Error('TMDB API token is missing');
    }

    try {
        const response = await axios.get(url, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
            },
            params: {
                language
            }
        });

        return response.data;

    } catch (err: any) {
        throw new Error(`TMDB API request failed: ${err.message}`);
    }
}

export async function fetchMovieDetails(movieId: string, language: string = 'en-US') {
    const url = `${TMDB_BASE_URL}/movie/${movieId}`;

    if (!TMDB_ACCESS_TOKEN) {
        throw new Error('TMDB API token is missing');
    }

    try {
        const response = await axios.get(url, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`
            },
            params: {
                language,
                append_to_response: 'credits,similar,recommendations,reviews'
            }
        });

        return response.data;

    } catch (err: any) {
        throw new Error(`TMDB API request failed: ${err.message}`);
    }
}