import { FC, useState, useEffect } from "react";
import { Transition } from '@headlessui/react';
import Progress from "./Progress";

interface StatusProps {
  progress: number;
}

const Status: FC<StatusProps> = ({ progress }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (progress > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [progress]);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className="relative">
      {isVisible && (
        <Transition
          show={isVisible}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <div className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
            <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
              <div className="p-4">
                <h1>Do not leave the page</h1>
              </div>
              <Progress progress={progress} />
              <div className="flex-auto m-5">
                {progress === 100 && (
                  <button
                    onClick={handleClose}
                    className="mt-4 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </Transition>
      )}
    </div>
  );
};

export default Status;
