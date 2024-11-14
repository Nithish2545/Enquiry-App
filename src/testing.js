import axios from "axios";
import { useState, useEffect } from "react";

function TrackingDetailsChild({ data }) {
  const imageStyle = { width: 18 };
  const imageHeight = "h-20";

  const initialDataSet = [
    {
      status: "Run sheet",
      dateTime: "01/11/2024, 9:06 A.M.",
      progress: false,
      Location: "Chennai",
    },
    {
      status: "INCOMING MANIFEST",
      dateTime: "01/11/2024, 9:06 A.M.",
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
      dateTime: "01/11/2024, 9:06 A.M.",
      Location: "Chennai",
      progress: false,
    },
    {
      status: "SHIPMENT CONNECTED",
      dateTime: "01/11/2024, 9:06 A.M.",
      Location: "Chennai",
      progress: false,
    },
  ];

  const postData = {
    UserID: import.meta.env.VITE_USER_ID,
    AWBNo: "1ZGX05920432746110",
    Password: import.meta.env.VITE_PASSWORD,
    Type: import.meta.env.VITE_TYPE,
  };

  const [dataSet, setDataSet] = useState(initialDataSet);

  const updateProgress = (inputStatus) => {
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
    const fetchTrackingData = async () => {
      try {
        const response = await axios.post(
          "http://worldfirst.xpresion.in/api/v1/Tracking/Tracking",
          postData
        );
        const events = response.data.Response.Events;
        console.log(events);
  
        // Set the fetched Events data directly to dataSet
        setDataSet(events);
      } catch (error) {
        console.error("Error fetching tracking data:", error);
      }
    };
  
    fetchTrackingData();
  }, [data.status]);
  

  const lastProgressTrue = dataSet
    .slice()
    .reverse()
    .find((item) => item.progress);

  return (
    <div className="w-fit h-full items-center ml-24 flex flex-col justify-center">
      <div>
        <div className="mb-3">
          <p className="font-normal text-sm">Your shipment</p>
          <p className="font-semibold">{data.awbNumber}</p>
        </div>
        <div className="mb-4 flex gap-1 flex-col">
          <p className="text-[18px] font-medium text-green-600 flex gap-2">
            <img src="green-checkmark-icon.svg" className="w-4" alt="" />
            {lastProgressTrue?.status}
          </p>
          <p className="text-[18px] font-medium text-green-600">
            {lastProgressTrue?.dateTime}
            {lastProgressTrue?.Location}
          </p>
        </div>
      </div>
      <div className="flex gap-8 min-h-screen py-8">
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
              <p className="text-sm text-gray-600">{d.dateTime}</p>
              <p className="text-sm text-gray-600">{d.Location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default TrackingDetailsChild;
