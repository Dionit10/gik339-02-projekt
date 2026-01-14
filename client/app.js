// client/app.js

const form = document.querySelector("#bookForm");
const list = document.querySelector("#bookList");

// Input-fält (säker referens)
const idInput = document.querySelector("#id");
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const yearInput = document.querySelector("#year");
const genreInput = document.querySelector("#genre");
const ratingInput = document.querySelector("#rating");
const colorInput = document.querySelector("#color");

// Hämta och rendera alla böcker
async function fetchBooks() {
  const res = await fetch("/books");
  const books = await res.json();

  list.innerHTML = "";

  books.forEach((book) => {
    const col = document.createElement("div");
    col.className = "col-md-4";

    col.innerHTML = `
      <div class="card" style="border-left: 5px solid ${book.color}">
        <div class="card-body">
          <h5>${escapeHtml(book.title)}</h5>
          <p>${escapeHtml(book.author)} (${book.year})</p>
          <p>${escapeHtml(book.genre)} | ⭐ ${book.rating}</p>

          <button class="btn btn-sm btn-warning me-2" data-edit="${
            book.id
          }">Ändra</button>
          <button class="btn btn-sm btn-danger" data-delete="${
            book.id
          }">Ta bort</button>
        </div>
      </div>
    `;

    list.appendChild(col);
  });
}

// Event delegation för Ändra/Ta bort
list.addEventListener("click", async (e) => {
  const editId = e.target.getAttribute("data-edit");
  const deleteId = e.target.getAttribute("data-delete");

  if (editId) {
    await editBook(Number(editId));
  }

  if (deleteId) {
    await deleteBook(Number(deleteId));
  }
});

// Fyll formuläret och SÄTT id (så PUT används)
async function editBook(bookId) {
  const res = await fetch("/books");
  const books = await res.json();
  const book = books.find((b) => b.id === bookId);

  if (!book) return;

  // Viktigt: sätt id så submit blir PUT (uppdatera)
  idInput.value = book.id;

  titleInput.value = book.title;
  authorInput.value = book.author;
  yearInput.value = book.year;
  genreInput.value = book.genre;
  ratingInput.value = book.rating;
  colorInput.value = book.color;

  // Scrolla upp så man ser formuläret
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Ta bort bok
async function deleteBook(bookId) {
  await fetch(`/books/${bookId}`, { method: "DELETE" });
  await fetchBooks();
}

// Skapa eller uppdatera när man klickar Spara
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const isEdit = idInput.value !== "";

  const payload = {
    id: isEdit ? Number(idInput.value) : undefined,
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    year: Number(yearInput.value),
    genre: genreInput.value.trim(),
    rating: Number(ratingInput.value),
    color: colorInput.value,
  };

  // Enkelt skydd (validering)
  if (
    !payload.title ||
    !payload.author ||
    !payload.year ||
    !payload.genre ||
    !payload.rating
  ) {
    alert("Fyll i alla fält (titel, författare, år, genre, betyg).");
    return;
  }

  await fetch("/books", {
    method: isEdit ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Rensa formuläret efter sparning
  form.reset();
  idInput.value = "";

  await fetchBooks();
});

// Skydd mot att råka injicera HTML i listan
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Start
fetchBooks();
