/**
 * admin.js — Admin panel logic
 * Password login, staff management, status/location updates
 */

const CORRECT_PASSWORD = "jjcet@admin";

document.addEventListener('DOMContentLoaded', () => {
  const loginForm   = document.getElementById('loginForm');
  const logoutBtn   = document.getElementById('logoutBtn');
  const addStaffBtn = document.getElementById('addStaffBtn');
  const modal       = document.getElementById('addStaffModal');
  const modalCancel = document.getElementById('modalCancel');
  const modalForm   = document.getElementById('modalForm');
  const exportBtn   = document.getElementById('exportBtn');

  // Check if already logged in this session
  if (sessionStorage.getItem('jjcet_admin_auth') === '1') {
    showAdminPanel();
  }

  // Login
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pwd = document.getElementById('adminPassword').value;
    if (pwd === CORRECT_PASSWORD) {
      sessionStorage.setItem('jjcet_admin_auth', '1');
      showAdminPanel();
    } else {
      const err = document.getElementById('loginError');
      if (err) {
        err.style.display = 'block';
        err.textContent = '❌ Incorrect password. Please try again.';
      }
      document.getElementById('adminPassword').value = '';
    }
  });

  // Logout
  logoutBtn?.addEventListener('click', () => {
    sessionStorage.removeItem('jjcet_admin_auth');
    document.getElementById('adminLogin').style.display  = 'flex';
    document.getElementById('adminPanel').style.display  = 'none';
    document.querySelector('.navbar').style.display      = 'flex';
  });

  // Add Staff Modal
  addStaffBtn?.addEventListener('click', () => openModal());
  modalCancel?.addEventListener('click', () => closeModal());
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  modalForm?.addEventListener('submit', handleAddStaff);

  // Export visitors CSV
  exportBtn?.addEventListener('click', exportVisitorsCSV);
});

// ── Auth ──
function showAdminPanel() {
  document.getElementById('adminLogin').style.display  = 'none';
  document.getElementById('adminPanel').style.display  = 'block';
  renderAdminGrid();
}

// ── Render Admin Grid ──
function renderAdminGrid() {
  const grid  = document.getElementById('adminGrid');
  const staff = getStaff();

  if (!grid) return;

  grid.innerHTML = staff.map(s => buildAdminCard(s)).join('');

  // Bind events
  grid.querySelectorAll('.admin-status-select').forEach(sel => {
    sel.addEventListener('change', function () {
      updateStaffField(+this.dataset.id, 'status', this.value);
    });
  });

  grid.querySelectorAll('.admin-location-input').forEach(inp => {
    inp.addEventListener('blur', function () {
      updateStaffField(+this.dataset.id, 'location', this.value.trim());
    });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { this.blur(); }
    });
  });

  grid.querySelectorAll('.delete-staff-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      deleteStaff(+this.dataset.id);
    });
  });

  // Update staff count badge
  const countEl = document.getElementById('staffCount');
  if (countEl) countEl.textContent = staff.length;
}

