import { useEffect, useState } from "react";
import candidateappliedjobService from "../../services/candidateappliedjob-service";
import { Job } from "../../utility/interface/IJobResponse";
import Layout from "../../components/LoggedInlayout/LoggedInLayout";
import Pagination from "../../components/custom/Pagination";
import JobTable from "../Dashboard/AppliedJobTable";

const CandidateAppliedJobs = () => {
  const [count, setCount] = useState<number>(0);
  const [jobData, setJobData] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<string>("10");
  const totalPages = Math.ceil(count / Number(limit));

  const getCandidateAppliedJobs = async () => {
    try {
      setLoading(true);
      const response =
        await candidateappliedjobService.getCandidateAppliedJobsData(
          page,
          Number(limit)
        );
      setCount(response?.data?.pagination?.total);
      setJobData(response?.data?.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPage(page);
    }
  };

  useEffect(() => {
    getCandidateAppliedJobs();
  }, [page, limit]);
  return (
    <Layout>
      <div className="sm:px-4 sm:py-2">
        <div className="flex justify-between items-center mt-4">
          <span className="text-black text-md sm:text-xl md:text-2xl">
            Recently Applied
          </span>
        </div>
        <div className="overflow-x-auto w-full mt-4">
          <JobTable loading={loading} jobData={jobData} />
        </div>
        {jobData.length > 0 && (
          <div className="flex justify-center items-center gap-2 pt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CandidateAppliedJobs;
