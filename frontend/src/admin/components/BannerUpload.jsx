import { useEffect, useState } from "react";

function BannerUpload() {

    const [file, setFile] = useState(null);
    const [banners, setBanners] = useState([]);
    const [message, setMessage] = useState("");

    // Fetch all banners
    const fetchBanners = async () => {

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/banner"
            );

            const data = await response.json();

            setBanners(data);

        } catch (error) {

            console.error(error);

            setMessage("Failed to fetch banners");

            setTimeout(() => {
                setMessage("");
            }, 2000);
        }
    };

    useEffect(() => {

        fetchBanners();

    }, []);

    // Upload banner
    const uploadBanner = async () => {

        if (!file) {

            setMessage("Please select an image");

            setTimeout(() => {
                setMessage("");
            }, 2000);

            return;
        }

        const formData = new FormData();

        formData.append(
            "file",
            file
        );

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/admin/banner/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            setMessage(data.message);

            setTimeout(() => {
                setMessage("");
            }, 2000);

            setFile(null);

            fetchBanners();

        } catch (error) {

            console.error(error);

            setMessage("Upload Failed");

            setTimeout(() => {
                setMessage("");
            }, 2000);
        }
    };

    // Delete banner
    const deleteBanner = async (id) => {

        const confirmDelete =
            window.confirm(
                "Delete this banner?"
            );

        if (!confirmDelete) return;

        try {

            const response = await fetch(
                `http://127.0.0.1:8000/admin/banner/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            setMessage(data.message);

            setTimeout(() => {
                setMessage("");
            }, 2000);

            fetchBanners();

        } catch (error) {

            console.error(error);

            setMessage("Delete Failed");

            setTimeout(() => {
                setMessage("");
            }, 2000);
        }
    };

    return (

        <div
            style={{
                padding: "30px"
            }}
        >

            <h1
                style={{
                    marginBottom: "25px"
                }}
            >
                Banner Management
            </h1>

            {/* Success Message */}

            {message && (

                <div
                    style={{
                        background: "#4CAF50",
                        color: "white",
                        padding: "10px",
                        borderRadius: "5px",
                        marginBottom: "20px"
                    }}
                >
                    {message}
                </div>

            )}

            {/* Upload Section */}

            <div
                style={{
                    marginBottom: "30px"
                }}
            >

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setFile(
                            e.target.files[0]
                        )
                    }
                />

                <button
                    onClick={uploadBanner}
                    style={{
                        marginLeft: "10px",
                        padding:
                            "8px 20px",
                        cursor:
                            "pointer"
                    }}
                >
                    Add Banner
                </button>

            </div>

            {/* Banner Grid */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "20px"
                }}
            >

                {banners.map(
                    (banner) => (

                        <div
                            key={
                                banner.id
                            }
                            style={{
                                border:
                                    "1px solid #ddd",
                                borderRadius:
                                    "10px",
                                padding:
                                    "10px",
                                background:
                                    "#fff",
                                boxShadow:
                                    "0 2px 8px rgba(0,0,0,0.1)"
                            }}
                        >

                            <img
                                src={
                                    `http://127.0.0.1:8000/uploads/${banner.image}`
                                }
                                alt="banner"
                                style={{
                                    width:
                                        "100%",
                                    height:
                                        "180px",
                                    objectFit:
                                        "cover",
                                    borderRadius:
                                        "8px"
                                }}
                            />

                            <button
                                onClick={() =>
                                    deleteBanner(
                                        banner.id
                                    )
                                }
                                style={{
                                    width:
                                        "100%",
                                    marginTop:
                                        "10px",
                                    background:
                                        "#ff4444",
                                    color:
                                        "white",
                                    border:
                                        "none",
                                    padding:
                                        "10px",
                                    borderRadius:
                                        "5px",
                                    cursor:
                                        "pointer"
                                }}
                            >
                                Delete Banner
                            </button>

                        </div>

                    )
                )}

            </div>

        </div>
    );
}

export default BannerUpload;