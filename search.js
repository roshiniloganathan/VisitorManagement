/**
 * search.js — Main visitor search page logic
 * Handles live search, department filtering, and stats
 */

let allStaff = [];
let currentFilter = 'all';
let searchQuery   = '';

// ── DOM references ──
const searchInput   = document.getElementById('searchInput');
const searchClear   = document.getElementById('searchClear');
const resultsGrid   = document.getElementById('resultsGrid');
const resultsCount  = document.getElementById('resultsCount');
const statPresent   = document.getElementById('statPresent');
const statAbsent    = document.getElementById('statAbsent');
const statLeave     = document.getElementById('statLeave');
const statTotal     = document.getElementById('statTotal');
const filterRow     = document.getElementById('filterRow');
const todayDate     = document.getElementById('todayDate');

// ── Initialise ──
document.addEventListener('DOMContentLoaded', () => {
  allStaff = getStaff();
  renderStats();
  renderFilters();
  renderCards(allStaff);
  setTodayDate();

  // Search events
  searchInput.addEventListener('input', onSearch);
  searchClear.addEventListener('click', clearSearch);
});

function setTodayDate() {
  if (!todayDate) return;
  todayDate.textContent = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

// ── Stats ──
function renderStats() {
  const present = allStaff.filter(s => s.status === 'present').length;
  const absent  = allStaff.filter(s => s.status === 'absent').length;
  const leave   = allStaff.filter(s => s.status === 'leave').length;

  if (statPresent) statPresent.textContent = present;
  if (statAbsent)  statAbsent.textContent  = absent;
  if (statLeave)   statLeave.textContent   = leave;
  if (statTotal)   statTotal.textContent   = allStaff.length;
}

// ── Filters ──
function renderFilters() {
  if (!filterRow) return;

  const departments = getDepartments();
  filterRow.innerHTML = '';

  const allChip = createChip('All Staff', 'all');
  allChip.classList.add('active');
  filterRow.appendChild(allChip);

  // Status chips
  ['Present', 'Absent', 'On Leave'].forEach(label => {
    const key = label === 'On Leave' ? 'leave' : label.toLowerCase();
    filterRow.appendChild(createChip(label, `status-${key}`));
  });

  // Department chips
  departments.forEach(dept => {
    const shortDept = dept.replace('Engineering', 'Engg').replace('& Technology', '');
    filterRow.appendChild(createChip(shortDept.trim(), `dept-${dept}`));
  });
}

function createChip(label, value) {
  const btn = document.createElement('button');
  btn.className = 'chip';
  btn.textContent = label;
  btn.dataset.filter = value;
  btn.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = value;
    applyFilters();
  });
  return btn;
}

// ── Search ──
function onSearch() {
  searchQuery = searchInput.value.trim().toLowerCase();
  searchClear.style.display = searchQuery ? 'block' : 'none';
  applyFilters();
}

function clearSearch() {
  searchInput.value = '';
  searchQuery = '';
  searchClear.style.display = 'none';
  applyFilters();
  searchInput.focus();
}

// ── Apply Filters ──
function applyFilters() {
  let filtered = [...allStaff];

  // Text search
  if (searchQuery) {
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(searchQuery) ||
      s.designation.toLowerCase().includes(searchQuery) ||
      s.department.toLowerCase().includes(searchQuery) ||
      s.location.toLowerCase().includes(searchQuery)
    );
  }

  // Chip filter
  if (currentFilter !== 'all') {
    if (currentFilter.startsWith('status-')) {
      const status = currentFilter.replace('status-', '');
      filtered = filtered.filter(s => s.status === status);
    } else if (currentFilter.startsWith('dept-')) {
      const dept = currentFilter.replace('dept-', '');
      filtered = filtered.filter(s => s.department === dept);
    }
  }

  renderCards(filtered);
}

// ── Render Cards ──
function renderCards(staff) {
  if (!resultsGrid) return;

  // Update count
  if (resultsCount) {
    resultsCount.innerHTML = `Showing <strong>${staff.length}</strong> of <strong>${allStaff.length}</strong> staff members`;
  }

  if (staff.length === 0) {
    resultsGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <div class="empty-title">No results found</div>
        <div class="empty-desc">Try adjusting your search or filter to find who you're looking for.</div>
      </div>`;
    return;
  }

  resultsGrid.innerHTML = staff.map(s => buildCard(s)).join('');

  // Attach log-visit buttons
  resultsGrid.querySelectorAll('.log-visit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const person = allStaff.find(s => s.id == id);
      if (person) {
        // Navigate to visitor log page with pre-filled name
        window.location.href = `visitor-log.html?meet=${encodeURIComponent(person.name)}`;
      }
    });
  });
}

function buildCard(s) {
  const initials   = getInitials(s.name);
  const badgeClass = getStatusBadgeClass(s.status);
  const statusLabel = getStatusLabel(s.status);

  let locationHTML = '';
  if (s.status === 'present') {
    locationHTML = `
      <div class="location-card">
        <div class="location-icon">📍</div>
        <div>
          <div class="location-text-label">Currently Located At</div>
          <div class="location-text-value">${escapeHtml(s.location)}</div>
        </div>
      </div>`;
  } else if (s.status === 'absent') {
    locationHTML = `
      <div class="absent-card">
        <span style="font-size:1.2rem">🚫</span>
        <span>Not available on campus today.</span>
      </div>`;
  } else {
    locationHTML = `
      <div class="leave-card">
        <span style="font-size:1.2rem">🏖️</span>
        <span>Currently on leave. Please contact the department.</span>
      </div>`;
  }

  return `
    <div class="staff-card" role="article" aria-label="${escapeHtml(s.name)}">
      <div class="card-top">
        <div class="avatar ${s.avatarColor}">${initials}</div>
        <div class="card-info">
          <div class="card-name">${escapeHtml(s.name)}</div>
          <div class="card-designation">${escapeHtml(s.designation)}</div>
          <div class="card-dept">${escapeHtml(s.department)}</div>
        </div>
        <div class="status-badge ${badgeClass}">
          <span class="badge-dot"></span>${statusLabel}
        </div>
      </div>
      ${locationHTML}
      <div class="card-footer">
        <div class="card-contact">📞 ${escapeHtml(s.phone)}</div>
        <button class="log-visit-btn" data-id="${s.id}">+ Log Visit</button>
      </div>
    </div>`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str || ''));
  return div.innerHTML;
}
