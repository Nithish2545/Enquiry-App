import { useState, useEffect } from "react";
import apiURL from "./apiURL";
import Nav from "./Nav";
import ResheduleCard from "./ResheduleCard"
import CancelCard from "./CancelCard"
function CancelOrReschedule() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("CANCEL");

  useEffect(() => {
    const url = apiURL.CHENNAI;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        setData(json.sheet1);
      });
  }, []);

  // Filter data based on the active tab
  const filteredData = data.filter(item =>
    activeTab === "CANCEL" ?   data  : activeTab === "RESCHEDULE" ? data :  null
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      <div className="max-w-screen-xl mx-auto p-5">
        <div className="flex justify-center space-x-4 mt-5">
          <button
            className={`py-2 px-4 rounded-lg font-semibold ${
              activeTab === "CANCEL"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setActiveTab("CANCEL")}
          >
            Cancel Booking
          </button>
          <button
            className={`py-2 px-4 rounded-lg font-semibold ${
              activeTab === "RESCHEDULE"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setActiveTab("RESCHEDULE")}
          >
            Reschedule Booking
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-10">
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-64 bg-white rounded-lg shadow-md">
              <p className="text-lg font-semibold text-gray-600">No records found</p>
              <p className="text-sm text-gray-400">There are no records to display for the selected status.</p>
            </div>
          ) : 

          activeTab === "CANCEL"?
            filteredData.map((item, index) => (
              <CancelCard  key={index} item={item} index={index} />
            ))
            :
            filteredData.map((item, index) => (
              <ResheduleCard  key={index} item={item} index={index} />
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default CancelOrReschedule;
