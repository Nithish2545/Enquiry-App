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
    {
      status: "Departed from Facility",
      dateTime: "",
      Location: "",
      progress: false,
    },
    {
      status: "Out For Delivery Today",
      dateTime: "",
      Location: "",
      progress: false,
    },
    {
      status: "DELIVERED",
      dateTime: "",
      progress: false,
      Location: "",
    },
  ];

  const postData = {
    UserID: import.meta.env.VITE_USER_ID,
    AWBNo: "1ZGX05920432746110",
    Password: import.meta.env.VITE_PASSWORD,
    Type: import.meta.env.VITE_TYPE,
  };

  const [dataSet, setDataSet] = useState(initialDataSet);
  useEffect(() => {
    const getTrackingDetails = async () => {
      // If the status is "SHIPMENT CONNECTED", skip the API request and just update the dataSet
      if (data.status != "SHIPMENT CONNECTED") {
        setDataSet(initialDataSet);
        return; // Exit the function early to prevent the API call
      }

      // if (console.log(data.vendorName == "UPS")) {
      try {
        const response = await axios.post(
          "http://worldfirst.xpresion.in/api/v1/Tracking/Tracking",
          postData
        );
        const events = response.data.Response.Events;
        console.log(events);
        const out_delivery = events.find(
          (d) => d.Status == "Out For Delivery Today"
        );
        if (out_delivery) {
          initialDataSet.forEach((item) => {
            const updatedDateTime =
              out_delivery.EventDate + " " + out_delivery.EventTime1;
            if (item.status === "Out For Delivery Today") {
              item.dateTime = updatedDateTime;
              item.Location = out_delivery.Location;
            }
          });
          setDataSet(initialDataSet);
        }

        const delivery = events.find((d) => d.Status == "DELIVERED");
        if (delivery) {
          initialDataSet.forEach((item) => {
            const updatedDateTime =
              delivery.EventDate + " " + delivery.EventTime1;
            if (item.status === "DELIVERED") {
              item.dateTime = updatedDateTime;
              item.Location = delivery.Location;
            }
          });
          setDataSet(initialDataSet);
        }

        const Departed = events.find(
          (d) => d.Status == "Departed from Facility"
        );
        if (delivery) {
          initialDataSet.forEach((item) => {
            const updatedDateTime =
              Departed.EventDate + " " + Departed.EventTime1;
            if (item.status === "Departed from Facility") {
              item.dateTime = updatedDateTime;
              item.Location = Departed.Location;
            }
          });
          setDataSet(initialDataSet);
        }

        // Get the latest relevant status from events
        const latestEvent = events.find((event) =>
          [
            "Departed from Facility",
            "Out For Delivery Today",
            "DELIVERED",
          ].includes(event.Status)
        );
        if (latestEvent) {
          updateProgress(latestEvent.Status);
        }
      } catch (error) {
        console.error("Error fetching tracking details:", error);
      }
      // }
    };

    getTrackingDetails();
  }, []); // Runs on mount only.

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
  
  return (
    <div className="w-fit h-full items-center ml-24  flex flex-col justify-center">
      <div>
        <div className="mb-3">
          <p className="font-normal  text-sm">Your shipment</p>
          <p className="font-semibold ">{data.awbNumber}</p>
        </div>
        <div className="mb-4 flex gap-1 flex-col">
          <p className="text-[18px] font-medium text-green-600 flex gap-2">
            <img src="green-checkmark-icon.svg" className="w-4" alt="" />
            {lastProgressTrue?.status}
          </p>
          <p className="text-[18px] font-medium text-green-600 ">
            {lastProgressTrue?.dateTime}
            {lastProgressTrue?.Location}
          </p>
        </div>
      </div>
      <div className="flex gap-8  min-h-screenpy-8">
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
