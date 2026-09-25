/**
 * log.js — Visitor Log page logic
 * Handles visitor registration form & log table
 */

document.addEventListener('DOMContentLoaded', () => {
  populateStaffDropdown();
  prefillFromURL();
  renderVisitorTable();
  setTodayHeader();

  const form = document.getElementById('visitorForm');
  const clearBtn = document.getElementById('clearBtn');

  form.addEventListener('submit', handleSubmit);
  clearBtn.addEventListener('click', () => {
    form.reset();
    document.getElementById('meetingPerson').value = '';
  });
});

function setTodayHeader() {
  const el = document.getElementById('todayLabel');
  if (el) {
    el.textContent = `Today — ${new Date().toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })}`;
  }
}

function populateStaffDropdown() {
  const select = document.getElementById('meetingPerson');
  if (!select) return;

  const staff = getStaff();

  // Group by department
  const grouped = {};
  staff.forEach(s => {
    if (!grouped[s.department]) grouped[s.department] = [];
    grouped[s.department].push(s);
  });

  Object.keys(grouped).sort().forEach(dept => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = dept;
    grouped[dept].forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.name;
      opt.textContent = `${s.name} (${s.designation})`;
      optgroup.appendChild(opt);
    });
    select.appendChild(optgroup);
  });
}

function prefillFromURL() {
  const params = new URLSearchParams(window.location.search);
  const meet = params.get('meet');
  if (meet) {
    const select = document.getElementById('meetingPerson');
    if (select) {
      // Try to find matching option
      for (let opt of select.options) {
        if (opt.value === meet) {
          select.value = meet;
          break;
        }
      }
    }
    // Scroll to form
    document.getElementById('visitorForm')?.scrollIntoView({ behavior: 'smooth' });
  }
}

function handleSubmit(e) {
  e.preventDefault();

  const visitorName   = document.getElementById('visitorName').value.trim();
  const phone         = document.getElementById('phone').value.trim();
  const meetingPerson = document.getElementById('meetingPerson').value;
  const purpose       = document.getElementById('purpose').value.trim();
  const address       = document.getElementById('address').value.trim();

  if (!visitorName || !phone || !meetingPerson || !purpose) {
    showToast('Please fill all required fields.', 'error');
    return;
  }

  // Phone validation (10 digits)
  if (!/^\d{10}$/.test(phone)) {
    showToast('Please enter a valid 10-digit phone number.', 'error');
    return;
  }

  const entry = addVisitor({ visitorName, phone, meetingPerson, purpose, address });
  showToast(`Visit logged for ${visitorName}!`, 'success');

  // Reset form
  e.target.reset();

  // Re-render table
  renderVisitorTable();

  // Scroll to table
  setTimeout(() => {
    document.getElementById('tableSection')?.scrollIntoView({ behavior: 'smooth' });
  }, 400);
}

function renderVisitorTable() {
  const tbody   = document.getElementById('visitorTbody');
  const countEl = document.getElementById('visitorCount');
  if (!tbody) return;

  const visitors = getVisitors();

  // Count today's visitors
  const today = new Date().toDateString();
  const todayVisitors = visitors.filter(v => new Date(v.timeIn).toDateString() === today);

  if (countEl) countEl.textContent = todayVisitors.length;

  if (visitors.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="table-empty">No visitor entries yet. Be the first to log a visit!</td></tr>`;
    return;
  }

  tbody.innerHTML = visitors.map((v, idx) => `
    <tr>
      <td>${escapeHtml(v.visitorName)}</td>
      <td>${escapeHtml(v.phone)}</td>
      <td>${escapeHtml(v.meetingPerson)}</td>
      <td>${escapeHtml(v.purpose)}</td>
      <td>${formatDateTime(v.timeIn)}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteVisitor(${v.id})">🗑️</button>
      </td>
    </tr>`).join('');
}

function deleteVisitor(id) {
  if (!confirm('Remove this visitor entry?')) return;
  let visitors = getVisitors();
  visitors = visitors.filter(v => v.id !== id);
  saveVisitors(visitors);
  renderVisitorTable();
  showToast('Entry removed.', 'info');
}

function exportCSV() {
  const visitors = getVisitors();
  if (visitors.length === 0) {
    showToast('No entries to export.', 'error');
    return;
  }

  const headers = ['Visitor Name', 'Phone', 'Meeting Person', 'Purpose', 'Address', 'Time In'];
  const rows = visitors.map(v => [
    v.visitorName, v.phone, v.meetingPerson,
    v.purpose, v.address || '', formatDateTime(v.timeIn)
  ].map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `JJCET_Visitors_${new Date().toLocaleDateString('en-CA')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSV exported!', 'success');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str || ''));
  return div.innerHTML;
}
