import { Link } from "react-router-dom"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { briefcase } from "../../assets/assets"

const Footer = () => {
    return (
        <div className="bg-[#18191C] text-white px-4 py-12">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Column 1: Logo and Contact */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <img
                                src={briefcase}
                                alt="logo"
                                width={24}
                                height={24}
                                className="w-auto h-auto"
                            />
                            <h5 className="text-xl font-bold">
                                Career Connect
                            </h5>
                        </Link>
                        <p className="text-md mb-2 text-[#767F8C]">Call now: <span className="font-bold text-white">(319) 555-0115</span></p>
                        <p className="text-[14px] text-[#767F8C]">
                            6391 Elgin St. Celina, Delaware 10299, New York,<br/>
                            United States of America
                        </p>
                    </div>

                    {/* Column 2: Quick Link */}
                    <div>
                        <h6 className="text-base font-semibold mb-4">Quick Link</h6>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/about" className="text-[#9199A3] hover:text-white transition-colors">About</Link></li>
                            <li>
                                <Link to="/contact" className="flex items-center text-[#9199A3] hover:text-white transition-colors">
                                    <svg className="w-3 h-3 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Contact
                                </Link>
                            </li>
                            <li><Link to="/pricing" className="text-[#9199A3] hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link to="/blog" className="text-[#9199A3] hover:text-white transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Candidate */}
                    {/* <div>
                        <h6 className="text-base font-semibold mb-4">Candidate</h6>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Browse Jobs</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Browse Employers</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Candidate Dashboard</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Saved Jobs</a></li>
                        </ul>
                    </div> */}

                    {/* Column 4: Employers */}
                    <div>
                        <h6 className="text-base font-semibold mb-4">Employers</h6>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/post-job" className="text-[#9199A3] hover:text-white transition-colors">Post a Job</Link></li>
                            <li><Link to="/browse-candidates" className="text-[#9199A3] hover:text-white transition-colors">Browse Candidates</Link></li>
                            <li><Link to="/employer-dashboard" className="text-[#9199A3] hover:text-white transition-colors">Employers Dashboard</Link></li>
                            <li><Link to="/applications" className="text-[#9199A3] hover:text-white transition-colors">Applications</Link></li>
                        </ul>
                    </div>

                    {/* Column 5: Support */}
                    <div>
                        <h6 className="text-base font-semibold mb-4">Support</h6>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/faqs" className="text-[#9199A3] hover:text-white transition-colors">Faqs</Link></li>
                            <li><Link to="/privacy-policy" className="text-[#9199A3] hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms-conditions" className="text-[#9199A3] hover:text-white transition-colors">Terms & Conditions</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom copyright and social */}
                <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-xs text-gray-400 mb-4 md:mb-0">© 2025 Career Connect - Job Portal. All rights Reserved</p>
                    
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            <Facebook size={16} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            <Instagram size={16} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            <Linkedin size={16} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            <Twitter size={16} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;
