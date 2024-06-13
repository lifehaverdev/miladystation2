import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/20/solid";

const TxAlert = ({ message, success, onClose }: {message: string, success: boolean, onClose: (value:any)=> void}) => {
    if (!message || message.length == 0) return null;

    return (
        <div className={`rounded-md p-4 ${success ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex">
                <div className="flex-shrink-0" onClick={onClose}>
                    
                {success ? <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" /> : <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />}
                </div>
                <div className="ml-3">
                <h3 className={`text-sm font-medium ${success ? 'text-green-800' : 'text-red-800'}`}>{success ? 'Success' : 'Error'}</h3>
                <div className={`mt-2 text-sm ${success ? 'text-green-700' : 'text-red-700'}`}>
                    <h3>{message}</h3>
                </div>
                </div>
            </div>
        </div>
    );
};

export default TxAlert;