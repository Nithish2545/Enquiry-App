import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiURL from "./apiURL";
import axios from "axios";
import DateTimePicker from "react-datetime-picker"; // Import DateTimePicker

function CancelCard({ item, index }) {
  const navigate = useNavigate();
  const API_URL = apiURL.SHEETYAPI;
  const [details, setDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedDate, setSelectedDate] = useState(); // DateTime state
  const [selectedTime, setSelectedTime] = useState(""); // DateTime state

  // Handle reschedule click
  const handleAcceptClick = async (awbNumber) => {
   
    // pickupDatetime
    const body = {
      sheet1: {
        pickupDatetime: selectedDate + " " + selectedTime,
      },
    };

    const response = await fetch(
      `${"https://api.sheety.co/c8e5c72713f88a4dc0f9689d459ff4b6/pickupdata/sheet1"}/${item.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const json = await response.json();
    console.log(json.sheet1);
    setIsModalOpen(false); // Close the modal after submission
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await axios.get(API_URL);
        const userDetails = result.data.sheet1;
        setDetails(userDetails);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetails();
  }, [API_URL]);

  const openModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div
      key={index}
      className="flex flex-col border border-gray-300 rounded-lg p-6 bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="flex flex-col mb-4 gap-2">
        {item.consignorname && (
          <p className="text-base font-medium text-gray-800">
            <strong className="text-gray-900">Name:</strong>{" "}
            {item.consignorname}
          </p>
        )}
        <p className="text-base font-medium text-gray-800">
          <strong className="text-gray-900">Shiphit AWB Number:</strong>{" "}
          {item.awbNumber || "-"}
        </p>
      </div>

      <div className="flex flex-col mb-4 gap-2">
        {item.consignorphonenumber && (
          <p className="text-base font-medium text-gray-800">
            <strong className="text-gray-900">Phone Number:</strong>{" "}
            {item.consignorphonenumber}
          </p>
        )}
        {item.destination && (
          <p className="text-base font-medium text-gray-800">
            <strong className="text-gray-900">Destination:</strong>{" "}
            {item.destination}
          </p>
        )}
      </div>

      <div className="flex flex-col mb-4 gap-2">
        <p className="text-base font-medium text-gray-800">
          <strong className="text-gray-900">Final Weight:</strong>{" "}
          {item.actualWeight + " KG" || "-"}
        </p>
      </div>

      <div className="flex flex-col mb-4 gap-2">
        <p className="text-base font-medium text-gray-800">
          <strong className="text-gray-900">PickUp Person Name:</strong>{" "}
          {item.pickUpPersonName || "-"}
        </p>
        <p className="text-base font-medium text-gray-800">
          <strong className="text-gray-900">Pickup Completed DateTime:</strong>{" "}
          {item.pickupCompletedDatatime || "-"}
        </p>
        {item.rtoIfAny && (
          <p className="text-base font-medium text-red-600">
            <strong className="text-gray-900">RTO Information:</strong>{" "}
            {item.rtoIfAny}
          </p>
        )}
      </div>

      {item.status && (
        <div className="flex items-center gap-2 mb-4">
          <p className="text-base font-medium text-gray-800">
            <strong className="text-gray-900">Status:</strong>
          </p>
          <p
            className={`rounded-full py-1 px-3 text-sm font-semibold text-center ${
              item.status === "PAYMENT DONE" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {item.status}
          </p>
        </div>
      )}

      <div className="flex justify-end mt-auto">
        <button
          onClick={openModal} // Open modal on click
          className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 active:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors text-sm"
        >
          Reschedule
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Reschedule Booking
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 focus:outline-none"
              >
                &#x2715;
              </button>
            </div>

            {/* Friendly Prompt */}
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to{" "}
              <strong className="text-purple-600">Reschedule</strong> the
              booking for{" "}
              <strong className="text-purple-600">
                AWB Number {item.awbNumber}
              </strong>
              ? Please select the new date and time below.
            </p>

            {/* Current Pickup Date and Time */}
            <p className="text-sm text-gray-600 mb-4">
              <strong className="text-gray-800">
                Current Pickup Date and Time:
              </strong>{" "}
              {new Date(item.pickupDatetime).toLocaleString()}
            </p>

            {/* Date Picker */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select New Date:
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {/* Time Picker */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select New Time:
              </label>
              <input
                type="time"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 active:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAcceptClick(item.awbNumber)}
                className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 active:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors"
              >
                Submit Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CancelCard;