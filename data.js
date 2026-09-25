/**
 * data.js — Seed data for J.J. College of Engineering & Technology
 * Staff directory with name, designation, department, location, status
 */

const COLLEGE_NAME = "J.J. College of Engineering and Technology";
const ADMIN_PASSWORD = "jjcet@admin"; // Change in production

const AVATAR_COLORS = [
  'av-purple', 'av-teal', 'av-orange', 'av-pink',
  'av-blue', 'av-green', 'av-red', 'av-indigo'
];

const DEFAULT_STAFF = [
  // ── PRINCIPAL / MANAGEMENT ──
  {
    id: 1,
    name: "Dr. S. Senthilkumar",
    designation: "Principal",
    department: "Administration",
    location: "Principal's Office, Block A",
    status: "present",
    phone: "0431-2407994",
    avatarColor: "av-purple"
  },
  {
    id: 2,
    name: "Dr. K. Ramesh",
    designation: "Vice Principal",
    department: "Administration",
    location: "Vice Principal's Office, Block A",
    status: "present",
    phone: "0431-2407994",
    avatarColor: "av-blue"
  },

  // ── COMPUTER SCIENCE ──
  {
    id: 3,
    name: "Dr. P. Aruna",
    designation: "Professor & Head",
    department: "Computer Science & Engineering",
    location: "HOD Cabin, CSE Block",
    status: "present",
    phone: "Ext. 201",
    avatarColor: "av-pink"
  },
  {
    id: 4,
    name: "Mr. R. Saravanan",
    designation: "Associate Professor",
    department: "Computer Science & Engineering",
    location: "Class Room 18, CSE Block",
    status: "present",
    phone: "Ext. 202",
    avatarColor: "av-teal"
  },
  {
    id: 5,
    name: "Mrs. T. Deepa",
    designation: "Assistant Professor",
    department: "Computer Science & Engineering",
    location: "Staff Room, CSE Block",
    status: "present",
    phone: "Ext. 203",
    avatarColor: "av-green"
  },
  {
    id: 6,
    name: "Mr. V. Karthikeyan",
    designation: "Assistant Professor",
    department: "Computer Science & Engineering",
    location: "Computer Lab 2, CSE Block",
    status: "absent",
    phone: "Ext. 204",
    avatarColor: "av-orange"
  },

  // ── INFORMATION TECHNOLOGY ──
  {
    id: 7,
    name: "Dr. M. Selvarani",
    designation: "Professor & Head",
    department: "Information Technology",
    location: "HOD Cabin, IT Block",
    status: "present",
    phone: "Ext. 301",
    avatarColor: "av-indigo"
  },
  {
    id: 8,
    name: "Mr. S. Balasubramanian",
    designation: "Associate Professor",
    department: "Information Technology",
    location: "Class Room 22, IT Block",
    status: "present",
    phone: "Ext. 302",
    avatarColor: "av-purple"
  },
  {
    id: 9,
    name: "Mrs. R. Kavitha",
    designation: "Assistant Professor",
    department: "Information Technology",
    location: "Staff Room, IT Block",
    status: "leave",
    phone: "Ext. 303",
    avatarColor: "av-teal"
  },

  // ── ELECTRONICS & COMMUNICATION ──
  {
    id: 10,
    name: "Dr. A. Muthuraj",
    designation: "Professor & Head",
    department: "Electronics & Communication",
    location: "HOD Cabin, ECE Block",
    status: "present",
    phone: "Ext. 401",
    avatarColor: "av-orange"
  },
  {
    id: 11,
    name: "Mr. G. Vijayakumar",
    designation: "Associate Professor",
    department: "Electronics & Communication",
    location: "Electronics Lab, ECE Block",
    status: "present",
    phone: "Ext. 402",
    avatarColor: "av-blue"
  },
  {
    id: 12,
    name: "Mrs. S. Priya",
    designation: "Assistant Professor",
    department: "Electronics & Communication",
    location: "Class Room 30, ECE Block",
    status: "absent",
    phone: "Ext. 403",
    avatarColor: "av-pink"
  },

  // ── MECHANICAL ENGINEERING ──
  {
    id: 13,
    name: "Dr. N. Krishnamurthy",
    designation: "Professor & Head",
    department: "Mechanical Engineering",
    location: "HOD Cabin, Mech Block",
    status: "present",
    phone: "Ext. 501",
    avatarColor: "av-green"
  },
  {
    id: 14,
    name: "Mr. P. Sundaram",
    designation: "Associate Professor",
    department: "Mechanical Engineering",
    location: "Workshop, Mech Block",
    status: "present",
    phone: "Ext. 502",
    avatarColor: "av-red"
  },
  {
    id: 15,
    name: "Mrs. K. Nithya",
    designation: "Assistant Professor",
    department: "Mechanical Engineering",
    location: "Class Room 40, Mech Block",
    status: "leave",
    phone: "Ext. 503",
    avatarColor: "av-indigo"
  },

  // ── CIVIL ENGINEERING ──
  {
    id: 16,
    name: "Dr. R. Venkataraman",
    designation: "Professor & Head",
    department: "Civil Engineering",
    location: "HOD Cabin, Civil Block",
    status: "present",
    phone: "Ext. 601",
    avatarColor: "av-teal"
  },
  {
    id: 17,
    name: "Mr. L. Anbarasan",
    designation: "Associate Professor",
    department: "Civil Engineering",
    location: "Survey Lab, Civil Block",
    status: "present",
    phone: "Ext. 602",
    avatarColor: "av-purple"
  },

  // ── ELECTRICAL ENGINEERING ──
  {
    id: 18,
    name: "Dr. C. Murugesan",
    designation: "Professor & Head",
    department: "Electrical & Electronics",
    location: "HOD Cabin, EEE Block",
    status: "present",
    phone: "Ext. 701",
    avatarColor: "av-orange"
  },
  {
    id: 19,
    name: "Mrs. V. Rajeshwari",
    designation: "Assistant Professor",
    department: "Electrical & Electronics",
    location: "Class Room 12, EEE Block",
    status: "absent",
    phone: "Ext. 702",
    avatarColor: "av-pink"
  },

  // ── MATHEMATICS / SCIENCE ──
  {
    id: 20,
    name: "Dr. S. Meenakshi",
    designation: "Professor & Head",
    department: "Mathematics",
    location: "Staff Room, Science Block",
    status: "present",
    phone: "Ext. 801",
    avatarColor: "av-blue"
  },

  // ── LIBRARY / ADMIN ──
  {
    id: 21,
    name: "Mr. T. Murugan",
    designation: "Librarian",
    department: "Library",
    location: "Central Library, Block C",
    status: "present",
    phone: "Ext. 901",
    avatarColor: "av-green"
  },
  {
    id: 22,
    name: "Mrs. P. Sumathi",
    designation: "Office Superintendent",
    department: "Administration",
    location: "Admin Office, Block A",
    status: "present",
    phone: "Ext. 902",
    avatarColor: "av-red"
  }
];

