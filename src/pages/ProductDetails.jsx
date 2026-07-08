import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function ProductDetails() {
    const { id } = useParams();
    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL || 'http://localhost:8000';
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    

    useEffect(() => {
        fetch(`${BASE_URL}/api/users/products/${id}/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch product details");
                }
                return response.json();
            })
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
        
    }, [id,BASE_URL]);

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    if (!product) return <div className="text-center py-10">Product not found.</div>;

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <div className="container mx-auto p-4">
                <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
                    <img 
                        src={product.image ? product.image : (product.image_url ? `${BASE_URL}${product.image_url}` : `https://via.placeholder.com/400x300?text=No+Image`)}
                        alt={product.name} 
                        className="w-full h-96 object-cover rounded-md mb-6"
                    />
                    <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                    <p className="text-2xl text-gray-700 mb-4">RS{product.price}</p>
                    <p className="text-gray-600 mb-6">{product.description}</p>
                    <p className="text-gray-500">Category: {product.category ? product.category.name : 'Uncategorized'}</p>
                        <button onClick={()=> addToCart(product)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700" >
                            add to cart
                        </button>   
                        {/*back to home button */}
                        <div className="mt-4">
                            <a href="/" className="text-blue-600 hover:underline">
                            </a>
                            <button onClick={() => window.history.back()} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                                Back
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails