import { useEffect, useState } from "react";

function TennisProducts() {

    const [products, setProducts] = useState([]);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");

    const [file, setFile] = useState(null);

    const fetchProducts = async () => {

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/tennis"
            );

            const data = await response.json();

            setProducts(data);

        } catch (error) {

            console.error(error);

            alert("Failed to load products");
        }
    };

    useEffect(() => {

        fetchProducts();

    }, []);

    const addProduct = async () => {

        if (
            !name ||
            !price ||
            !stock ||
            !file
        ) {

            alert(
                "Please fill all fields"
            );

            return;
        }

        const formData = new FormData();

        formData.append(
            "name",
            name
        );

        formData.append(
            "price",
            price
        );

        formData.append(
            "stock",
            stock
        );

        formData.append(
            "file",
            file
        );

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/tennis/add",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data =
                await response.json();

            console.log(
                data.message
            );

            setName("");
            setPrice("");
            setStock("");
            setFile(null);

            fetchProducts();

        } catch (error) {

            console.error(error);

            alert(
                "Failed to add product"
            );
        }
    };

    const deleteProduct =
        async (id) => {

        try {

            const response =
                await fetch(
                    `http://127.0.0.1:8000/tennis/${id}`,
                    {
                        method:
                            "DELETE"
                    }
                );

            const data =
                await response.json();

            console.log(
                data.message
            );

            fetchProducts();

        } catch (error) {

            console.error(error);

            alert(
                "Failed to delete product"
            );
        }
    };

    return (

        <div
            style={{
                padding:
                    "30px"
            }}
        >

            <h1>
                Tennis Product Management
            </h1>

            <div
                style={{
                    border:
                        "1px solid #ddd",
                    padding:
                        "20px",
                    borderRadius:
                        "10px",
                    marginBottom:
                        "30px"
                }}
            >

                <input
                    type="text"
                    placeholder="Product Name"
                    value={name}
                    onChange={(e) =>
                        setName(
                            e.target.value
                        )
                    }
                />

                <br /><br />

                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) =>
                        setPrice(
                            e.target.value
                        )
                    }
                />

                <br /><br />

                <input
                    type="number"
                    placeholder="Stock"
                    value={stock}
                    onChange={(e) =>
                        setStock(
                            e.target.value
                        )
                    }
                />

                <br /><br />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setFile(
                            e.target.files[0]
                        )
                    }
                />

                <br /><br />

                <button
                    onClick={
                        addProduct
                    }
                >
                    Add Tennis Product
                </button>

            </div>

            <div
                style={{
                    display:
                        "grid",
                    gridTemplateColumns:
                        "repeat(auto-fill,minmax(300px,1fr))",
                    gap:
                        "20px"
                }}
            >

                {products.map(
                    (
                        product
                    ) => (

                        <div
                            key={
                                product.id
                            }
                            style={{
                                border:
                                    "1px solid #ddd",
                                borderRadius:
                                    "10px",
                                padding:
                                    "15px"
                            }}
                        >

                            <img
                                src={
                                    `http://127.0.0.1:8000/uploads/${product.image}`
                                }
                                alt={
                                    product.name
                                }
                                style={{
                                    width:
                                        "100%",
                                    height:
                                        "200px",
                                    objectFit:
                                        "cover",
                                    borderRadius:
                                        "10px"
                                }}
                            />

                            <h3>
                                {
                                    product.name
                                }
                            </h3>

                            <p>
                                Price:
                                ₹
                                {
                                    product.price
                                }
                            </p>

                            <p>
                                Stock:
                                {
                                    product.stock
                                }
                            </p>

                            <button
                                onClick={() =>
                                    deleteProduct(
                                        product.id
                                    )
                                }
                            >
                                Delete Product
                            </button>

                        </div>

                    )
                )}

            </div>

        </div>
    );
}

export default TennisProducts;