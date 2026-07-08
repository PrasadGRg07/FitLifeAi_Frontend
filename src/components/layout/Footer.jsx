import { Link } from 'react-router-dom'


function Footer() {
  return (
    <footer className="border-t mt-16 py-6 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} FitLife AI. All rights reserved.
    </footer>
  );
}

export default Footer;