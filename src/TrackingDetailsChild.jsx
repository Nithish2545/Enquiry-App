import axios from "axios";
import { useState, useEffect } from "react";
import Nav from "./Nav";

function TrackingDetailsChild({ data }) {
  const imageStyle = { width: 18 };
  const imageHeight = "h-20";

  const initialDataSet = [
    {
      status: "Run sheet",
      dateTime: data.pickupDatetime,
      progress: false,
      Location: "Chennai",
    },
    {
      status: "INCOMING MANIFEST",
      dateTime: data.pickupCompletedDatatime,
      Location: "Chennai",
      progress: false,
    },
    {
      status: "PAYMENT PENDING",
      dateTime: "01/11/2024, 9:06 A.M.",
      Location: "Chennai",
      progress: false,
    },
    {
      status: "PAYMENT DONE",
      dateTime: data.PaymentComfirmedDate,
      Location: "Chennai",
      progress: false,
    },
    {
      status: "SHIPMENT CONNECTED",
      dateTime: data.packageConnectedDataTime,
      Location: "Chennai",
      progress: false,
    },
  ];

  const postData = {
    UserID: import.meta.env.VITE_USER_ID,
    AWBNo: data.vendorAwbnumber,
    Password: import.meta.env.VITE_PASSWORD,
    Type: import.meta.env.VITE_TYPE,
  };

  const [dataSet, setDataSet] = useState(initialDataSet);
  const [addedStatuses, setAddedStatuses] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [FoundText, showNotFoundText] = useState(false);
  console.log(dataSet);
  useEffect(() => {
    const shipmentconnected = dataSet.find(
      (d) => d.status == "SHIPMENT CONNECTED"
    );
    const fetchTrackingData = async () => {
      if (shipmentconnected.progress && data.vendorName == "UPS") {
        try {
          const response = await axios.post(
            "http://worldfirst.xpresion.in/api/v1/Tracking/Tracking",
            postData
          );
          const events = response.data.Response.Events;
          if (events) {
            const newEvents = events
              .reverse()
              .filter((d) => !addedStatuses.has(d.Status));

            if (newEvents.length > 0) {
              const transformedData = newEvents.map((d) => {
                // Replace "UPS" with "SHIPHIT" in the status message
                const status = d.Status.replace(/UPS/gi, "SHIPHIT");

                return {
                  status: status,
                  dateTime: `${d.EventDate}, ${d.EventTime1}`,
                  Location: d.Location || "",
                  progress: true,
                };
              });

              setDataSet((prev) => [...prev, ...transformedData]);
              setAddedStatuses((prev) => {
                const updated = new Set(prev);
                newEvents.forEach((e) => updated.add(e.Status));
                return updated;
              });
            }
          }
        } catch (error) {
          console.error("Error fetching tracking data:", error);
        } finally {
          setIsLoading(false);
        }
        return;
      }
      if (data.vendorName == "DHL") {
        showNotFoundText(true);
      }
    };
    fetchTrackingData();
  }, [dataSet]);

  const updateProgress = (inputStatus) => {
    console.log("updateProgress!");
    setDataSet((prevData) =>
      prevData.map((item, index) => ({
        ...item,
        progress:
          index <=
          prevData.findIndex(
            (d) => d.status.toLowerCase() === inputStatus.toLowerCase()
          ),
      }))
    );
  };

  useEffect(() => {
    if (data.status) {
      updateProgress(data.status);
    }
  }, [data.status]);

  const lastProgressTrue = (() => {
    for (let i = dataSet.length - 1; i >= 0; i--) {
      if (dataSet[i].progress === true) {
        return dataSet[i];
      }
    }
    return null; // Return null if no item with progress === true is found
  })();

  // Conditionally render loading screen or the actual data
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-t-4 border-gray-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-medium text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-fit h-fit  ml-24 flex flex-col justify-center bg-gray-50 p-6 rounded-lg shadow-md">
      <>
        <div>
          <div className="mb-3">
            <p className="font-normal text-sm text-gray-800">Your shipment</p>
            <p className="font-semibold text-xl text-gray-900">
              {data.awbNumber}
            </p>
          </div>
          <div className="mb-4 flex gap-1 flex-col">
            <p className="text-[18px] font-medium text-green-600 flex gap-2">
              <img src="green-checkmark-icon.svg" className="w-4" alt="" />
              {lastProgressTrue?.status}
              <p className="text-[18px] font-medium text-gray-800">
                {lastProgressTrue?.dateTime}
              </p>
              <p className="text-[18px] font-medium text-gray-600">
                {lastProgressTrue?.Location}
              </p>
            </p>
          </div>
        </div>
        <div className="flex gap-8 py-8">
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
                <p className="text-sm font-semibold text-gray-800">
                  {d.status == "Run sheet" ? "SHIPMENT SCHEDULED" : d.status}
                </p>
                <p className="text-sm text-gray-600">{d.dateTime}</p>
                <p className="text-sm text-gray-600">{d.Location}</p>
              </div>
            ))}
          </div>
        </div>
      </>
      {/* {showNotFoundText ? (
  <div className="bg-red-100 text-red-600 p-4 rounded-lg border border-red-300">
    <p className="font-semibold text-lg">Tracking Not Found</p>
    <p className="mt-2 text-sm">348346823746378</p>
  </div>
) : (
  <div></div>
)} */}
    </div>
  );
}
export default TrackingDetailsChild;
