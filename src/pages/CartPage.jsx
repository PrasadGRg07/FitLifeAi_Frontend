import { useCart } from "../context/CartContext";


function cartPage() {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const total = cartItems.reduce(
        (acc, item) => acc + (item.price) * (item.quantity), 0
    );
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <p className="text-gray-600">Your cart is empty.</p>
            ) : (
                <div>
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border-b py-4">
                            <div>
                                <h2 className="text-xl font-semibold">{item.name}</h2>
                                <p className="text-gray-600">Rs {item.price}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded"
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded"
                                >
                                    +
                                </button>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold">Total: Rs {total.toFixed(2)}</h2>
                        <button className="mt-4 bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default cartPage