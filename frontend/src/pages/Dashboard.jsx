import { useState } from "react";

import Sidebar from "../components/Sidebar";
import DashboardHome from "./DashboardHome";
import BannerManager from "./BannerManager";
import ProductManager from "./ProductManager";
import UserManager from "./UserManager";

import "../styles/Dashboard.css";

function Dashboard() {

  const [page, setPage] = useState("dashboard");

  return (

    <div className="dashboard">

      <Sidebar setPage={setPage} />

      <div className="dashboard-content">

        {page === "dashboard" && <DashboardHome />}

        {page === "banners" && <BannerManager />}

        {page === "products" && <ProductManager />}

        {page === "users" && <UserManager />}

      </div>

    </div>

  );

}

export default Dashboard;