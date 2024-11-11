import axios from "axios";
import { useParams } from "react-router-dom";

function TrackAwb() {
  const { awbnumber } = useParams();

  // Access environment variables using import.meta.env
  const { 
    VITE_UserID, 
    VITE_Password, 
    VITE_Type 
  } = import.meta.env;
                                                       
  // Use awbnumber from useParams directly in the API payload
  const result = axios.post(
    "http://worldfirst.xpresion.in/api/v1/Tracking/Tracking",
    {
      UserID: VITE_UserID,
      Password: VITE_Password,
      AWBNo: awbnumber, // Assuming awbnumber is what you want to track
      Type: VITE_Type,
    },
    {
      headers: {
        "Content-Type": "application/json", // Set the header to application/json
      },
    }
  );

  // Handle the response
  result
    .then((response) => {
      console.log(response.data); // Log the data received from the API
    })
    .catch((error) => {
      console.error("Error fetching tracking data:", error);
    });

  return <div>{awbnumber}</div>;
}

export default TrackAwb;