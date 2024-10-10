import { useNavigate } from "react-router-dom";
import apiURL from "./apiURL";
import { useEffect, useState } from "react";
import axios from "axios";

function CancelCard({ item, index }) {
  const navigate = useNavigate();
  const API_URL = apiURL.CHENNAI;
  const [details, setDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // State for button loading

  const handleAcceptClick = async (awbNumber) => {
    setIsSubmitting(true); // Start loading when submitting
    try {
      const result = await axios.get(API_URL);
      const userDetails = result.data.sheet1;
      const final_result = userDetails.filter(
        (user) => user.awbNumber === awbNumber
      );

      const body = {
        sheet1: {
          ...final_result[0],
          cancelReason: cancelReason,
        },
      };

      const response = await fetch(apiURL.CANCELSHEETYAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const json = await response.json();
      console.log(json.sheet1);

      await axios.delete(`${API_URL}/${final_result[0].id}`);
      console.log("Deleted successfully");
      setIsModalOpen(false); // Close the modal after cancellation
    } catch (error) {
      console.error("Error in canceling booking:", error);
    } finally {
      setIsSubmitting(false); // Stop loading after completion
    }
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

  const handleCancelClick = () => {
    setIsModalOpen(true); // Open the modal when the cancel button is clicked
  };

  const handleCloseModal = () => {
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

      {item.actualWeight != "" ? (
        <div className="flex flex-col mb-4 gap-2">
          <p className="text-base font-medium text-gray-800">
            <strong className="text-gray-900">Final Weight:</strong>{" "}
            {item.actualWeight + " KG" || "-"}
          </p>
        </div>
      ) : (
        <></>
      )}

      <div className="flex flex-col mb-4 gap-2">
        {item.pickUpPersonName != "" ? (
          <p className="text-base font-medium text-gray-800">
            <strong className="text-gray-900">PickUp Person Name:</strong>{" "}
            {item.pickUpPersonName || "-"}
          </p>
        ) : (
          <></>
        )}

        {item.pickupDatetime && (
          <p className="text-base font-medium text-gray-800">
            <strong className="text-gray-900">Pickup Booked At:</strong>{" "}
            {item.pickupDatetime || "-"}
          </p>
        )}
        {item.rtoIfAny && (
          <p className="text-base font-medium text-red-600">
            <strong className="text-gray-900">RTO Information:</strong>{" "}
            {item.rtoIfAny}
          </p>
        )}
        {item.weightapx && (
          <p className="text-base font-medium text-gray-900">
            <strong className="text-gray-900">Apx Weight:</strong>{" "}
            {item.weightapx}
          </p>
        )}
        {item.actualWeight && (
          <p className="text-base font-medium text-gray-900">
            <strong className="text-gray-900">Final weight:</strong>{" "}
            {item.actualWeight}
          </p>
        )}
        {item.vendorName && (
          <p className="text-base font-medium text-gray-900">
            <strong className="text-gray-900">Vendor (Carrier):</strong>{" "}
            {item.vendorName}
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
          onClick={() => handleCancelClick(item.awbNumber)}
          className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 active:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors text-sm"
        >
          Cancel
        </button>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Cancel Booking</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                &#x2715; {/* Close button */}
              </button>
            </div>
            <p className="mb-4">Are you sure you want to cancel the booking?</p>

            {/* Reason Input */}
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Reason for Cancelation:
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
              rows="3"
              placeholder="Provide the reason for cancellation"
            />

            <div className="flex justify-end">
              <button
                onClick={() => handleAcceptClick(item.awbNumber)}
                disabled={isSubmitting} // Disable button while loading
                className={`${
                  isSubmitting ? "bg-purple-300" : "bg-purple-600"
                } text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CancelCard;