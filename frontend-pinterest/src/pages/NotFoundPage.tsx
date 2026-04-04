import {Link} from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';


const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-red-500">404</h1>
                <p className="text-2xl font-semibold text-gray-800 mt-4">Page not found</p>
                <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>

                <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 mt-8 px-8 py-3 rounded-full font-semibold text-sm transition-all duration-200 active:scale-95 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
                >
                    <FontAwesomeIcon icon={faHouse} />
                    Back to Home
                </Link>
        </div>
</div>
);
};

export default NotFoundPage;