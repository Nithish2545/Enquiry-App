import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Track() {
  return (
    <div>
      <AwbTrackingForm />
    </div>
  );
}
export default Track;

function AwbTrackingForm() {
  const [awbTrackingID, setAwbTrackingID] = useState("");
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  //   const trackShipment = async (awbTrackingID) => {
  //     console.log(typeof awbTrackingID)
  //     try {
  //       const response = await axios.post(
  //         "https://awb-tracking-api.onrender.com/awb-tracking-details",
  //         {
  //           TOKEN:"shiphit_f83a1b4076b71e2e2fa77e3c72f73d34f9a60c349dbc708e15fdd98756e72c96",
  //           AWBID: awbTrackingID, // Use the value from the form
  //         }
  //       );
  //       // Store the tracking data in state
  //       setTrackingData(response.data);
  //       // Optionally, store the response data in local storage
  //       localStorage.setItem("awbTrackingData", JSON.stringify(response.data));
  //       setError(null); // Clear any previous error
  //     } catch (error) {
  //       console.error("Error fetching tracking details:", error);
  //       setError("Unable to fetch tracking details. Please check the tracking number and try again.");
  //       setTrackingData(null); // Clear previous data if there's an error
  //     }
  //   };

  const handleSubmit = async () => {
    navigate(`/TrackAwb/${awbTrackingID}`)
    // e.preventDefault();
    // setLoading(true);
    // await trackShipment(awbTrackingID);
    // setLoading(false);
    // setAwbTrackingID(""); // Clear the form after submission
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto p-6 bg-white shadow-md rounded-lg"
      >
        <label className="block text-gray-700 text-sm font-bold mb-2">
          AWB Tracking ID:
          <input
            type="text"
            value={awbTrackingID}
            onChange={(e) => setAwbTrackingID(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8447D6] focus:border-[#8447D6] sm:text-sm"
          />
        </label>
        <button
          type="submit"
          className={`w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#8447D6] hover:bg-[#AC77F2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8447D6] ${
            loading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={loading}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          ) : (
            "Track"
          )}
        </button>
      </form>
      {trackingData && (
        <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-bold text-gray-700">Tracking Details:</h3>
          <pre className="text-sm text-gray-600">
            {JSON.stringify(trackingData, null, 2)}
          </pre>
        </div>
      )}
      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          <h3 className="text-lg font-bold">Error</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