function buildAdminCard(s) {
  const initials = getInitials(s.name);
  return `
    <div class="admin-staff-card" id="admin-card-${s.id}">
      <div class="admin-card-top">
        <div class="avatar ${s.avatarColor}" style="width:44px;height:44px;font-size:0.9rem;">${initials}</div>
        <div class="admin-card-info">
          <div class="admin-card-name">${escHtml(s.name)}</div>
          <div class="admin-card-role">${escHtml(s.designation)} · ${escHtml(s.department)}</div>
        </div>
      </div>

      <div class="admin-field">
        <div class="admin-field-label">Status</div>
        <select class="admin-status-select" data-id="${s.id}">
          <option value="present" ${s.status==='present' ? 'selected' : ''}>✅ Present</option>
          <option value="absent"  ${s.status==='absent'  ? 'selected' : ''}>🚫 Absent</option>
          <option value="leave"   ${s.status==='leave'   ? 'selected' : ''}>🏖️ On Leave</option>
        </select>
      </div>

      <div class="admin-field">
        <div class="admin-field-label">Current Location</div>
        <input type="text" class="admin-location-input" data-id="${s.id}"
               value="${escHtml(s.location)}" placeholder="e.g. Class Room 18, CSE Block" />
      </div>

      <div class="admin-field">
        <div class="admin-field-label">Phone / Ext.</div>
        <input type="text" class="admin-location-input" data-id="${s.id}-phone"
               id="phone-${s.id}" value="${escHtml(s.phone)}" placeholder="Phone or Ext."
               onblur="updateStaffField(${s.id}, 'phone', this.value.trim())" />
      </div>

      <div class="admin-card-actions">
        <button class="btn btn-danger btn-sm delete-staff-btn" data-id="${s.id}" style="flex:1">
          🗑️ Remove
        </button>
      </div>
    </div>`;
}

// ── CRUD ──
function updateStaffField(id, field, value) {
  const staff = getStaff();
  const idx   = staff.findIndex(s => s.id === id);
  if (idx === -1) return;
  staff[idx][field] = value;
  saveStaff(staff);
  showToast(`${staff[idx].name} updated!`, 'success');
}

function deleteStaff(id) {
  if (!confirm('Are you sure you want to remove this staff member?')) return;
  let staff = getStaff();
  const member = staff.find(s => s.id === id);
  staff = staff.filter(s => s.id !== id);
  saveStaff(staff);
  renderAdminGrid();
  showToast(`${member?.name || 'Staff'} removed.`, 'info');
}

// ── Add Staff Modal ──
function openModal() {
  document.getElementById('addStaffModal').classList.add('open');
  document.getElementById('newName').focus();
}

function closeModal() {
  document.getElementById('addStaffModal').classList.remove('open');
  document.getElementById('modalForm').reset();
}

function handleAddStaff(e) {
  e.preventDefault();

  const name        = document.getElementById('newName').value.trim();
  const designation = document.getElementById('newDesignation').value.trim();
  const department  = document.getElementById('newDepartment').value.trim();
  const location    = document.getElementById('newLocation').value.trim();
  const phone       = document.getElementById('newPhone').value.trim();
  const status      = document.getElementById('newStatus').value;

  if (!name || !designation || !department || !location) {
    showToast('Please fill all required fields.', 'error');
    return;
  }

  const colors = AVATAR_COLORS;
  const staff  = getStaff();
  const newEntry = {
    id:          Date.now(),
    name,
    designation,
    department,
    location,
    phone:       phone || 'N/A',
    status,
    avatarColor: colors[Math.floor(Math.random() * colors.length)]
  };

  staff.push(newEntry);
  saveStaff(staff);
  closeModal();
  renderAdminGrid();
  showToast(`${name} added successfully!`, 'success');
}

// ── Export Visitors ──
function exportVisitorsCSV() {
  const visitors = getVisitors();
  if (visitors.length === 0) {
    showToast('No visitor entries to export.', 'error');
    return;
  }

  const headers = ['Visitor Name', 'Phone', 'Meeting Person', 'Purpose', 'Address', 'Time In'];
  const rows    = visitors.map(v => [
    v.visitorName, v.phone, v.meetingPerson,
    v.purpose, v.address || '', formatDateTime(v.timeIn)
  ].map(c => `"${String(c).replace(/"/g, '""')}"`).join(','));

  const csv  = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `JJCET_Visitors_${new Date().toLocaleDateString('en-CA')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Visitor log exported!', 'success');
}

// ── Reset Staff to Default ──
function resetStaffData() {
  if (!confirm('This will reset all staff data to defaults. Continue?')) return;
  localStorage.removeItem('jjcet_staff');
  renderAdminGrid();
  showToast('Staff data reset to defaults.', 'info');
}

function escHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str || ''));
  return div.innerHTML;
}
