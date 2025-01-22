import { useState, useEffect } from "react";
import axios from "axios";
import Nav from "./Nav";

const RateCardForm = () => {
  const [country, setCountry] = useState("USA");
  const [weight, setWeight] = useState("");
  const [weights, setWeights] = useState([]);
  const [selectedRate, setSelectedRate] = useState(null);
  const [rateData, setRateData] = useState({});
  const [Zones, setZones] = useState([]);
  const [Instructions, setInstructions] = useState([]);
  const [DeliverDays, setDeliverDays] = useState("");

  const sheets = [
    { name: "USA" },
    { name: "UK" },
    { name: "UAE" },
    { name: "CANADA" },
    { name: "CHINA" },
    { name: "EUROPE" },
    { name: "FRANCE" },
    { name: "HONG KONG" },
    { name: "MALAYSIA" },
    { name: "NEW ZEALAND" },
    { name: "SOUTH AMERICA" },
    { name: "SINGAPORE" },
    { name: "AUSTRALIA" },
    { name: "SAUDI" },
    { name: "MAURITIUS" },
    { name: "PHILIPPINES" },
    { name: "GERMANY" },
    { name: "JAPAN" },
    { name: "SRI LANKA" },
  ];

  const API_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbzV38Uyx2o1hHDG8EQKhIDiG3ciRZWNqxGkZrU01rr8ssfL5QxhC5lzLBTbmf_MExrOWA/exec";

  const fetchData = async () => {
    try {
      const promises = sheets.map((sheet) =>
        axios.get(`${API_ENDPOINT}?sheet=${sheet.name}`)
      );
      const responses = await Promise.all(promises);
      const newRateData = {};
      responses.forEach((response, index) => {
        const sheetName = sheets[index].name;
        const data = response.data.data;
        newRateData[sheetName] = data.map((item) => ({
          Weight_slab: item["Weight_slab(" + sheetName + ")"],
          Economy: item.Economy,
          Express: item.Express,
          EcoDutyFree: item.EcoDutyFree,
          ZONES: item.ZONES,
          INSTRUCTIONS: item.INSTRUCTIONS,
          DAYSTODELIVER: item.DAYSTODELIVER,
          EcoSelf: item.EcoSelf,
        }));
      });

      setRateData(newRateData);
    } catch (error) {
      console.error("Error fetching data from Google Sheets", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (rateData[country]) {
      setWeights(rateData[country].map((item) => item.Weight_slab));
    }
  }, [country, rateData]);

  useEffect(() => {
    if (rateData[country]) {
      const rate = rateData[country].find(
        (item) => item.Weight_slab === weight
      );
      setSelectedRate(rate);
    }
  }, [country, weight, rateData]);

  useEffect(() => {
    let zonesData = [];
    let instructionsData = [];
    rateData[country]?.map((d) => {
      if (d.ZONES) zonesData.push(d.ZONES);
    });
    rateData[country]?.map((d) => {
      if (d.INSTRUCTIONS) instructionsData.push(d.INSTRUCTIONS);
    });
    setZones(zonesData);
    setInstructions(instructionsData);
    if (
      rateData[country] &&
      rateData[country][0] &&
      rateData[country] &&
      rateData[country][0]["DAYSTODELIVER"]
    ) {
      setDeliverDays(rateData[country][0]["DAYSTODELIVER"]);
    } else {
      setDeliverDays("");
    }
  }, [country, rateData]);
  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex flex-col justify-center items-center pt-8 pb-8">
        <div className="w-full max-w-7xl flex flex-wrap  flex-col lg:flex-row justify-center gap-8 px-4">
          {/* Left Section */}
          <div className=" relative w-full lg:w-[40%] bg-white rounded-xl shadow-md p-4 lg:p-6">
            <h2 className="text-2xl lg:text-3xl font-semibold text-purple-700 mb-4">
              Rate Card Form
            </h2>
            <p className="text-green-500 font-bold text-2xl absolute top-4 right-8">
              {DeliverDays}
            </p>
            <form className="space-y-4">
              {/* Country Selector */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm lg:text-base">
                  Select Country:
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  {sheets.map((sheet) => (
                    <option key={sheet.name} value={sheet.name}>
                      {sheet.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Weight Selector */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm lg:text-base">
                  Select Weight Slab:
                </label>
                <select
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  <option value="">Select Weight</option>
                  {weights.map((weightOption, index) => (
                    <option key={index} value={weightOption}>
                      {weightOption}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>

          {/* Rate Details */}
          <div className="w-full lg:w-[40%] bg-white rounded-xl shadow-lg p-4 lg:p-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-purple-700 mb-4">
              Rate Details
            </h2>
            <div></div>
            {selectedRate ? (
              <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden text-sm">
                <thead className="bg-purple-100 text-gray-700">
                  <tr>
                    <th className="px-2 lg:px-4 py-2">Weight</th>
                    <th className="px-2 lg:px-4 py-2">Economy</th>
                    <th className="px-2 lg:px-4 py-2">Express</th>
                    <th className="px-2 lg:px-4 py-2">EcoDutyFree</th>
                    <th className="px-2 lg:px-4 py-2">Eco Self</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-2 lg:px-4 py-2">
                      {selectedRate.Weight_slab}
                    </td>
                    <td className="px-2 lg:px-4 py-2">
                      {selectedRate.Economy}
                    </td>
                    <td className="px-2 lg:px-4 py-2">
                      {selectedRate.Express}
                    </td>
                    <td className="px-2 lg:px-4 py-2">
                      {selectedRate.EcoDutyFree}
                    </td>
                    <td className="px-2 lg:px-4 py-2">
                      {selectedRate.EcoSelf}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600 mt-4 text-sm">
                Please select a weight slab to view rates.
              </p>
            )}
          </div>

          {/* Zones and Instructions */}
          <div className="w-full flex flex-col lg:flex-row gap-6 ">
            {/* Zones */}
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl shadow-md p-4 lg:p-6 h-[350px] overflow-y-auto">
              <h3 className="text-xl lg:text-2xl font-medium text-purple-700 mb-4">
                Zones
              </h3>
              {Zones.length ? (
                <ul className="space-y-2">
                  {Zones.map((zone, index) => (
                    <li
                      key={index}
                      className="text-gray-700 bg-gray-100 px-3 py-2 rounded-md hover:bg-purple-50"
                    >
                      {zone}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-sm">No zones available.</p>
              )}
            </div>

            {/* Instructions */}
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl shadow-md p-4 lg:p-6 h-[350px] overflow-y-auto">
              <h3 className="text-xl lg:text-2xl font-medium text-purple-700 mb-4">
                Instructions
              </h3>
              {Instructions.length ? (
                <ul className="space-y-2">
                  {Instructions.map((instruction, index) => (
                    <li
                      key={index}
                      className="text-gray-700 bg-gray-100 px-3 py-2 rounded-md"
                    >
                      {instruction}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-sm">
                  No instructions available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RateCardForm;
