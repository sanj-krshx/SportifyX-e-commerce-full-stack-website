import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../services/api";

function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders`);
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
      toast.error("Unable to load orders. Check backend connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="dashboard-panel">
      <div className="dashboard-page-header">
        <div>
          <p>Sales</p>
          <h1>Order Management</h1>
        </div>
        <span>{orders.length} orders</span>
      </div>

      {loading ? (
        <div className="dashboard-empty">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="dashboard-empty">
          No orders found yet. New orders will appear here when checkout is added.
        </div>
      ) : (
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.user_id || order.customer_name || "Customer"}</td>
                  <td>₹{Number(order.total || order.amount || 0).toLocaleString("en-IN")}</td>
                  <td>{order.status || "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrderManager;
