function Sidebar({ page, setPage }) {
    const navItems = [
        {
            id: "dashboard",
            label: "Dashboard"
        },
        {
            id: "banner",
            label: "Banners"
        },
        {
            id: "products",
            label: "Products"
        }
    ];

    return (

        <div className="sidebar">

            <h2>
                SportifyX
            </h2>

            {navItems.map((item) => (
                <button
                    key={item.id}
                    className={page === item.id ? "active-sidebar-item" : ""}
                    onClick={() => setPage(item.id)}
                >
                    {item.label}
                </button>
            ))}

        </div>
    );
}

export default Sidebar;
