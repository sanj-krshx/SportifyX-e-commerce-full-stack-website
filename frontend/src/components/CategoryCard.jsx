import { Link } from "react-router-dom";

function CategoryCard({ image, title, to }) {
  return (
    <Link className="category-card" to={to}>
      <img src={image} alt={`${title} products`} />

      <div className="category-card-content">
        <h3>{title}</h3>
        <span>View products</span>
      </div>
    </Link>
  );
}

export default CategoryCard;
