import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../services/api";

const productCategories = ["football", "cricket", "basketball", "tennis"];

function DashboardHome() {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    revenue: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const productResponses = await Promise.all(
          productCategories.map((category) =>
            fetch(`${API_BASE_URL}/${category}`).then((response) => response.json())
          )
        );
        const users = await fetch(`${API_BASE_URL}/admin/users`).then((response) =>
          response.json()
        );
        const orders = await fetch(`${API_BASE_URL}/admin/orders`).then((response) =>
          response.json()
        );

        setStats({
          products: productResponses.flat().length,
          users: Array.isArray(users) ? users.length : 0,
          orders: Array.isArray(orders) ? orders.length : 0,
          revenue: Array.isArray(orders)
            ? orders.reduce(
                (total, order) => total + Number(order.total || order.amount || 0),
                0
              )
            : 0,
        });
      } catch {
        setStats({
          products: 0,
          users: 0,
          orders: 0,
          revenue: 0,
        });
      }
    };

    loadStats();
  }, []);

  return (
    <div className="dashboard-panel">
      <div className="dashboard-page-header">
        <div>
          <p>Overview</p>
          <h1>Dashboard</h1>
        </div>
      </div>

      <div className="stats">
        <div className="card">
          <h2>{stats.products}</h2>
          <p>Total Products</p>
        </div>

        <div className="card">
          <h2>{stats.users}</h2>
          <p>Total Users</p>
        </div>

        <div className="card">
          <h2>{stats.orders}</h2>
          <p>Orders</p>
        </div>

        <div className="card">
          <h2>₹{stats.revenue.toLocaleString("en-IN")}</h2>
          <p>Revenue</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
