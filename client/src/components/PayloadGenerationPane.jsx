import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PayloadGenerationPane = () => {
  const notify = () =>
    toast.success("Copied to clipboard!", {
      className: "toast-message",
    });
  return (
    <div className="font-poppins">
      <div className="navbar bg-transparent">
        <h1 className="text-4xl flex-1 font-bold mt-10 ml-10">Listeners</h1>
      </div>
      <div className="flex-none grid-cols-4">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Example Payload</h2>
            <p>To be updated</p>
            <div className="card-actions justify-end">
              <button onClick={notify} className="btn btn-primary">
                Generate
              </button>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayloadGenerationPane;
