import { useEffect, useState } from "react";
import ProductCard from "../components/pcu/ProductCard";


function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    fetch(`${BASE_URL}/api/users/products/`)
        .then((response) => {
            if (!response.ok) {  
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <h1 className="text-3xl font-bold text-gray-900 text-center my-8">Product List</h1>
            <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p className="text-center col-span-full text-gray-500">No products available.</p>
                )}
            </div>
        </div>
    );
}

export default ProductList;