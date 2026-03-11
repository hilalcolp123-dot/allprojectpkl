/**
 * Modern Todo List
 * Enhancements:
 * - Search
 * - Clear completed
 * - Counter
 * - Event delegation (no inline onclick)
 * - Basic a11y improvements
 */
// Wrap file in IIFE to avoid polluting global scope / duplicate declarations
(function () {

// 1) State
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";
let currentQuery = "";
let currentEditId = null;

// 2) Selectors
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const themeToggle = document.querySelector("#theme-toggle");
const searchInput = document.querySelector("#search-input");
const clearCompletedBtn = document.querySelector("#clear-completed");
const todoCounter = document.querySelector("#todo-counter");
const modal = document.querySelector("#edit-modal");
const editInput = document.querySelector("#edit-input");
const saveEditBtn = document.querySelector("#save-edit");
const cancelEditBtn = document.querySelector("#cancel-edit");

const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (m) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return map[m];
  });

const normalize = (str) => String(str).toLowerCase().trim();

const getVisibleTodos = () => {
  const q = normalize(currentQuery);

  return todos
    .filter((todo) => {
      if (currentFilter === "active") return !todo.completed;
      if (currentFilter === "done") return todo.completed;
      return true;
    })
    .filter((todo) => (q ? normalize(todo.text).includes(q) : true));
};

const updateCounter = (visibleCount) => {
  const total = todos.length;
  const done = todos.filter((t) => t.completed).length;
  const active = total - done;

  todoCounter.textContent = `${visibleCount} tampil • ${active} aktif • ${total} total`;
};

// 3) Render
const saveToLocal = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const renderTodos = () => {
  todoList.innerHTML = "";

  const visibleTodos = getVisibleTodos();

  visibleTodos.forEach((todo) => {
    const { id, text, completed } = todo;

    const li = document.createElement("li");
    li.className = `todo-item ${completed ? "completed" : ""}`;
    li.dataset.id = id;

    li.innerHTML = `
      <label class="todo-text">
        <input class="toggle" type="checkbox" ${completed ? "checked" : ""} aria-label="Tandai selesai" />
        <span class="text">${escapeHtml(text)}</span>
      </label>
      <div class="buttons" aria-label="Aksi tugas">
        <button class="icon-btn edit" type="button" aria-label="Edit">📝</button>
        <button class="icon-btn danger delete" type="button" aria-label="Hapus">❌</button>
      </div>
    `;

    todoList.appendChild(li);
  });

  updateCounter(visibleTodos.length);
  saveToLocal();
};

// CRUD
const deleteTodo = (id) => {
  todos = todos.filter((todo) => todo.id !== id);
  renderTodos();
};

const toggleTodo = (id) => {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo,
  );
  renderTodos();
};

const editTodo = (id) => {
  // Cari data todo berdasarkan ID
  const todoToEdit = todos.find((t) => t.id === id);

  if (todoToEdit) {
    currentEditId = id; // Simpan ID di variable global
    editInput.value = todoToEdit.text; // Masukkan teks lama ke input modal
    modal.classList.add("show"); // Tampilkan modal
  }
};

const clearCompleted = () => {
  const before = todos.length;
  todos = todos.filter((t) => !t.completed);
  if (todos.length !== before) renderTodos();
};

// Events
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;

  const newTodo = {
    id: Date.now().toString(),
    text,
    completed: false,
  };

  todos.push(newTodo);
  todoInput.value = "";
  renderTodos();
});

// Event delegation untuk list (toggle/edit/delete)
todoList.addEventListener("click", (e) => {
  const target = e.target;
  const item = target.closest(".todo-item");
  if (!item) return;

  const id = item.dataset.id;
  if (!id) return;

  if (target.classList.contains("delete")) return deleteTodo(id);
  if (target.classList.contains("edit")) return editTodo(id);

  if (
    target.classList.contains("toggle") ||
    target.classList.contains("todo-text") ||
    target.classList.contains("text")
  ) {
    return toggleTodo(id);
  }
});

// Event Listener untuk tombol Batal
cancelEditBtn.addEventListener("click", () => closeModal());

// Fungsi bantu untuk menutup modal
const closeModal = () => {
  modal.classList.remove("show");
  currentEditId = null;
};

// Tambahan: Tutup modal jika user klik di luar area modal
window.onclick = (event) => {
  if (event.target === modal) closeModal();
};

// Event Listener untuk tombol Simpan di Modal
saveEditBtn.addEventListener("click", () => {
  const newText = editInput.value.trim();

  if (newText && currentEditId) {
    // Update array todos menggunakan map (ES6)
    todos = todos.map((todo) =>
      todo.id === currentEditId ? { ...todo, text: newText } : todo,
    );

    closeModal();
    renderTodos();
  }
});

// Filter buttons + aria-selected
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const current = document.querySelector(".filter-btn.active");
    if (current) {
      current.classList.remove("active");
      current.setAttribute("aria-selected", "false");
    }

    e.currentTarget.classList.add("active");
    e.currentTarget.setAttribute("aria-selected", "true");
    currentFilter = e.currentTarget.dataset.filter;
    renderTodos();
  });
});

// Search
searchInput.addEventListener("input", (e) => {
  currentQuery = e.target.value;
  renderTodos();
});

// Clear completed
clearCompletedBtn.addEventListener("click", () => {
  clearCompleted();
});

// Dark Mode Toggle (persist)
const THEME_KEY = "todo_theme";
const applyTheme = (theme) => {
  document.body.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
};

const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme === "dark" || savedTheme === "light") applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  const next = isDark ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

// Initial render
renderTodos();

})();
