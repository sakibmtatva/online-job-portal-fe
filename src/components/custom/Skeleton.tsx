const SkeletonColumn = () => {
  return (
    <div className="my-4 bg-[#F1F2F480] border h-fit border-[#E4E5E8] px-4 py-3 rounded-sm min-w-85 animate-pulse ">
      <div className="flex justify-between items-center mb-4">
        <div className="h-4 w-40 bg-gray-300 rounded"></div>
        <div className="h-4 w-5 bg-gray-300 rounded"></div>
      </div>

      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`border border-[#E4E5E8] bg-white px-4 py-3 my-3 rounded-sm shadow-2xs ${
            i === 3 ? "opacity-50 scale-y-90" : ""
          }`}
        >
          <div className="flex flex-row space-x-5 mb-4">
            <div className="h-12 w-12 rounded-full bg-gray-300"></div>
            <div className="flex flex-col gap-2">
              <div className="h-4 w-32 bg-gray-300 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="h-[1px] bg-gray-200 my-2" />
          <div className="flex flex-col gap-2">
            <div className="h-3 w-40 bg-gray-200 rounded"></div>
            <div className="h-3 w-52 bg-gray-200 rounded"></div>
            <div className="h-3 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="h-4 w-28 mt-3 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonColumn;
