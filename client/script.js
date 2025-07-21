// script.js (final upgraded version with gender, chart, toast, search)

const API_URL = 'http://localhost:5000/api/employees';

window.onload = () => {
  const form = document.getElementById('employeeForm');
  const tableBody = document.getElementById('employeeTableBody');
  const searchInput = document.getElementById('searchInput');
  const toastContainer = document.getElementById('toast-container');

  let editingId = null;
  let allEmployees = [];
  const submitBtn = form.querySelector('button[type="submit"]');

  // 📦 Toast
  function showToast(message, duration = 2500) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  }

  // 🔁 Fetch all employees
  function fetchEmployees() {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        allEmployees = data;
        renderTable(data);
        renderChart(data);
      })
      .catch(err => showToast('❌ Failed to fetch employees'));
  }

  // 🎨 Render table
  function renderTable(data) {
    tableBody.innerHTML = '';
    data.forEach(emp => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${emp.name}</td>
        <td>${emp.email}</td>
        <td>${emp.department}</td>
        <td>${emp.gender}</td>
        <td>
          <button class="edit-btn" onclick="editEmployee(${emp.id}, \`${emp.name}\`, \`${emp.email}\`, \`${emp.department}\`, \`${emp.gender}\`)">✏️</button>
          <button class="delete-btn" onclick="deleteEmployee(${emp.id})">🗑️</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  // 🔍 Live search
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    const filtered = allEmployees.filter(emp =>
      emp.name.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term) ||
      emp.department.toLowerCase().includes(term)
    );
    renderTable(filtered);
  });

  // ➕ Form submit
  form.onsubmit = (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const department = form.department.value.trim();

    const gender = form.gender.value.trim();
    const payload = { name, email, department, gender };


    if (!name || !email || !department) {
      showToast('All fields are required ❗');
      return;
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(result => {
        if (result.message && result.message.toLowerCase().includes('email')) {
          showToast(result.message);
          return;
        }
        showToast(editingId ? '✅ Updated' : '✅ Employee added');
        form.reset();
        editingId = null;
        submitBtn.textContent = 'Add Employee';
        fetchEmployees();
      })
      .catch(err => showToast('Server error'));
  };

  window.editEmployee = function(id, name, email, department, gender) {
    form.name.value = name;
    form.email.value = email;
    form.department.value = department;
    form.gender.value = gender || ''; // ✅ safely assign dropdown
    editingId = id;
    submitBtn.textContent = 'Update Employee';
  };



  // ❌ Delete
  window.deleteEmployee = function(id) {
    if (!confirm('Are you sure you want to delete?')) return;

    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(result => {
        showToast('Deleted ✅');
        fetchEmployees();
      })
      .catch(() => showToast('❌ Delete failed'));
  };

  // 📊 Chart placeholder
  function renderChart(data) {
    // Chart feature coming next step
    // Hook already here for when canvas/chart is added
  }

  fetchEmployees();
};