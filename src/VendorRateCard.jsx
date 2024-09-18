import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "./Nav";

const RateDisplay = () => {
  const [data, setData] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("ARAMEX");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [filteredRate, setFilteredRate] = useState(null);
  const [weightOptions, setWeightOptions] = useState([]);

  const APIURL = "https://sheetdb.io/api/v1/57vn5sseznvw5"; // Replace with your actual API URL

  useEffect(() => {
    // Function to fetch data from the API based on selected provider
    const fetchData = async () => {
      let sheetName = "";

      switch (selectedProvider) {
        case "ARAMEX":
          sheetName = "ARAMEX";
          break;
        case "UPS":
          sheetName = "UPS";
          break;
        case "FEDEX":
          sheetName = "FEDEX";
          break;
        case "DHL":
          sheetName = "DHL";
          break;
        default:
          sheetName = "ARAMEX"; // Default sheet name
      }

      const endurl = `${APIURL}?sheet=${sheetName}`;
      try {
        const response = await axios.get(endurl);
        setData(response.data);
        console.log(response.data);
        // Assuming the weights are the column names after "COUNTRY"
        if (response.data.length > 0) {
          const weightColumns = Object.keys(response.data[0]).filter(
            (key) => key !== "COUNTRY"
          );
          setWeightOptions(weightColumns);
        } else {
          setWeightOptions([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]); // Clear data in case of error
        setWeightOptions([]); // Clear weight options in case of error
      }
    };

    // Reset states when provider changes
    setData([]);
    setSelectedCountry("");
    setSelectedWeight("");
    setFilteredRate(null);
    setWeightOptions([]);

    fetchData();
  }, [selectedProvider]);

  const handleProviderChange = (event) => {
    setSelectedProvider(event.target.value);
    // States will be reset in the useEffect
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleWeightChange = (event) => {
    setSelectedWeight(event.target.value);
  };

  useEffect(() => {
    if (selectedCountry && selectedWeight) {
      const rate = data.find((row) => row.COUNTRY === selectedCountry);
      if (rate) {
        setFilteredRate(rate[selectedWeight]);
      } else {
        setFilteredRate(null);
      }
    } else {
      setFilteredRate(null); // Reset rate when no country or weight is selected
    }
  }, [selectedCountry, selectedWeight, data]);

  return (
    <div>
      <Nav />
      <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
        <h1 className="text-2xl font-bold text-center mb-6">Rate Card</h1>

        <div className="space-y-4">
          {/* Provider Selection */}
          <div>
            <label
              htmlFor="provider"
              className="block text-sm font-medium text-gray-700"
            >
              Select Provider
            </label>
            <select
              id="provider"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              onChange={handleProviderChange}
              value={selectedProvider}
            >
              <option value="ARAMEX">Aramex</option>
              <option value="UPS">UPS</option>
              <option value="FEDEX">FedEx</option>
              <option value="DHL">DHL</option>
            </select>
          </div>

          {/* Country Selection */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Select Country
            </label>
            <select
              id="country"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              onChange={handleCountryChange}
              value={selectedCountry}
              disabled={!selectedProvider}
            >
              <option value="">Select Country</option>
              {data.map((row) => (
                <option key={row.COUNTRY} value={row.COUNTRY}>
                  {row.COUNTRY}
                </option>
              ))}
            </select>
          </div>

          {/* Weight Selection */}
          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700"
            >
              Select Weight
            </label>
            <select
              id="weight"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              onChange={handleWeightChange}
              value={selectedWeight}
              disabled={!selectedCountry}
            >
              <option value="">Select Weight</option>
              {weightOptions.map((weight) => (
                <option key={weight} value={weight}>
                  {weight}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Display Rate */}
        {filteredRate && (
          <div className="mt-6 p-4 bg-purple-100 text-purple-700 rounded-md">
            <h2 className="text-lg font-medium">
              Rate for {selectedCountry} - {selectedWeight} ({selectedProvider}
              ):
            </h2>
            <p className="text-xl font-bold">{filteredRate} INR</p>
          </div>
        )}

        {!filteredRate && selectedCountry && selectedWeight && (
          <p className="mt-6 text-center text-red-500">
            No rate data available for the selected options.
          </p>
        )}
      </div>
    </div>
  );
};

export default RateDisplay;
