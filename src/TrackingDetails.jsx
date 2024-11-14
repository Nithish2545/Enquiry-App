import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import TrackingDetailsChild from "./TrackingDetailsChild";
import Nav from "./Nav";

function TrackingDetails() {
  const location = useLocation();
  const { awbNumber } = location.state || {};
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const fetchData = async (collectionName) => {
    try {
      const q = query(
        collection(db, collectionName),
        where("awbNumber", "==", parseInt(awbNumber))
      );
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map((doc) => doc.data());
      setData(fetchedData);
    } catch (e) {
      setError("Failed to fetch data. Please try again.");
    }
  };

  useEffect(() => {
    if (!awbNumber) return;
    if (awbNumber > 3000) {
      fetchData("franchise_coimbatore");
    } else if (awbNumber > 2000) {
      fetchData("franchise_pondy");
    } else if (awbNumber > 1000) {
      fetchData("pickup");
    } else {
      setError("Invalid AWB Number.");
    }
  }, [awbNumber]);

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  console.log(data[0])

  return (
    <>
    <Nav/>
    
    <div className=" flex justify-center">
        <TrackingDetailsChild data={data[0]}  awbNumber ={awbNumber}/>
    </div>
    </>

  );
}

export default TrackingDetails;