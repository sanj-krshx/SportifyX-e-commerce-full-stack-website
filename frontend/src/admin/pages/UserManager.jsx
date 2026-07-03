import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../services/api";

function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`);
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
      toast.error("Unable to load users. Check backend connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const deleteUser = async (user) => {
    const confirmDelete = window.confirm(`Delete user ${user.fullname}?`);

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${user.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || "Unable to delete user.");
        return;
      }

      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed. Check backend connection.");
    }
  };

  return (
    <div className="dashboard-panel">
      <div className="dashboard-page-header">
        <div>
          <p>Accounts</p>
          <h1>User Management</h1>
        </div>
        <span>{users.length} users</span>
      </div>

      {loading ? (
        <div className="dashboard-empty">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="dashboard-empty">No users found.</div>
      ) : (
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                  <td>
                    <button type="button" onClick={() => deleteUser(user)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserManager;
