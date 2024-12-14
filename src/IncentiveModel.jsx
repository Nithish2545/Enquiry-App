import React, { useEffect, useState } from "react";
import utility from "./Utility/utilityFunctions";
import { Avatar } from "@mui/material";
import Nav from "./Nav";
function IncentiveModel() {
  const [DateRange, setDateRange] = useState("Last Week"); // Default value set to "This Week"
  const [data, setData] = useState({
    revenue: 0,
    totalBookings: 0,
    avgBookingValue: 0,
    loginCredentials: [],
    groupedData: {},
    topPerformer: "",
    startEnddate: {},
  });

  function getSalesPersonBookings(person) {
    return data.groupedData[person]?.bookings.length
      ? data.groupedData[person]?.bookings.length
      : 0;
  }

  useEffect(() => {
    async function getData() {
      try {
        const [
          revenue,
          totalBookings,
          avgBookingValue,
          loginCredentials,
          groupedData,
          topPerformer,
          startEnddate,
        ] = await Promise.all([
          utility.getRevenue(DateRange),
          utility.getTotalBookings(DateRange),
          utility.AvgBookingValue(DateRange),
          utility.fetchLoginCredentials(DateRange),
          utility.groupByPickupBookedBy(DateRange),
          utility.TopPerformer(DateRange),
          utility.fetchStartEndDate(DateRange),
        ]);

        setData({
          revenue,
          totalBookings,
          avgBookingValue,
          loginCredentials,
          groupedData,
          topPerformer,
          startEnddate,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    getData();
  }, [DateRange]);

  function FirtLetterCaps(name) {
    return name?.charAt(0).toUpperCase() + name?.slice(1);
  }

  function findIncentive(person) {
    return utility.IncentiveCalculator(getSalesPersonBookings(person));
  }

  return (
    <div>
      <Nav />
      <div className="flex flex-col gap-10 p-8 bg-gray-50 min-h-screen">
        <div className="text-xl font-semibold"></div>
        {/* Filter Options Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row items-center mb-6 gap-6 md:gap-8">
            <h1 className="text-4xl font-semibold text-gray-900 tracking-wide text-center md:text-left">
              Filter Options
            </h1>
            <div className="flex gap-4 md:gap-6 items-center justify-center md:justify-start">
              <h2 className="text-2xl font-semibold text-gray-700">
                {data.startEnddate.startDate}
              </h2>
              <span className="text-2xl font-medium text-gray-500">To</span>
              <h2 className="text-2xl font-semibold text-gray-700">
                {data.startEnddate.endDate}
              </h2>
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="date-range"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Date Range
                </label>
                <select
                  id="date-range"
                  name="dateRange"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
                  value={DateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="Select range">Select range</option>
                  <option value="This Week">This Week</option>
                  <option value="Last Week">Last Week</option>
                </select>
              </div>
            </div>
            {/* <button
              type="submit"
              className="w-full sm:w-auto bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-200"
            >
              Apply Filters
            </button> */}
          </div>
        </div>
        {/* Sales Overview Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            Sales Overview
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-purple-50 p-6 rounded-lg shadow-sm text-center">
              <h2 className="text-lg font-medium text-purple-800">
                Total Bookings
              </h2>
              <p className="text-3xl font-bold text-purple-600">
                {data.totalBookings}
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow-sm text-center">
              <h2 className="text-lg font-medium text-green-800">
                Total Revenue
              </h2>
              <p className="text-3xl font-bold text-green-600">
                ₹{data.revenue}
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm text-center">
              <h2 className="text-lg font-medium text-blue-800">
                Avg. Booking Value
              </h2>
              <p className="text-3xl font-bold text-blue-600">
                ₹{data.avgBookingValue}
              </p>
            </div>
            <div className="bg-red-50 p-6 rounded-lg shadow-sm text-center">
              <h2 className="text-lg font-medium text-red-800">
                Top Performer
              </h2>
              <p className="text-3xl font-bold text-red-600">
                {FirtLetterCaps(data.topPerformer)}
              </p>
            </div>
          </div>
        </div>
        {/* Sales Team Performance Section */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            Sales Team Performance
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.loginCredentials.map((d) => (
              <div
                key={d.name}
                className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-6 hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Header: Avatar and Info */}
                <div className="flex items-center gap-4">
                  <Avatar
                    alt={FirtLetterCaps(d.name)}
                    src=""
                    className="bg-purple-500 text-white font-bold"
                  />
                  <div>
                    <p className="text-xl font-semibold text-gray-800">
                      {FirtLetterCaps(d.name)}
                    </p>
                    <p className="text-sm text-gray-500">{d.role}</p>
                  </div>
                </div>

                {/* Weekly Bookings */}
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-500">Weekly Bookings</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {getSalesPersonBookings(d.name)}
                  </p>
                </div>

                {/* Download Report Button */}
                <button
                  className="flex items-center justify-center bg-purple-600 py-3 px-4 rounded-lg text-white font-medium gap-2 hover:bg-purple-700 focus:ring focus:ring-purple-300 transition-all"
                  onClick={() => utility.downloadCSV(d.name, DateRange)}
                >
                  <img
                    className="w-5 h-5"
                    src="download-minimalistic.svg"
                    alt="Download icon"
                  />
                  <span>Download Report</span>
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Weekly Incentive Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
            Weekly Incentive (Saturday to Friday)
          </h1>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-white border-collapse border border-gray-300 rounded-lg shadow-md">
              <thead>
                <tr className="bg-purple-200">
                  <th className="px-6 py-4 text-center text-lg font-semibold text-gray-700 border-b border-gray-300">
                    Name
                  </th>
                  <th className="px-6 py-4 text-center text-lg font-semibold text-gray-700 border-b border-gray-300">
                    Bookings
                  </th>
                  <th className="px-6 py-4 text-center text-lg font-semibold text-gray-700 border-b border-gray-300">
                    Incentive
                  </th>
                  <th className="px-6 py-4 text-center text-lg font-semibold text-gray-700 border-b border-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.loginCredentials.map((row, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition-colors duration-200`}
                  >
                    <td className="px-6 py-4 text-center text-base text-gray-800 font-medium border-b border-gray-300">
                      {row.name}
                    </td>
                    <td className="px-6 py-4 text-center text-base text-gray-800 font-medium border-b border-gray-300">
                      {String(getSalesPersonBookings(row.name)).padStart(
                        2,
                        "0"
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-base text-gray-800 font-medium border-b border-gray-300">
                      ₹{findIncentive(row.name)}
                    </td>
                    <td className="px-6 py-4 text-center text-base text-gray-800 font-medium border-b border-gray-300">
                      <button
                        onClick={() => utility.downloadCSV(row.name, DateRange)}
                        className="text-purple-600 underline hover:text-purple-800"
                      >
                        Download Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncentiveModel;
