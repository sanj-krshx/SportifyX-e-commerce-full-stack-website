import "./ProductCard.css";

function ProductCard({
    id,
    image,
    name,
    price,
    rating,
    category,
    stock,
    addToCart
}) {
    const formattedPrice =
        typeof price === "string" && price.includes("₹")
            ? price
            : `₹${Number(price || 0).toLocaleString("en-IN")}`;

    return (

        <div className="product-card">

            <div className="product-image-container">

                <img
                    src={image}
                    alt={name}
                    className="product-image"
                />

            </div>

            <div className="product-info">

                <p className="product-category">
                    {category}
                </p>

                <h3 className="product-name">
                    {name}
                </h3>

                <h2 className="product-price">
                    {formattedPrice}
                </h2>

                <div className="product-meta">
                    <span>{rating} rating</span>
                    <span>{stock ? `${stock} in stock` : "In stock"}</span>
                </div>

                <button
                    className="cart-btn"
                    type="button"
                    onClick={() =>
                        addToCart(id)
                    }
                >
                    Add To Cart
                </button>

            </div>

        </div>
    );
}

export default ProductCard;
