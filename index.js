const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Ruta principal para mostrar el dashboard
app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://carsmoviesinventoryproject-production.up.railway.app/api/v1/carsmovies');
        const data = response.data;

        // Renderizar el dashboard HTML
        let html = `
            <html>
                <head>
                    <title>Cars Movies Dashboard</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: #f4f4f4;
                        }
                    </style>
                </head>
                <body>
                    <h1>Cars Movies Dashboard</h1>
                    <p><strong>Number of Elements:</strong> ${data.NumberOfElements}</p>
                    <p><strong>Current Page:</strong> ${data.CurrentPage}</p>
                    <p><strong>Total Elements:</strong> ${data.TotalElements}</p>
                    <p><strong>Total Pages:</strong> ${data.TotalPages}</p>
                    <h2>Movies</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Movie Name</th>
                                <th>Year</th>
                                <th>Duration (minutes)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.Movies.map(movie => `
                                <tr>
                                    <td>${movie.id}</td>
                                    <td>${movie.carMovieName}</td>
                                    <td>${movie.carMovieYear}</td>
                                    <td>${movie.duration}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;

        res.send(html);
    } catch (error) {
        console.error('Error fetching data from API:', error);
        res.status(500).send('Error fetching data from API');
    }
});

// Ruta para buscar una película por su ID
app.get('/:id', async (req, res) => {
    try {
        const movieId = req.params.id;
        const response = await axios.get(`https://carsmoviesinventoryproject-production.up.railway.app/api/v1/carsmovies/${movieId}`);
        const movie = response.data;

        // Renderizar la página HTML con los detalles de la película
        let html = `
            <html>
                <head>
                    <title>Movie Details</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                        }
                        table {
                            width: 50%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: #f4f4f4;
                        }
                    </style>
                </head>
                <body>
                    <h1>Movie Details</h1>
                    <table>
                        <tr>
                            <th>ID</th>
                            <td>${movie.id}</td>
                        </tr>
                        <tr>
                            <th>Movie Name</th>
                            <td>${movie.carMovieName}</td>
                        </tr>
                        <tr>
                            <th>Year</th>
                            <td>${movie.carMovieYear}</td>
                        </tr>
                        <tr>
                            <th>Duration</th>
                            <td>${movie.duration} minutes</td>
                        </tr>
                    </table>
                </body>
            </html>
        `;

        res.send(html);
    } catch (error) {
        console.error('Error fetching movie by ID:', error);
        res.status(500).send('Error fetching movie by ID');
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});