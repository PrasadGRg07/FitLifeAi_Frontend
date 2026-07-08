import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx';

function Navbar() {
    const { cartItems } = useCart();
    const cartCount = (cartItems || []).reduce((total, item) => total + (item.quantity || 0), 0);
    const navigate = useNavigate();

    return (
         <nav className='bg-white shadow-md px-6 py-4 flex justify-between items-center fixed w-full top-0 z-50'>
        <div>
                <Link to="/" className='text-2xl font-bold text-gray-800'>FitLifeAI</Link>
                </div>

            {/* Desktop Nav */}
           <div className="absolute top-4 right-150 md:flex justify-center items-center gap-8 hidden">
            <Link to="/" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Home</Link>
                <Link to="/features" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Features</Link>
                <Link to="/aboutus" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Aboutus</Link>
            <Link to="/plans" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Plans</Link>
           </div>


            {/* authenticated user buttons */}
            <button 
                onClick={() => navigate('/login')}
                className="absolute top-4 right-60 bg-emerald-600 text-white px-5 py-2 rounded-xl hover:bg-emerald-700 transition"
            >
                Login
            </button>
            <button 
                onClick={() => navigate('/signup')}
                className="absolute top-4 right-35 bg-emerald-600 text-white px-5 py-2 rounded-xl hover:bg-emerald-700 transition"
            >
                SignUp
            </button>
            <button 
                onClick={() => navigate('/admin/login')}
                className="absolute top-4 right-1 bg-emerald-600 text-white px-5 py-2 rounded-xl hover:bg-emerald-700 transition"
            >
                Admin Login
            </button>
                        
            

            {/* <Link to="/cart" className='relative text-gray-900 hover:text-gray-600 font-medium'>
                Cart {cartCount > 0 &&
                    <span className='absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
                    {cartCount}
                    </span>}
            </Link>  */}
        </nav>
    )
}
export default Navbar