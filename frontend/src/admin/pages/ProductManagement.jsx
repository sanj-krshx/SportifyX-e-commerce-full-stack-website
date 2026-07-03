import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { API_BASE_URL, assetUrl } from "../../services/api";
import "./ProductManagement.css";

const categories = [
  { value: "football", label: "Football" },
  { value: "cricket", label: "Cricket" },
  { value: "basketball", label: "Basketball" },
  { value: "tennis", label: "Tennis" },
  { value: "volleyball", label: "Volleyball" },
];

const emptyForm = {
  category: "football",
  name: "",
  price: "",
  quantity: "",
  file: null,
};

function ProductManagement() {
  const [category, setCategory] = useState("football");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showPopup, setShowPopup] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const categoryLabel = useMemo(
    () => categories.find((item) => item.value === category)?.label || "Products",
    [category]
  );

  const resetPopup = () => {
    setForm(emptyForm);
    setEditingProduct(null);
    setShowPopup(false);
  };

  const openAddPopup = () => {
    setForm({
      ...emptyForm,
      category,
    });
    setEditingProduct(null);
    setShowPopup(true);
  };

  const openEditPopup = (product) => {
    setForm({
      category,
      name: product.name || "",
      price: product.price || "",
      quantity: product.stock ?? product.quantity ?? "",
      file: null,
    });
    setEditingProduct(product);
    setShowPopup(true);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/${category}`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
      toast.error("Unable to load products. Check backend connection.");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveProduct = async () => {
    if (!form.name.trim() || !form.price || !form.quantity) {
      toast.warning("Please fill product name, price and quantity.");
      return;
    }

    if (!editingProduct && !form.file) {
      toast.warning("Please choose a product image.");
      return;
    }

    try {
      let response;

      if (editingProduct) {
        response = await fetch(`${API_BASE_URL}/${category}/${editingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            price: Number(form.price),
            quantity: Number(form.quantity),
          }),
        });
      } else {
        const formData = new FormData();
        formData.append("name", form.name.trim());
        formData.append("price", form.price);
        formData.append("quantity", form.quantity);
        formData.append("file", form.file);

        response = await fetch(`${API_BASE_URL}/${form.category}/add`, {
          method: "POST",
          body: formData,
        });
      }

      const data = await response.json().catch(() => ({
        success: false,
        message: "Backend returned an error while saving.",
      }));

      if (!response.ok || !data.success) {
        toast.error(data.message || "Unable to save product.");
        return;
      }

      toast.success(editingProduct ? "Product updated" : "Product added");
      resetPopup();

      if (!editingProduct && form.category !== category) {
        setCategory(form.category);
      } else {
        fetchProducts();
      }
    } catch {
      toast.error(
        `Save failed. Make sure the FastAPI backend is running at ${API_BASE_URL}.`
      );
    }
  };

  const deleteProduct = async (product) => {
    const confirmDelete = window.confirm(`Delete ${product.name}?`);

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${category}/${product.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || "Delete failed.");
        return;
      }

      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed. Check backend connection.");
    }
  };

  return (
    <div className="product-page">
      <div className="product-page-header">
        <div>
          <p>Inventory</p>
          <h1>Product Management</h1>
        </div>

        <button className="primary-action" type="button" onClick={openAddPopup}>
          + Add Product
        </button>
      </div>

      <div className="product-toolbar">
        <label>
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <div className="product-count">
          {products.length} {categoryLabel} products
        </div>
      </div>

      {loading ? (
        <div className="admin-empty-state">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="admin-empty-state">
          No products found for {categoryLabel}.
        </div>
      ) : (
        <div className="admin-products-grid">
          {products.map((product) => {
            const stock = product.stock ?? product.quantity ?? 0;

            return (
              <article className="admin-product-card" key={product.id}>
                <img src={assetUrl(product.image)} alt={product.name} />

                <div className="admin-product-body">
                  <h3>{product.name}</h3>
                  <p className="admin-product-price">
                    ₹{Number(product.price || 0).toLocaleString("en-IN")}
                  </p>
                  <p className="admin-product-stock">Quantity: {stock}</p>

                  <div className="admin-product-actions">
                    <button type="button" onClick={() => openEditPopup(product)}>
                      Edit
                    </button>
                    <button
                      className="danger-action"
                      type="button"
                      onClick={() => deleteProduct(product)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {showPopup && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true">
          <div className="admin-product-modal">
            <button
              className="modal-x-button"
              type="button"
              aria-label="Close popup"
              onClick={resetPopup}
            >
              X
            </button>

            <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>

            {!editingProduct && (
              <label>
                Category
                <select
                  value={form.category}
                  onChange={(event) => updateForm("category", event.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label>
              Product Name
              <input
                type="text"
                placeholder="Product Name"
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
              />
            </label>

            <label>
              Price
              <input
                type="number"
                min="1"
                placeholder="Price"
                value={form.price}
                onChange={(event) => updateForm("price", event.target.value)}
              />
            </label>

            <label>
              Quantity
              <input
                type="number"
                min="0"
                placeholder="Quantity"
                value={form.quantity}
                onChange={(event) => updateForm("quantity", event.target.value)}
              />
            </label>

            {!editingProduct && (
              <label className="file-control">
                Product Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    updateForm("file", event.target.files?.[0] || null)
                  }
                />
              </label>
            )}

            <div className="modal-actions">
              <button className="save-action" type="button" onClick={saveProduct}>
                {editingProduct ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;
