import { briefcase } from "../assets/assets";
import bgTile2 from "../assets/bg-tile.png";


const LoginInfo = () => {

  return (
      <div 
        className="hidden lg:flex w-1/2 text-white p-12 items-center overflow-hidden"
        style={{
          backgroundImage: `url(${bgTile2})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="inset-0"
          style={{
            backgroundImage: `url(${bgTile2})`,
            backgroundSize: "500px",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Content */}
        <div className="max-w-lg mx-auto relative z-10">
          <h2 className="text-4xl font-bold mb-12">
            Over 1,75,324 candidates waiting for good employees.
          </h2>

          <div className="grid grid-cols-3 gap-8">
            <div>
              <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                <img src={briefcase} alt="Live Job" className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold mb-1">1,75,324</div>
              <div className="text-gray-400">Live Job</div>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                <img src={briefcase} alt="Companies" className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold mb-1">97,354</div>
              <div className="text-gray-400">Companies</div>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                <img src={briefcase} alt="New Jobs" className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold mb-1">7,532</div>
              <div className="text-gray-400">New Jobs</div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default LoginInfo;
