import { FC } from "react";

interface ProgressProps {
  progress: number;
}

const Progress: FC<ProgressProps> = ({ progress }) => {
  return (
    <div className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <h4 className="sr-only">Status</h4>
        <p className="text-sm font-medium text-gray-900">Processing Transaction</p>
        <div className="mt-6" aria-hidden="true">
          <div className="overflow-hidden rounded-full bg-gray-200">
            <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-6 flex justify-between text-sm font-medium text-gray-600">
            <div className={`flex-1 text-center ${progress >= 30 ? 'text-indigo-600' : ''}`}>Confirming Transaction</div>
            <div className={`flex-1 text-center ${progress >= 60 ? 'text-indigo-600' : ''}`}>Saving Data</div>
            <div className={`flex-1 text-right ${progress >= 90 ? 'text-indigo-600' : ''}`}>Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