// ---------- Storage Helpers ----------

function getStaff() {
  const stored = localStorage.getItem('jjcet_staff');
  if (stored) return JSON.parse(stored);
  // Seed default data on first load
  localStorage.setItem('jjcet_staff', JSON.stringify(DEFAULT_STAFF));
  return DEFAULT_STAFF;
}

function saveStaff(data) {
  localStorage.setItem('jjcet_staff', JSON.stringify(data));
}

function getVisitors() {
  const stored = localStorage.getItem('jjcet_visitors');
  return stored ? JSON.parse(stored) : [];
}

function saveVisitors(data) {
  localStorage.setItem('jjcet_visitors', JSON.stringify(data));
}

function addVisitor(entry) {
  const visitors = getVisitors();
  entry.id = Date.now();
  entry.timeIn = new Date().toISOString();
  visitors.unshift(entry);
  saveVisitors(visitors);
  return entry;
}

// ---------- Utility Helpers ----------

function getInitials(name) {
  return name.split(' ')
    .filter(w => w.length > 0)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

function getStatusLabel(status) {
  const map = { present: 'Present', absent: 'Absent', leave: 'On Leave' };
  return map[status] || status;
}

function getStatusBadgeClass(status) {
  const map = { present: 'badge-present', absent: 'badge-absent', leave: 'badge-leave' };
  return map[status] || 'badge-absent';
}

function getStatusIcon(status) {
  const map = { present: '📍', absent: '🚫', leave: '🏖️' };
  return map[status] || '❓';
}

function formatDateTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });
}

function formatTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Toast notifications
function showToast(message, type = 'info') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Unique departments list
function getDepartments() {
  const staff = getStaff();
  return [...new Set(staff.map(s => s.department))].sort();
}
