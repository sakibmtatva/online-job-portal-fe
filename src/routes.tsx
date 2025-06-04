import React, { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

import Layout from "./components/Layout";
import MeetingRoom from "./pages/MeetingRoom";

// Lazy load all route components
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Settings = React.lazy(() => import("./pages/Settings"));
const PostJob = React.lazy(() => import("./pages/PostJob"));
const EmployerListing = React.lazy(
  () => import("./pages/Listing/EmployerListing")
);
const CandidateListing = React.lazy(
  () => import("./pages/Listing/CandidateListing")
);
const MyJobs = React.lazy(() => import("./pages/EmployerJobListing"));
const FindJobs = React.lazy(() => import("./pages/FindJobs"));
const JobDetails = React.lazy(() => import("./pages/FindJobs/JobDetails"));
const VerifyEmail = React.lazy(() => import("./pages/Auth/VerifyEmail"));
const ForgotPassword = React.lazy(
  () => import("./pages/Auth/OtpGenreratePassword")
);
const VerifyOtp = React.lazy(() => import("./pages/Auth/VerifyOtp"));
const ResetPassword = React.lazy(() => import("./pages/Auth/ResetPassword"));
const EmployerJobs = React.lazy(() => import("./pages/EmployerJobs"));
const ViewApplications = React.lazy(
  () => import("./pages/EmployerJobListing/ViewApplications")
);
const CandidateAppliedJobs = React.lazy(
  () => import("./pages/CandidateAppliedJobs")
);
const CandidateBookmarkedJobs = React.lazy(
  () => import("./pages/CandidateBookmarkedJobs")
);
const BookmarkedCandidates = React.lazy(
  () => import("./pages/BookmarkedCandidates")
);
const ScheduledMeetings = React.lazy(() => import("./pages/ScheduledMeetings"));
const JobApplication = React.lazy(
  () => import("./pages/JobApplication/JobApplication")
);
const ContactPage = React.lazy(() => import("./pages/FooterPages/ContactUs"));

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
    <div className="text-2xl font-semibold text-gray-700 mb-6 animate-pulse">
      Hold tight!
    </div>
    <div className="flex items-center space-x-2">
      <span className="h-3 w-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="h-3 w-3 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
      <span className="h-3 w-3 bg-purple-500 rounded-full animate-bounce"></span>
    </div>
    <div className="mt-6 text-4xl animate-wiggle-slow">🚀</div>
  </div>
);

export default LoadingFallback;

const ProtectedRoute = React.memo(
  ({ element }: { element: React.ReactElement }) => {
    const token = useSelector((state: RootState) => state.auth.token);
    return token ? element : <Navigate to="/signin" />;
  }
);

const AuthRoute = React.memo(({ element }: { element: React.ReactElement }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  return !token ? element : <Navigate to="/dashboard" />;
});

// Wrap lazy loaded components with Suspense
const withSuspense = (
  Component: React.LazyExoticComponent<() => React.ReactElement>
) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: withSuspense(LandingPage),
      },
      {
        path: "/signin",
        element: <AuthRoute element={withSuspense(Login)} />,
      },
      {
        path: "/register",
        element: <AuthRoute element={withSuspense(Register)} />,
      },
      {
        path: "/jobs",
        element: withSuspense(FindJobs),
      },
      {
        path: "/jobdetails/:jobId",
        element: (
          <ProtectedRoute
            element={
              <Suspense fallback={<LoadingFallback />}>
                <JobDetails />
              </Suspense>
            }
          />
        ),
      },
      {
        path: "/viewapplications/:jobId",
        element: (
          <ProtectedRoute
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ViewApplications />
              </Suspense>
            }
          />
        ),
      },
      {
        path: "/appliedjobs",
        element: (
          <ProtectedRoute element={withSuspense(CandidateAppliedJobs)} />
        ),
      },
      {
        path: "/bookmarkedjobs",
        element: (
          <ProtectedRoute element={withSuspense(CandidateBookmarkedJobs)} />
        ),
      },
      {
        path: "/bookmarkedCandidates",
        element: (
          <ProtectedRoute element={withSuspense(BookmarkedCandidates)} />
        ),
      },
      {
        path: "/meetings",
        element: <ProtectedRoute element={withSuspense(ScheduledMeetings)} />,
      },
      {
        path: "/meeting/:meetingId",
        element: <ProtectedRoute element={<MeetingRoom />} />,
      },
      {
        path: "/employers/:employerId/jobs",
        element: <EmployerJobs />,
      },
      {
        path: "/dashboard",
        element: <ProtectedRoute element={withSuspense(Dashboard)} />,
      },
      {
        path: "/settings",
        element: <ProtectedRoute element={withSuspense(Settings)} />,
      },
      {
        path: "/postjob",
        element: <ProtectedRoute element={withSuspense(PostJob)} />,
      },
      {
        path: "/employerListing",
        element: withSuspense(EmployerListing),
      },
      {
        path: "/candidateListing",
        element: withSuspense(CandidateListing),
      },
      {
        path: "/myjobs",
        element: <ProtectedRoute element={withSuspense(MyJobs)} />,
      },
      {
        path: "/jobApplication/:jobId",
        element: <ProtectedRoute element={withSuspense(JobApplication)} />,
      },
      {
        path: "/verify-email",
        element: <AuthRoute element={withSuspense(VerifyEmail)} />,
      },
      {
        path: "/forgot-password",
        element: <AuthRoute element={withSuspense(ForgotPassword)} />,
      },
      {
        path: "/verify-otp",
        element: <AuthRoute element={withSuspense(VerifyOtp)} />,
      },
      {
        path: "/reset-password",
        element: <AuthRoute element={withSuspense(ResetPassword)} />,
      },
      {
        path: "/contact",
        element: withSuspense(ContactPage),
      },
      {
        path: "*",
        element: withSuspense(NotFound),
      },
    ],
  },
]);
