const form = document.getElementById("entryForm");
const descInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const entryList = document.getElementById("entryList");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const balanceEl = document.getElementById("balance");
const resetBtn = document.getElementById("resetBtn");
const addBtn = document.getElementById("addBtn");

let entries = JSON.parse(localStorage.getItem("entries")) || [];
let editId = null;

function saveData() {
  localStorage.setItem("entries", JSON.stringify(entries));
}

function render() {
  const filter = document.querySelector("input[name='filter']:checked").value;
  entryList.innerHTML = "";

  let filtered = entries;
  if (filter !== "all") {
    filtered = entries.filter((e) => e.type === filter);
  }

  filtered.forEach((entry) => {
    const li = document.createElement("li");
    li.classList.add(entry.type);
    li.innerHTML = `
      <div>
        <strong>${entry.desc}</strong><br>
        <small>${entry.type}</small><br>
        <b>₹${entry.amount}</b>
      </div>
      <div class="actions">
        <button onclick="editEntry('${entry.id}')">✏️</button>
        <button onclick="deleteEntry('${entry.id}')">🗑️</button>
      </div>
    `;
    entryList.appendChild(li);
  });

  const income = entries.filter(e => e.type === "income").reduce((sum, e) => sum + e.amount, 0);
  const expense = entries.filter(e => e.type === "expense").reduce((sum, e) => sum + e.amount, 0);

  totalIncomeEl.textContent = `₹${income}`;
  totalExpenseEl.textContent = `₹${expense}`;
  balanceEl.textContent = `₹${income - expense}`;
}

function deleteEntry(id) {
  entries = entries.filter((e) => e.id !== id);
  saveData();
  render();
}

function editEntry(id) {
  const entry = entries.find((e) => e.id === id);
  if (!entry) return;
  descInput.value = entry.desc;
  amountInput.value = entry.amount;
  typeInput.value = entry.type;
  editId = id;
  addBtn.textContent = "Update";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;

  if (!desc || !amount) return;

  if (editId) {
    const entry = entries.find((e) => e.id === editId);
    entry.desc = desc;
    entry.amount = amount;
    entry.type = type;
    editId = null;
    addBtn.textContent = "Add";
  } else {
    const newEntry = {
      id: Date.now().toString(),
      desc,
      amount,
      type,
    };
    entries.push(newEntry);
  }

  saveData();
  render();
  form.reset();
  typeInput.value = "income";
});

resetBtn.addEventListener("click", () => {
  entries = [];
  localStorage.removeItem("entries");
  form.reset();
  typeInput.value = "income";
  document.querySelector("input[name='filter'][value='all']").checked = true;
  editId = null;
  addBtn.textContent = "Add";
  render();
});

document.querySelectorAll("input[name='filter']").forEach((radio) => {
  radio.addEventListener("change", render);
});

render();
