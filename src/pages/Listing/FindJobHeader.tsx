import { UI_TEXT } from "../../config/config";

const FindJobHeader = ({ title }: { title: string }) => {
  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <div className="text-sm text-gray-500">
            <span>{UI_TEXT.homeTitle}</span> /{" "}
            <span className="text-gray-800 font-semibold">{title}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindJobHeader;
