const BASE_URL = "https://carsmoviesinventoryproject-production.up.railway.app/api/v1/carsmovies";

document.addEventListener("DOMContentLoaded", () => {
  loadMovies();

  document.getElementById("movie-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("movie-id").value;
    const movie = {
      carMovieName: document.getElementById("carMovieName").value,
      carMovieYear: document.getElementById("carMovieYear").value,
      duration: document.getElementById("duration").value,
    };

    if (id) {
      await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie),
      });
    } else {
      await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie),
      });
    }

    resetForm();
    loadMovies();
  });
});

async function loadMovies() {
  const res = await fetch(`${BASE_URL}?page=0&size=100`);
  const data = await res.json();
  const movies = data.Movies; // 💡 Aquí estaba el error original

  const tbody = document.getElementById("movies-table-body");
  tbody.innerHTML = "";

  movies.forEach((m) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m.carMovieName}</td>
      <td>${m.carMovieYear}</td>
      <td>${m.duration}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2" onclick='editMovie(${JSON.stringify(m)})'>Editar</button>
        <button class="btn btn-sm btn-danger" onclick='deleteMovie("${m.id}")'>Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function editMovie(movie) {
  document.getElementById("movie-id").value = movie.id;
  document.getElementById("carMovieName").value = movie.carMovieName;
  document.getElementById("carMovieYear").value = movie.carMovieYear;
  document.getElementById("duration").value = movie.duration;
}

async function deleteMovie(id) {
  if (confirm("¿Eliminar esta película?")) {
    await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    loadMovies();
  }
}

function resetForm() {
  document.getElementById("movie-id").value = "";
  document.getElementById("movie-form").reset();
}
