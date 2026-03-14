let currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  alert("Please login first");
  window.location.href = "index.html";
}


let donations = JSON.parse(localStorage.getItem("donations")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let records = JSON.parse(localStorage.getItem("records")) || [];

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
}

function showSection(id) {
  const sections = ['donationSection', 'expenseSection', 'recordSection', 'reportSection'];
  sections.forEach(s =>
    document.getElementById(s).style.display = 'none');
  document.getElementById(id).style.display = 'block';
  if (id === 'recordSection') {
    records =
      JSON.parse(localStorage.getItem("records")) || [];
    filterRecords();
  }

  if (id === 'reportSection') {
    showReport();
  }
}

/* Add Donation */
function addDonation() {
  let name = document.getElementById("donorName").value;
  let father = document.getElementById("fatherName").value;
  let mobile = document.getElementById("donorMobile").value;
  let month = document.getElementById("donationMonth").value;
  let amount = Number(document.getElementById("donationAmount").value);

  if (!name || !month || amount <= 0) { alert("Enter valid donation"); return; }
  donations.push({ name, father, mobile, month, amount });
  localStorage.setItem("donations", JSON.stringify(donations));
  let year = new Date().getFullYear();
  records.push({ name, father, mobile, month, year, amount, type: 'donation' });
  localStorage.setItem("records", JSON.stringify(records));
  filterRecords();

  document.getElementById("donorName").value = '';
  document.getElementById("fatherName").value = '';
  document.getElementById("donorMobile").value = '';
  document.getElementById("donationMonth").value = '';
  document.getElementById("donationAmount").value = '';

  showReport();
}

/* Add Expense */
function addExpense() {
  let name = document.getElementById("expenseName").value;
  let father = document.getElementById("expenseFather").value;
  let purpose = document.getElementById("expensePurpose").value;
  let mobile = document.getElementById("expenseMobile").value;
  let month = document.getElementById("expenseMonth").value;
  let amount = Number(document.getElementById("expenseAmount").value);

  if (!name || !purpose || !mobile || !month || amount <= 0) { alert("Enter valid expense"); return; }
  expenses.push({ name, father, purpose, mobile, month, amount });
  localStorage.setItem("expenses", JSON.stringify(expenses));
  let year = new Date().getFullYear();
  records.push({ name, father, mobile, month, year, amount, type: 'expense' });
  localStorage.setItem("records", JSON.stringify(records));
  filterRecords();

  document.getElementById("expenseName").value = '';
  document.getElementById("expenseFather").value = '';
  document.getElementById("expensePurpose").value = '';
  document.getElementById("expenseMobile").value = '';
  document.getElementById("expenseMonth").value = '';
  document.getElementById("expenseAmount").value = '';

  showReport();
}

/* Show Records */

// Current view state
let recordView = "monthly";

// Toggle between monthly and yearly
function toggleRecordView(value) {
  recordView = value;
  document.getElementById('monthlyFilter').style.display = value === "monthly" ? "block" : "none";
  document.getElementById('yearlyFilter').style.display = value === "yearly" ? "block" : "none";
  filterRecords();
}

// Filter function
function filterRecords() {
  let tbody = document.getElementById('recordTable');
  tbody.innerHTML = '';

  let filtered = [...records];

  if (recordView === "monthly") {
    let month = document.getElementById('recordMonth').value;
    if (month) filtered = filtered.filter(r => r.month === month);
  } else if (recordView === "yearly") {
    let year = document.getElementById('recordYear').value;
    if (year) filtered = filtered.filter(r => r.year === year);
  }

  filtered.forEach(rec => {
    let row = document.createElement('tr');
    row.innerHTML = `
      <td>${rec.name}</td>
      <td>${rec.father || '-'}</td>
      <td>${rec.mobile || '-'}</td>
      <td>${rec.month}</td>
      <td>${rec.year}</td>
      <td>${rec.amount}</td>
      <td>
        <button onclick="deleteRecord('${rec.name}', '${rec.month}', '${rec.year}','${rec.type}')">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Optional: delete record
function deleteRecord(name, month, year,
  type) {

  const index = records.findIndex(r => r.name === name &&
    r.month === month &&
    r.year == year &&
    r.type === type
  );

  if (index > -1) {
    if (records[index].type === 'donation') {
      donations = donations.filter(d => !(d.name === name &&
        d.month === month &&
        d.amount ===
        records[index].amount));
      localStorage.setItem("donations", JSON.stringify(donations));
    } else if (records[index].type === 'expense') {
      expenses = expenses.filter(e =>
        !(e.name === name && e.month === month && e.amount === records[index].amount)
      );
      localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    records.splice(index, 1);
    localStorage.setItem("records", JSON.stringify(records));
    filterRecords();
    showReport();
  }
}

// Initialize table with all records
filterRecords();

/* Show Report */
function showReport() {
  let totalDon = donations.reduce((a, b) => a + b.amount, 0);
  let totalExp = expenses.reduce((a, b) => a + b.amount, 0);
  let balance = totalDon - totalExp;

  document.getElementById("totalDonation").innerText = totalDon;
  document.getElementById("totalExp").innerText = totalExp;
  document.getElementById("balance").innerText = balance;
}

/* Month Report */
function monthReport() {
  let month = document.getElementById("reportMonth").value;
  let filteredDon = month ? donations.filter(d => d.month === month) : donations;
  let filteredExp = month ? expenses.filter(e => e.month === month) : expenses;

  let totalDon = filteredDon.reduce((a, b) => a + b.amount, 0);
  let totalExp = filteredExp.reduce((a, b) => a + b.amount, 0);
  document.getElementById("totalDonation").innerText = totalDon;
  document.getElementById("totalExp").innerText = totalExp;
  document.getElementById("balance").innerText = totalDon - totalExp;
}

/* Export CSV */
function exportExcel() {
  let data = "Name,Father,Mobile,Month,Amount\n";
  donations.forEach(d => {
    data += `${d.name},${d.father},${d.mobile},${d.month},${d.amount}\n`;
  });
  let blob = new Blob([data], { type: "text/csv" });
  let url = window.URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = "fund_report.csv";
  a.click();
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

localStorage.clear();
showReport();
