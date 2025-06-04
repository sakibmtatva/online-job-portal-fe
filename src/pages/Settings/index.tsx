import Layout from "../../components/LoggedInlayout/LoggedInLayout";
import CandidateProfile from "./CandidateProfile";
import EmployerProfile from "./EmployerProfile";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Settings = () => {
  const role = useSelector(
    (state: RootState) => state.auth.currentUser?.user_type ?? "Candidate"
  );

  return (
    <Layout>
      {role === "Candidate" ? <CandidateProfile /> : <EmployerProfile />}
    </Layout>
  );
};

export default Settings;
