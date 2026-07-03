import { useEffect, useState } from "react";

function BannerManagement() {

    const [file, setFile] = useState(null);
    const [banners, setBanners] = useState([]);

    const fetchBanners = async () => {

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/banner"
            );

            const data = await response.json();

            setBanners(data);

        } catch(error) {

            console.error(error);

        }
    };

    useEffect(() => {

        fetchBanners();

    }, []);

    const uploadBanner = async () => {

        if(!file){
            alert("Select a file");
            return;
        }

        const formData = new FormData();

        formData.append("file", file);

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/admin/banner/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            alert(data.message);

            fetchBanners();

        } catch(error){

            console.error(error);

        }
    };

    return (

        <div style={{padding:"30px"}}>

            <h1>Banner Management</h1>

            <input
                type="file"
                onChange={(e)=>
                    setFile(e.target.files[0])
                }
            />

            <button
                onClick={uploadBanner}
                style={{
                    marginLeft:"10px"
                }}
            >
                Add Banner
            </button>

            <div
                style={{
                    display:"grid",
                    gridTemplateColumns:
                        "repeat(auto-fill,minmax(300px,1fr))",
                    gap:"20px",
                    marginTop:"30px"
                }}
            >

                {banners.map((banner)=>(

                    <div
                        key={banner.id}
                        style={{
                            border:"1px solid #ddd",
                            borderRadius:"10px",
                            padding:"10px"
                        }}
                    >

                        <img
                            src={
                                `http://127.0.0.1:8000/uploads/${banner.image}`
                            }
                            alt=""
                            style={{
                                width:"100%",
                                height:"180px",
                                objectFit:"cover",
                                borderRadius:"10px"
                            }}
                        />

                    </div>

                ))}

            </div>

        </div>
    );
}

export default BannerManagement;