import { useState, useEffect } from "react";

function TrackingDetailsChild({ data }) {
  const imageStyle = { width: 18 };
  const imageHeight = "h-16";
  const initialDataSet = [
    { status: "Run sheet", dateTime: "11/11/2024, 9:06 A.M.", progress: false },
    {
      status: "INCOMING MANIFEST",
      dateTime: "11/11/2024, 9:06 A.M.",
      progress: data.pickupCompletedDatatime,
    },
    {
      status: "PAYMENT PENDING",
      dateTime: data.pickupCompletedDatatime,
      progress: false,
    },
    {
      status: "PAYMENT DONE",
      dateTime: data.pickupCompletedDatatime,
      progress: false,
    },
    {
      status: "SHIPMENT CONNECTED",
      dateTime: data.packageConnectedDataTime,
      progress: false,
    },
    {
      status: "Departed from Facility",
      dateTime: data.packageConnectedDataTime,
      progress: false,
    },
    {
      status: "Out For Delivery Today",
      dateTime: data.packageConnectedDataTime,
      progress: false,
    },
    {
      status: "Delivered",
      dateTime: data.packageConnectedDataTime,
      progress: false,
    },
  ];

  const [dataSet, setDataSet] = useState(initialDataSet);

  useEffect(() => {
    const updateProgress = (inputStatus) => {
      const updatedDataSet = initialDataSet.map((item, index) => ({
        ...item,
        progress:
          index <=
          initialDataSet.findIndex(
            (d) => d.status.toLowerCase() === inputStatus.toLowerCase()
          ),
      }));
      setDataSet(updatedDataSet);
    };

    updateProgress(data.status);
  }, [data.status, initialDataSet]);

  return (
    <div className="flex gap-8 justify-center min-h-screen bg-gray-100 py-8">
      <div className="flex h-fit">
        <div className="relative">
          <div className="flex flex-col items-center relative">
            {dataSet.map((d, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center relative z-10 ${
                  d.enable ? "" : imageHeight
                }`}
              >
                <img
                  style={imageStyle}
                  src={
                    d.progress
                      ? "green-checkmark-icon.svg"
                      : "pending-clock-icon.svg"
                  }
                  alt="Status icon"
                />
                {idx < dataSet.length - 1 && (
                  <div
                    className={`w-px h-full bg-${
                      d.progress ? "green-500" : "gray-300"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative grid grid-cols-1 h-fit">
        {dataSet.map((d, idx) => (
          <div key={idx} className={`flex flex-col z-10 ${imageHeight}`}>
            <p className="text-sm font-semibold text-gray-800">{d.status}</p>
            <p className="text-xs text-gray-600">{d.dateTime}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrackingDetailsChild;
