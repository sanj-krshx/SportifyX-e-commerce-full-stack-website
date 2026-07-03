import { useState } from "react";

import Sidebar from "../components/Sidebar";
import DashboardHome from "../components/DashboardHome";
import BannerUpload from "../components/BannerUpload";
import ProductManagement from "./ProductManagement";
import "../styles/Dashboard.css";

function Dashboard() {

    const [page, setPage] =
        useState("dashboard");

    return (

        <div className="dashboard-container">

            <Sidebar
                page={page}
                setPage={setPage}
            />

            <div className="dashboard-content">

                {page === "dashboard" &&
                    <DashboardHome />
                }

                {page === "banner" &&
                    <BannerUpload />
                }

                {page === "products" &&
                    <ProductManagement />
                }

            </div>

        </div>
    );
}

export default Dashboard;
