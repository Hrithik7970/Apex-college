// Frontend API Client layer with automatic fallback to LocalStorage/State

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper for safe fetch with fallback
async function fetchWithFallback(url, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s timeout for local server check

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    // If backend is offline or errors out, signal caller to use fallback
    return null;
  }
}

export const api = {
  // Check API status
  async checkHealth() {
    return await fetchWithFallback(`${API_BASE_URL}/health`);
  },

  // Seed DB
  async seedDatabase() {
    return await fetchWithFallback(`${API_BASE_URL}/seed`, { method: 'POST' });
  },

  // Students
  async getStudents() {
    return await fetchWithFallback(`${API_BASE_URL}/students`);
  },

  async createStudent(studentData) {
    return await fetchWithFallback(`${API_BASE_URL}/students`, {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
  },

  async updateStudent(id, studentData) {
    return await fetchWithFallback(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData)
    });
  },

  async deleteStudent(id) {
    return await fetchWithFallback(`${API_BASE_URL}/students/${id}`, {
      method: 'DELETE'
    });
  },

  async logAttendance(id, logData) {
    return await fetchWithFallback(`${API_BASE_URL}/students/${id}/attendance`, {
      method: 'POST',
      body: JSON.stringify(logData)
    });
  },

  // Pending Approvals
  async getPendingApprovals() {
    return await fetchWithFallback(`${API_BASE_URL}/approvals`);
  },

  async createPendingApproval(reqData) {
    return await fetchWithFallback(`${API_BASE_URL}/approvals`, {
      method: 'POST',
      body: JSON.stringify(reqData)
    });
  },

  async approveRequest(id, assignedRole) {
    return await fetchWithFallback(`${API_BASE_URL}/approvals/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ assignedRole })
    });
  },

  async rejectRequest(id) {
    return await fetchWithFallback(`${API_BASE_URL}/approvals/${id}/reject`, {
      method: 'POST'
    });
  },

  // Announcements
  async getAnnouncements() {
    return await fetchWithFallback(`${API_BASE_URL}/announcements`);
  },

  async createAnnouncement(announcement) {
    return await fetchWithFallback(`${API_BASE_URL}/announcements`, {
      method: 'POST',
      body: JSON.stringify(announcement)
    });
  },

  async deleteAnnouncement(id) {
    return await fetchWithFallback(`${API_BASE_URL}/announcements/${id}`, {
      method: 'DELETE'
    });
  },

  // Complaints
  async getComplaints(params = {}) {
    const query = new URLSearchParams(params).toString();
    return await fetchWithFallback(`${API_BASE_URL}/complaints?${query}`);
  },

  async createComplaint(complaint) {
    return await fetchWithFallback(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      body: JSON.stringify(complaint)
    });
  },

  async resolveComplaint(id, resolution) {
    return await fetchWithFallback(`${API_BASE_URL}/complaints/${id}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ resolution })
    });
  },

  // Roles
  async getUserRole(email) {
    return await fetchWithFallback(`${API_BASE_URL}/roles/${encodeURIComponent(email)}`);
  },

  async setUserRole(email, role) {
    return await fetchWithFallback(`${API_BASE_URL}/roles`, {
      method: 'POST',
      body: JSON.stringify({ email, role })
    });
  }
};
