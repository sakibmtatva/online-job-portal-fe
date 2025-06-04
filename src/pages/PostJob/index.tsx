import Layout from "../../components/LoggedInlayout/LoggedInLayout";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PostJobForm from "./PostJobForm";
import { UI_TEXT } from "../../config/config";

const PostJob = () => {
  const role = useSelector(
    (state: RootState) => state.auth.currentUser?.user_type || "Candidate"
  );

  return (
    <Layout>
      {role === "Employer" ? (
        <PostJobForm jobData={null} jobId={null} />
      ) : (
        <div className="text-center text-red-500 font-medium">
          {UI_TEXT.notAuthorizedToPerform}
        </div>
      )}
    </Layout>
  );
};

export default PostJob;
