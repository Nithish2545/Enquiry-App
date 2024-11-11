import { useEffect, useState } from "react";
import Nav from "./Nav";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import collectionName_BaseAwb from "./functions/collectionName";

function Pickups() {
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState("");
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [awbSearchTerm, setAwbSearchTerm] = useState("");
  const [dateSearchTerm, setDateSearchTerm] = useState("");
  const [consignorPhoneSearchTerm, setConsignorPhoneSearchTerm] = useState("");
  const [PickupPersonName, setPickUpPersonName] = useState("");
  const [Location, setLocation] = useState("ALL");
  // Fetch user info from localStorage

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("LoginCredentials"));
    console.log(JSON.parse(localStorage.getItem("LoginCredentials")));
    setUsername(storedUser?.name);
    setRole(storedUser.role);
  }, []);

  const parsePickupDateTime = (dateTimeString) => {
    const [datePart, timePart] = dateTimeString
      .split("&")
      .map((str) => str.trim()); // Split and trim date and time
    const [day, month] = datePart.split("-").map(Number); // Extract day and month as numbers
    const currentYear = new Date().getFullYear(); // Assume the current year
    let [hour, period] = timePart.split(" "); // Split hour and period (AM/PM)
    hour = parseInt(hour, 10); // Convert hour to number
    // Convert hour to 24-hour format if it's PM
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0; // Handle midnight case
    return new Date(currentYear, month - 1, day, hour, 0, 0); // Create Date object
  };

  // Fetch pickup data from Firestore and filter based on the username

  useEffect(() => {
    if (Location == "ALL") {
      if (username) {
        const fetchData = () => {
          try {
            const collectionNames = [
              "pickup",
              "franchise_pondy",
              "franchise_coimbatore",
            ];
            // Create an array of queries for each collection
            const queries = collectionNames.map((collec) =>
              query(collection(db, collec))
            );
            // Use Promise.all to fetch data from all queries
            const unsubscribes = [];
            Promise.all(
              queries.map(
                (q) =>
                  new Promise((resolve) => {
                    const unsubscribe = onSnapshot(q, (snapshot) => {
                      const data = snapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                      }));
                      console.log(data);
                      resolve(data);
                    });
                    unsubscribes.push(unsubscribe);
                  })
              )
            )
              .then((results) => {
                // Combine results from all collections
                const combinedData = results.flat();
                // Sort the combined data by date and time
                const sortedData = combinedData.sort((a, b) => {
                  const dateTimeA = parsePickupDateTime(a.pickupDatetime);
                  const dateTimeB = parsePickupDateTime(b.pickupDatetime);
                  return dateTimeA - dateTimeB;
                });
                setPickups(sortedData);
                setLoading(false);
              })
              .catch((error) => {
                setError("Failed to fetch data: " + error.message);
                setLoading(false);
              });
            // Cleanup subscription on unmount
            return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
          } catch (error) {
            setError("Failed to fetch data: " + error.message);
            setLoading(false);
          }
        };

        fetchData();
      }
    } else {
      const fetchData = () => {
        try {
          const q = query(
            collection(
              db,
              collectionName_BaseAwb.getCollection(
                Location == "HQ CHENNAI" ? "CHENNAI" : Location
              )
            )
          ); // Fetch all pickups for sales admin
          // Fetch only user's pickups

          const unsubscribe = onSnapshot(q, (snapshot) => {
            const filteredData = snapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            // Sort data by date and time
            const sortedData = filteredData.sort((a, b) => {
              const dateTimeA = parsePickupDateTime(a.pickupDatetime);
              const dateTimeB = parsePickupDateTime(b.pickupDatetime);
              return dateTimeA - dateTimeB;
            });

            setPickups(sortedData);
            setLoading(false);
          });

          // Cleanup subscription on unmount
          return () => unsubscribe();
        } catch (error) {
          setError("Failed to fetch data: " + error.message);
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [username, role, Location]);

  // Filter pickups based on search terms
  const filteredPickups = pickups.filter((pickup) => {
    const awbMatch = String(pickup.awbNumber)
      .toLowerCase()
      .includes(awbSearchTerm.toLowerCase());
    const dateMatch = pickup.pickupDatetime
      .split("&")[0]
      .startsWith(dateSearchTerm); // Check if the date starts with the input
    const consignorPhoneMatch = pickup.consignorphonenumber
      .toLowerCase()
      .includes(consignorPhoneSearchTerm.toLowerCase());
    const PhonesearchItem = pickup.pickUpPersonName
      .toLowerCase()
      .includes(PickupPersonName.toLowerCase());

    return awbMatch && dateMatch && consignorPhoneMatch && PhonesearchItem; // Use AND logic to filter
  });

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  function capitalizeFirstLetter(string) {
    return [...string][0].toUpperCase() + [...string].slice(1).join("");
  }

  return (
    <>
      <Nav />
      <div className="container mx-auto p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-purple-700">
          {role !== "sales admin" ? (
            <>{Location} SHIPMENTS</>
          ) : (
            "All Booked Pickups"
          )}
        </h1>
        <select
          value={Location}
          onChange={(e) => setLocation(e.target.value)}
          className="border w-fit mb-6 border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
        >
          <option value="ALL">ALL</option>
          <option value="HQ CHENNAI">HQ CHENNAI</option>
          <option value="PONDY">PONDY</option>
          <option value="COIMBATORE">COIMBATORE</option>
        </select>
        {/* Search Inputs */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by AWB Number"
            value={awbSearchTerm}
            onChange={(e) => setAwbSearchTerm(e.target.value)}
            className="border border-gray-300 rounded py-2 px-4 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="date"
            placeholder="Search by Date (YYYY-MM-DD)"
            onChange={(e) => {
              const dateValue = e.target.value; // e.g., "2024-10-07"
              const [year, month, day] = dateValue.split("-");
              const result = `${parseInt(day)}-${parseInt(month)}`;
              setDateSearchTerm(result);
            }}
            className="border border-gray-300 rounded py-2 px-4 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="text"
            placeholder="Search by Consignor Phone Number"
            value={consignorPhoneSearchTerm}
            onChange={(e) => setConsignorPhoneSearchTerm(e.target.value)}
            className="border border-gray-300 rounded py-2 px-4 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="text"
            placeholder="Search by Pickup Person"
            value={PickupPersonName}
            onChange={(e) => setPickUpPersonName(e.target.value)}
            className="border border-gray-300 rounded py-2 px-4 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        {/* <h1 className="text-2xl font-bold mb-6 text-purple-700">
          {Location}
        </h1> */}
        {/* Scrollable Table Wrapper */}
        <div className="overflow-auto border scrollbar-hide">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow overflow-hidden">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="py-3 px-4 border">AWB Number</th>
                <th className="py-3 px-4 border">Consignor Name</th>
                <th className="py-3 px-4 border">Consignor Phone</th>
                <th className="py-3 px-4 border">Destination</th>
                <th className="py-3 px-4 border">Weight (Apx)</th>
                <th className="py-3 px-4 border">Vendor</th>
                <th className="py-3 px-4 border">Pickup Area</th>
                <th className="py-3 px-4  border">Pickup Date & Time</th>
                <th className="py-3 px-4  border">
                  Pickup Completed Date & Time
                </th>
                <th className="py-3 px-4  border">
                  Payment Comfirmed Date & Time
                </th>
                <th className="py-3 px-4  border">
                  Package Connected Data & Time
                </th>
                <th className="py-3 px-4 border">Status</th>
                <th className="py-3 px-4 border"> Pickup Booked by</th>
                <th className="py-3 px-4 border">PickUp Person</th>
              </tr>
            </thead>
            <tbody>
              {filteredPickups.length > 0 ? (
                filteredPickups.map((pickup) => (
                  <tr key={pickup.id}>
                    <td className="py-10 px-4 border">{pickup.awbNumber}</td>
                    <td className="py-10 px-4 border">
                      {pickup.consignorname}
                    </td>
                    <td className="py-10 px-4 border">
                      {pickup.consignorphonenumber}
                    </td>
                    <td className="py-10 px-4 border">{pickup.destination}</td>
                    <td className="py-10 px-4 border">{pickup.weightapx}</td>
                    <td className="py-10 px-4 border">{pickup.vendorName}</td>
                    <td className="py-10 px-4 border">{pickup.pickuparea}</td>
                    <td className="py-10 px-4 border text-nowrap">
                      {pickup.pickupDatetime}
                    </td>
                    <td className="py-10 px-4 border text-nowrap">
                      {pickup.pickupCompletedDatatime
                        ? pickup.pickupCompletedDatatime
                        : "NA"}
                    </td>
                    {typeof pickup.PaymentComfirmedDate == "object" ? (
                      <td className="py-10 px-4 border text-nowrap">
                        {new Date(
                          pickup.PaymentComfirmedDate.seconds * 1000
                        ).toLocaleString()}
                      </td>
                    ) : pickup.PaymentComfirmedDate === undefined ? (
                      <td className="py-10 px-4 border text-nowrap">NA</td>
                    ) : (
                      <td className="py-10 px-4 border text-nowrap">
                        {pickup.PaymentComfirmedDate}{" "}
                      </td>
                    )}
                    <td className="py-10 px-4 border text-nowrap">
                      {pickup.packageConnectedDataTime
                        ? pickup.packageConnectedDataTime
                        : "NA"}
                    </td>
                    <td className="py-10 px-4 border text-nowrap">
                      {pickup.status}
                    </td>
                    <td className="py-10 px-4 border">
                      {pickup.pickupBookedBy}
                    </td>
                    <td className="py-10 px-4 border">
                      {pickup.pickUpPersonName}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-4 font-semibold text-gray-600"
                  >
                    No pickups found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Pickups;