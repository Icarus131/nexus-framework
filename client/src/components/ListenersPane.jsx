import React, { useState } from "react";
import axios from "axios";

const ListenersPane = () => {
  const [port, setPort] = useState("");
  const [error, setError] = useState("");

  const handleAddListener = async () => {
    try {
      // Make a POST request to your backend API to add the listener
      const response = await axios.post("http://localhost:8080/add-listener", {
        port: parseInt(port),
      });
      // Handle success response
      console.log("Listener added successfully:", response.data);
      setError("");
      setPort("");
      document.getElementById("my_modal_5").close();
    } catch (error) {
      // Handle error
      console.error("Error adding listener:", error);
      setError("Failed to add listener. Please try again.");
    }
  };

  const handlePortChange = (e) => {
    setPort(e.target.value);
  };

  return (
    <div className="font-poppins">
      <div className="navbar bg-transparent">
        <h1 className="text-xl flex-1">Listeners</h1>
        <button
          className="btn btn-circle flex-none"
          onClick={() => document.getElementById("my_modal_5").showModal()}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 6C12.5523 6 13 6.44772 13 7V11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H13V17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V13H7C6.44772 13 6 12.5523 6 12C6 11.4477 6.44772 11 7 11H11V7C11 6.44772 11.4477 6 12 6Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5 22C3.34315 22 2 20.6569 2 19V5C2 3.34315 3.34315 2 5 2H19C20.6569 2 22 3.34315 22 5V19C22 20.6569 20.6569 22 19 22H5ZM4 19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V5C20 4.44772 19.5523 4 19 4H5C4.44772 4 4 4.44772 4 5V19Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add Listener</h3>
          <p className="py-4">
            <input
              type="number"
              placeholder="Enter Port Number"
              className="input input-bordered w-full max-w-xs"
              value={port}
              onChange={handlePortChange}
              required
            />
          </p>
          {error && <p className="text-red-500">{error}</p>}
          <div className="modal-action">
            <button className="btn" onClick={handleAddListener}>
              Submit
            </button>
          </div>
        </div>
      </dialog>
      <ul className="menu menu-lg bg-base-200 w-100">
        <li>
          <a>Item 1</a>
        </li>
        <li>
          <a className="active">Item 2</a>
        </li>
      </ul>
    </div>
  );
};

export default ListenersPane;
