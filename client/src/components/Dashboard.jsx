import { useState } from "react";
import ListenersPane from "./ListenersPane";
import ActiveConnectionPane from "./ActiveConnectionPane";
import ConnectedMachinesPane from "./ConnectedMachinesPane";
import PayloadGenerationPane from "./PayloadGenerationPane";
import SettingsPane from "./SettingsPane";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const navigate = useNavigate();
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="navbar font-poppins bg-base-100 outline outline-offset-4 outline-1 outline-stone-800 px-10">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">
            <img src="public/logo.png" width={60} height={20}></img>
          </a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 space-x-4">
            <li>
              <a
                className={activeTab === "overview" ? "active" : ""}
                onClick={() => handleTabClick("overview")}
              >
                Overview
              </a>
            </li>
            <li>
              <a
                className={activeTab === "payloadGeneration" ? "active" : ""}
                onClick={() => handleTabClick("payloadGeneration")}
              >
                Payloads
              </a>
            </li>
          </ul>
        </div>

        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a
                target="_blank"
                href="https://github.com/Icarus131/nexus-framework"
                rel="noreferrer"
              >
                Docs
              </a>
            </li>
            <li>
              <details>
                <summary>User</summary>
                <ul className="p-2 bg-base-100 rounded-t-none">
                  <li>
                    <a
                      className={activeTab === "settings" ? "active" : ""}
                      onClick={() => handleTabClick("settings")}
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <a onClick={() => navigate("/login")}>Logout</a>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>
      {/* Conditional rendering of different panes based on the active tab */}
      {activeTab === "overview" && (
        <div>
          <h1 className="font-poppins text-4xl font-bold mt-10 ml-10">
            Dashboard
          </h1>

          <div className="px-10 mt-5 grid grid-rows-2 grid-flow-col gap-4 h-screen mb-10">
            <div className="card border border-base-300 mt-10">
              <div className="card-body flex justify-self-start px-4 py-16 bg-base-200 rounded-2xl">
                <ConnectedMachinesPane />
              </div>
            </div>
            <div className="card border border-base-300 mt-2">
              <div className="card-body flex justify-self-start px-4 py-16 bg-base-200 rounded-2xl">
                <ListenersPane />
              </div>
            </div>
            <div className="mockup-window card border border-base-300 mt-10 row-span-2">
              <div className="card-body flex justify-center px-4 py-16 bg-base-200 rounded-sm">
                <ActiveConnectionPane />
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === "payloadGeneration" && <PayloadGenerationPane />}
      {activeTab === "settings" && <SettingsPane />}
    </div>
  );
};

export default Dashboard;
