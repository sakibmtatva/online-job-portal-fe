import { ReactNode } from "react";
import Sidebar from "../custom/Sidebar";
import Header from "../custom/Header";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const role = useSelector(
    (state: RootState) => state.auth.currentUser?.user_type ?? "Candidate"
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="w-full bg-white">
        <Header />
      </div>
      <div className="w-full border-b border-gray-200"></div>

      <div className="flex flex-row flex-1">
        <Sidebar role={role} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
