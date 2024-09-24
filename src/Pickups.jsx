import { useEffect, useState } from "react";
import Nav from "./Nav";

function Pickups() {
  const [username, setUsername] = useState(null);
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [awbSearchTerm, setAwbSearchTerm] = useState("");
  const [dateSearchTerm, setDateSearchTerm] = useState("");
  const [consignorPhoneSearchTerm, setConsignorPhoneSearchTerm] = useState("");

  // Fetch user info from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("enquiryAuthToken"))?.name;
    setUsername(storedUser);
  }, []);

  // Fetch pickup data from the API and filter based on the username
  useEffect(() => {
    if (username) {
      const fetchData = async () => {
        try {
          const response = await fetch("https://api.sheety.co/d8d0c1c371101a10b17498a21b56cf51/pickupdata/sheet1");
          const data = await response.json();

          // Filter the data based on the username
          const filteredData = data.sheet1.filter(
            (pickup) => pickup.pickupBookedBy === username
          );

          setPickups(filteredData);
          setLoading(false);
        } catch (error) {
          setError("Failed to fetch data: " + error.message);
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [username]);

  // Filter pickups based on search terms
  const filteredPickups = pickups.filter((pickup) => {
    const awbMatch = pickup.awbNumber.toLowerCase().includes(awbSearchTerm.toLowerCase());
    const dateMatch = pickup.pickupDatetime.split("&")[0].startsWith(dateSearchTerm); // Check if the date starts with the input
    const consignorPhoneMatch = pickup.consignorphonenumber.toLowerCase().includes(consignorPhoneSearchTerm.toLowerCase());
    return awbMatch && dateMatch && consignorPhoneMatch; // Use AND logic to filter
  });

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <>
      <Nav />
      <div className="container mx-auto p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-purple-700">Pickups Booked by {username}</h1>

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
            value={dateSearchTerm}
            onChange={(e) => setDateSearchTerm(e.target.value)}
            className="border border-gray-300 rounded py-2 px-4 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="text"
            placeholder="Search by Consignor Phone Number"
            value={consignorPhoneSearchTerm}
            onChange={(e) => setConsignorPhoneSearchTerm(e.target.value)}
            className="border border-gray-300 rounded py-2 px-4 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Scrollable Table Wrapper */}
        <div className="overflow-auto border scrollbar-hide">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow overflow-hidden">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="py-3 px-4 border">AWB Number</th>
                <th className="py-3 px-4 border">Consignor Name</th>
                <th className="py-3 px-4 border">Consignor Phone</th>
                <th className="py-3 px-4 border">Consignee Name</th>
                <th className="py-3 px-4 border">Destination</th>
                <th className="py-3 px-4 border">Weight (Apx)</th>
                <th className="py-3 px-4 border">Pickup Date & Time</th>
                <th className="py-3 px-4 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPickups.length > 0 ? (
                filteredPickups.map((pickup) => (
                  <tr key={pickup.awbNumber}>
                    <td className="py-10 px-4 border">{pickup.awbNumber}</td>
                    <td className="py-10 px-4 border">{pickup.consignorname}</td>
                    <td className="py-10 px-4 border">{pickup.consignorphonenumber}</td>
                    <td className="py-10 px-4 border">{pickup.consigneename}</td>
                    <td className="py-10 px-4 border">{pickup.destination}</td>
                    <td className="py-10 px-4 border">{pickup.weightapx} kg</td>
                    <td className="py-10 px-4 border">{pickup.pickupDatetime}</td>
                    <td className="py-10 px-4 border">{pickup.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-4 text-center text-gray-500">No pickups found.</td>
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