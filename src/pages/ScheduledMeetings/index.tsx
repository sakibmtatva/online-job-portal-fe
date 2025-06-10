import Layout from "../../components/LoggedInlayout/LoggedInLayout";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ScheduledMeetingsListing from "./ScheduleMeetings";
import CandidateMeetings from "./CandidateMeetings";

const ScheduledMeetings = () => {
  const role = useSelector(
    (state: RootState) => state.auth.currentUser?.user_type || "Candidate"
  );

  return (
    <Layout>
      {role === "Employer" ? (
        <ScheduledMeetingsListing />
      ) : (
        <CandidateMeetings />
      )}
    </Layout>
  );
};

export default ScheduledMeetings;
