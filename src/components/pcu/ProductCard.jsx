import { Link } from "react-router-dom";

function ProductCard({ product }) {
    // Provide a safe fallback for BASE_URL in case env var isn't loaded
    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL || 'http://localhost:8000';

  // Determine image src:
  // - if `product.image` is a full URL, use it
  // - else if `product.image_url` is present, prefix with BASE_URL
  // - otherwise use a placeholder
  const src = product.image
    ? product.image
    : product.image_url
    ? `${BASE_URL}${product.image_url}`
    : 'https://via.placeholder.com/400x300?text=No+Image';

    return (
      <Link to={`/product/${product.id}`}>
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform p-4 cursor-pointer">
      <img 
        src={src} 
        alt={product.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
        <p className="text-gray-700">RS{product.price}</p>
        <p className="text-gray-600 mt-2">{product.description}</p>
      </div>
            </div>
            </Link>
  );
}

export default ProductCard;