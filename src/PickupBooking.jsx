import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { getData } from "country-list";
import Nav from "./Nav";
import { storage } from "./firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

function PickupBooking() {
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [countryCodeToName, setCountryCodeToName] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [imageURLs, setImageURLs] = useState([]);
  const [username, setUsername] = useState("");
  const [files, setFiles] = useState([]);
  const [awbNumber, setawbNumber] = useState();
  const [frachise, setfrachise] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const barcodeRef = useRef(null);
  const todayDate = new Date().toLocaleDateString();
  const generateAWBNumber = () => {
    return String(Math.floor(100000 + Math.random() * 900000)).padStart(4, "0");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate(); // Gets the day (1-31)
    const month = date.getMonth() + 1; // Gets the month (0-11), so add 1
    return `${day}-${month}`; // Format as "DD-M"
  };

  // Example usage

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("enquiryAuthToken")).name;
    setUsername(data);
  }, []);

  useEffect(() => {
    const countryData = getData();
    console.log(countryData);
    countryData.push({ code: "UAE", name: "United Arab Emirates" });
    countryData.push({ code: "EU", name: "Europe" });
    countryData.push({ code: "GB", name: "UK" });
    countryData.push({ code: "US", name: "USA" });
    const topCountries = [
      "USA",
      "UK",
      "Canada",
      "Europe",
      "Singapore",
      "United Arab Emirates",
      "Malaysia",
      "Australia",
      "New Zealand",
      "China",
    ];
    // Sort countries alphabetically
    const sortedCountries = countryData.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    // Map top countries to their data
    const topCountryData = topCountries
      .map((name) => sortedCountries.find((country) => country.name === name))
      .filter(Boolean); // Remove any undefined entries
    // Filter out top countries from sorted list
    const remainingCountries = sortedCountries.filter(
      (country) => !topCountries.includes(country.name)
    );
    // Combine top countries with remaining countries
    const orderedCountries = [...topCountryData, ...remainingCountries];
    setCountries(orderedCountries);
    // Create a map of country codes to names
    const codeToNameMap = orderedCountries.reduce((acc, country) => {
      acc[country.code] = country.name;
      return acc;
    }, {});
    setCountryCodeToName(codeToNameMap);
  }, []);

  const onSubmit = async (data) => {
    console.log(frachise);
    setLoading(true);
    const awbNumber = generateAWBNumber();
    setawbNumber(awbNumber);
    console.log(`Generated AWB Number: ${awbNumber}`);
    const uploadedImageURLs = await uploadImages(files);
    console.log(uploadedImageURLs);
    try {
      const destinationCountryName =
        countryCodeToName[data.country] || data.country;
      console.log(data);
      reset();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const uploadImages = async (images) => {
    const uploadedURLs = [];
    console.log(awbNumber);
    const uploadPromises = images.map((image, index) => {
      const imageRef = ref(storage, `${awbNumber}/${image.name}`);
      const uploadTask = uploadBytesResumable(imageRef, image);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Calculate upload progress
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress((prev) => ({ ...prev, [index]: progress }));
          },
          (error) => reject(error),
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log(downloadURL);
              uploadedURLs.push(downloadURL);
              resolve();
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    });

    await Promise.all(uploadPromises);
    return uploadedURLs;
  };

  return (
    <div className="">
      <Nav />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4  flex-col gap-4">
        <h className="text-3xl font-bold">Sales</h>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 rounded-md shadow-none w-full max-w-4xl"
        >
          <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
            Submit Pickup Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Consignor Name:
              </label>
              <input
                type="text"
                placeholder="Enter consignor name"
                {...register("Consignorname", {
                  required: "Consignor name is required",
                })}
                className={`w-full px-3 py-2 border ${
                  errors.Consignorname ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.Consignorname && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Consignorname.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Consignor Phone Number:
              </label>
              <input
                type="text"
                placeholder="Enter consignor phone number"
                {...register("Consignornumber", {
                  required: "Consignor phone number is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Please enter a valid phone number",
                  },
                  onChange: (e) => {
                    // Remove non-numeric characters
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  },
                })}
                className={`w-full px-3 py-2 border ${
                  errors.Consignornumber ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.Consignornumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Consignornumber.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Consignor location:
              </label>
              <input
                type="text"
                placeholder="Enter Consignor location"
                {...register("Consignorlocation", {
                  required: "Enter Consignor location",
                })}
                className={`w-full px-3 py-2 border ${
                  errors.Consignorlocation
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.Consignorlocation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Consignorlocation.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                consignee Name:
              </label>
              <input
                type="text"
                placeholder="Enter consignee name"
                {...register("consigneename", {
                  required: "Consignee name is required",
                })}
                className={`w-full px-3 py-2 border ${
                  errors.consigneename ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.consigneename && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.consigneename.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                consignee Phone Number:
              </label>
              <input
                type="text"
                placeholder="Enter consignee phone number"
                {...register("consigneenumber", {
                  required: "consignee phone number is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Please enter a valid phone number",
                  },
                })}
                className={`w-full px-3 py-2 border ${
                  errors.consigneenumber ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.consigneenumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.consigneenumber.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                consignee location:
              </label>
              <input
                type="text"
                placeholder="Enter consignee location"
                {...register("consigneelocation", {
                  required: "Enter consignee location",
                })}
                className={`w-full px-3 py-2 border ${
                  errors.consigneelocation
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.consigneelocation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.consigneelocation.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Country (Destination):
              </label>
              <select
                {...register("country", { required: "Country is required" })}
                className={`w-full px-3 py-2 border ${
                  errors.country ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              >
                <option value="">Select your country</option>
                {countries.map((country) =>
                  country ? (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ) : null
                )}
              </select>
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Pickup Pincode:
              </label>
              <input
                type="text"
                placeholder="Enter your pincode"
                {...register("pincode", { required: "Pincode is required" })}
                className={`w-full px-3 py-2 border ${
                  errors.pincode ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.pincode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pincode.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Pickup Area:
              </label>
              <input
                type="text"
                placeholder="Enter your pickup area"
                {...register("pickuparea", {
                  required: "Pickup area is required",
                })}
                className={`w-full px-3 py-2 border ${
                  errors.pickuparea ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.pickuparea && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pickuparea.message}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Weight (approx):
              </label>
              <input
                type="number"
                placeholder="Enter weight without units"
                {...register("weight", {
                  required: "Weight is required",
                  valueAsNumber: true,
                })}
                className={`w-full px-3 py-2 border ${
                  errors.weight ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.weight && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.weight.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Content (Products):
              </label>
              <input
                type="text"
                placeholder="Enter list of products"
                {...register("Content", {
                  required: "list of products is required",
                })}
                className={`w-full px-3 py-2 border ${
                  errors.Content ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.Content && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Content.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Vendor:
              </label>
              <select
                {...register("vendor", { required: "Vendor is required" })}
                className={`w-full px-3 py-2 border ${
                  errors.vendor ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              >
                <option value="">Select a vendor</option>
                <option value="DHL">DHL</option>
                <option value="Aramex">Aramex</option>
                <option value="UPS">UPS</option>
                <option value="FedEx">FedEx</option>
                <option value="Self">Self</option>
              </select>
              {errors.vendor && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.vendor.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Longitude:
              </label>
              <input
                type="text"
                placeholder="Enter your longitude"
                {...register("longitude", {
                  required: "Longitude is required",
                })}
                className={`w-full px-3 py-2 border ${
                  errors.longitude ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.longitude && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.longitude.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Latitude:
              </label>
              <input
                type="text"
                placeholder="Enter your latitude"
                {...register("latitude", {
                  required: "Latitude is required",
                })}
                className={`w-full px-3 py-2 border ${
                  errors.latitude ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.latitude && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.latitude.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Pickup Date:
              </label>
              <input
                type="date"
                {...register("pickupDate", {
                  required: "Pickup date is required",
                })}
                className={`w-full px-3 py-2 border ${
                  errors.pickupDate ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:border-[#8847D9]`}
              />
              {errors.pickupDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pickupDate.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Pickup Time:
              </label>

              {/* Time Dropdown */}
              <div className="flex space-x-2">
                {/* Hour Dropdown */}
                <select
                  {...register("pickupHour", {
                    required: "Pickup hour is required",
                  })}
                  className={`w-1/2 px-3 py-2 border ${
                    errors.pickupHour ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:border-[#8847D9]`}
                >
                  <option value="">Select Hour</option>
                  {[...Array(12).keys()].map((hour) => (
                    <option key={hour + 1} value={hour + 1}>
                      {hour + 1}:00
                    </option>
                  ))}
                </select>

                {/* AM/PM Dropdown */}
                <select
                  {...register("pickupPeriod", {
                    required: "AM/PM is required",
                  })}
                  className={`w-1/2 px-3 py-2 border ${
                    errors.pickupPeriod ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:border-[#8847D9]`}
                >
                  <option value="">AM/PM</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>

              {/* Error messages */}
              {errors.pickupHour && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pickupHour.message}
                </p>
              )}
              {errors.pickupPeriod && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pickupPeriod.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Special Instructions:{" "}
                <span className="text-gray-500">(optional)</span>:
              </label>
              <textarea
                placeholder="Enter any special instructions"
                {...register("instructions")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#8847D9]"
              ></textarea>
            </div>
            <div>
              <p>Frachise</p>
              <select
                className={`w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:border-[#8847D9]`}
                onChange={(e) => {
                  setfrachise(e.target.value);
                  console.log(e.target.value);
                }}
              >
                <option value="select">select</option>
                <option value="CHENNAI">CHENNAI</option>
                <option value="COIMBATORE">KOVAI</option>
                <option value="PONDY">PONDY</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Upload Images (max 5):
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files).slice(0, 5); // Limit to 5 files
                setFiles(files);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#8847D9]"
            />
            {files.length > 0 && (
              <div className="mt-2">
                {files.map((file, index) => (
                  <p key={index} className="text-gray-700">
                    {file.name}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className={`bg-[#8847D9] text-white font-semibold py-2 px-4 rounded-md transition duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-md shadow-lg w-80"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
          >
            <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
              Success!
            </h2>
            <p className="text-center text-gray-700">
              Your pickup details have been submitted successfully.
            </p>
            <div className="mt-4 flex justify-center">
              <button
                onClick={closeModal}
                className="bg-[#8847D9] text-white font-semibold py-2 px-4 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <canvas ref={barcodeRef} style={{ display: "none" }}></canvas>
    </div>
  );
}

export default PickupBooking;