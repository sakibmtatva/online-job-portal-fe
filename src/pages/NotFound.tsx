import { Link } from "react-router-dom";
import Header from "../components/custom/Header";

const NotFound = () => {
  return (
    <>
      <Header />
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-100">
        <div className="text-center px-4">
          <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
          <div className="mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-3">
              Oops! Page not found
            </h2>
            <p className="text-gray-600 md:text-lg">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Homepage
            </Link>
            <Link
              to="/jobs"
              className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound; 