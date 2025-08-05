require('dotenv').config();
const express = require('express');
const cors = require('cors');
import authRoutes from './routes/auth.routes';
import movieRoutes from './routes/movies.routes';
import tmdbRoutes from './routes/tmdb.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/movies', movieRoutes);
app.use('/tmdb', tmdbRoutes);

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
