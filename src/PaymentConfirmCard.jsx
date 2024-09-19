import { useNavigate } from "react-router-dom";

function PaymentConfirmCard({ item, index }) {
  const navigate = useNavigate();

  const handleAcceptClick = () => {
    const url = `/payment-confirmation-form/${item.awbNumber}`; // Use item.vendorAwbnumber if that's the correct field
    navigate(url);
  };

  return (
    <div
      key={index}
      className="flex flex-col border border-gray-300 rounded-lg p-6 bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="flex flex-col mb-4 gap-2">
        {item.consignorname && (
          <p className="text-base font-medium text-gray-800">
            <strong className="text-gray-900">Name:</strong> {item.consignorname}
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
        {/* <p className="text-base font-medium text-gray-800">
          <strong className="text-gray-900">Package Connected:</strong>{" "}
          {item.packageConnectedDataTime || "-"}
        </p> */}
        <p className="text-base font-medium text-gray-800">
          <strong className="text-gray-900">Final Weight:</strong>{" "}
          {item.actualWeight + " " + "KG" || "-"}
        </p>
      </div>

      <div className="flex flex-col mb-4 gap-2">
        <p className="text-base font-medium text-gray-800">
          <strong className="text-gray-900">PickUp Person Name:</strong>{" "}
          {item.pickUpPersonName || "-"}
        </p>
        <p className="text-base font-medium text-gray-800">
          <strong className="text-gray-900">Package Connected:</strong>{" "}
          {item.packageConnectedDataTime || "-"}
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
              item.status == "PAYMENT DONE" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {item.status}
          </p>
        </div>
      )}
      {item.status == "PAYMENT PENDING" ? (
        <div className="flex justify-end mt-auto">
          <button
            onClick={handleAcceptClick}
            className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 active:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors text-sm"
          >
            Accept
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default PaymentConfirmCard;