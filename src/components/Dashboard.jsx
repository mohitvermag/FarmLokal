import { useEffect, useState } from "react";
import { fetchUsers } from "../services/api";
import { logoutUser, getLoggedInUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingProductId, setEditingProductId] = useState(null);
    const [editedProduct, setEditedProduct] = useState({});
    const productsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const user = getLoggedInUser();
        if (!user) {
            navigate("/login");
        } else {
            fetchUsers().then((data) => {
                console.log(data)
                setProducts(data);
                setLoading(false);
            });
        }
    }, [navigate]);

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    // Search filter
    const filteredProducts = products.filter(
        (p) =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.toString().includes(searchTerm)
    );

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    // Edit Data
    const startEdit = (product) => {
        setEditingProductId(product.id);
        setEditedProduct({ ...product });
    };

    const cancelEdit = () => {
        setEditingProductId(null);
        setEditedProduct({});
    };

    const saveProduct = (id) => {
        setProducts(
            products.map((p) => (p.id === id ? { ...p, ...editedProduct } : p))
        );
        cancelEdit();
    };

    if (loading) return <p className="loading-text">Loading...</p>;


    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Product Dashboard</h1>
            <button onClick={handleLogout} className="logout-button" style={{ marginBottom: "10px", padding: "8px", width: "100px", marginRight: "20px", borderRadius: "4px" }}>
                Logout
            </button>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search by ID or Name"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                }}
                className="search-input"
                style={{ marginBottom: "20px", padding: "8px", width: "250px" }}
            />

            <div className="product-grid">
                {currentProducts.map((p) => (
                    <div key={p.id} className="product-card">
                        {editingProductId === p.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editedProduct.title}
                                    onChange={(e) =>
                                        setEditedProduct({ ...editedProduct, title: e.target.value })
                                    }
                                    placeholder="Title"
                                />
                                <input
                                    type="text"
                                    value={editedProduct.category}
                                    onChange={(e) =>
                                        setEditedProduct({ ...editedProduct, category: e.target.value })
                                    }
                                    placeholder="Category"
                                />
                                <input
                                    type="number"
                                    value={editedProduct.price}
                                    onChange={(e) =>
                                        setEditedProduct({ ...editedProduct, price: e.target.value })
                                    }
                                    placeholder="Price"
                                />
                                <input
                                    type="text"
                                    value={editedProduct.description}
                                    onChange={(e) =>
                                        setEditedProduct({ ...editedProduct, description: e.target.value })
                                    }
                                    placeholder="Description"
                                />
                                <button onClick={() => saveProduct(p.id)}>Save</button>
                                <button onClick={cancelEdit}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <img src={p.image} alt={p.title} className="product-image" />
                                <h3 className="product-title">{p.title}</h3>
                                <p className="product-category">{p.category}</p>
                                <p className="product-price">${p.price}</p>
                                <p className="product-rating">
                                    ⭐ {p.rating?.rate} ({p.rating?.count})
                                </p>
                                <p className="product-description">{p.description}</p>
                                <button onClick={() => startEdit(p)}>Edit</button>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => goToPage(i + 1)}
                        className={currentPage === i + 1 ? "active-page" : ""}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
