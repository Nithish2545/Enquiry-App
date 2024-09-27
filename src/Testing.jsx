// import { useEffect, useRef, useState } from "react";
// import { useForm } from "react-hook-form";
// import { getData } from "country-list";
// import Nav from "./Nav";
// import apiURL from "./apiURL";
// import { storage } from "./firebase";
// import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
// import SavePDF from "./savePDF";
// import jsPDF from "jspdf";
// import JsBarcode from "jsbarcode";

// function PickupBooking() {

//   const [loading, setLoading] = useState(false);
//   const [countries, setCountries] = useState([]);
//   const [countryCodeToName, setCountryCodeToName] = useState({});
//   const [showModal, setShowModal] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState({});
//   const [imageURLs, setImageURLs] = useState([]);
//   const [username, setUsername] = useState("");
//   const [files, setFiles] = useState([]);
//   const [awbNumber, setawbNumber] = useState();
//   const [frachise, setfrachise] = useState("");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();

//   const barcodeRef = useRef(null);
//   const todayDate = new Date().toLocaleDateString();
//   const generateAWBNumber = () => {
//     return String(Math.floor(100000 + Math.random() * 900000)).padStart(4, "0");
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = date.getDate(); // Gets the day (1-31)
//     const month = date.getMonth() + 1; // Gets the month (0-11), so add 1
//     return `${day}-${month}`; // Format as "DD-M"
//   };

//   // Example usage

//   useEffect(() => {
//     const data = JSON.parse(localStorage.getItem("enquiryAuthToken")).name;
//     setUsername(data);
//   }, []);

//   useEffect(() => {
//     const countryData = getData();
//     console.log(countryData);
//     countryData.push({ code: "UAE", name: "United Arab Emirates" });
//     countryData.push({ code: "EU", name: "Europe" });
//     countryData.push({ code: "GB", name: "UK" });
//     countryData.push({ code: "US", name: "USA" });

//     const topCountries = [
//       "USA",
//       "UK",
//       "Canada",
//       "Europe",
//       "Singapore",
//       "United Arab Emirates",
//       "Malaysia",
//       "Australia",
//       "New Zealand",
//       "China",
//     ];

//     // Sort countries alphabetically
//     const sortedCountries = countryData.sort((a, b) =>
//       a.name.localeCompare(b.name)
//     );

//     // Map top countries to their data
//     const topCountryData = topCountries
//       .map((name) => sortedCountries.find((country) => country.name === name))
//       .filter(Boolean); // Remove any undefined entries

//     // Filter out top countries from sorted list
//     const remainingCountries = sortedCountries.filter(
//       (country) => !topCountries.includes(country.name)
//     );

//     // Combine top countries with remaining countries
//     const orderedCountries = [...topCountryData, ...remainingCountries];

//     setCountries(orderedCountries);

//     // Create a map of country codes to names
//     const codeToNameMap = orderedCountries.reduce((acc, country) => {
//       acc[country.code] = country.name;
//       return acc;
//     }, {});

//     setCountryCodeToName(codeToNameMap);
    
//   }, []);

//   const onSubmit = async (data) => {
//     console.log(frachise);
//     setLoading(true);
//     const awbNumber = generateAWBNumber();
//     setawbNumber(awbNumber);
//     console.log(`Generated AWB Number: ${awbNumber}`);
//     const uploadedImageURLs = await uploadImages(files);
//     console.log(uploadedImageURLs);

//     try {
//       const destinationCountryName =
//         countryCodeToName[data.country] || data.country;
//       console.log(data);
//       const body = {
//         sheet1: {
//           consignorname: data.Consignorname,
//           consignorphonenumber: data.Consignornumber,
//           consignorlocation: data.Consignorlocation,
//           consigneename: data.consigneename,
//           consigneephonenumber: data.consigneenumber,
//           consigneelocation: data.consigneelocation,
//           content: data.Content,
//           email: data.email,
//           phonenumber: data.number,
//           longitude: data.longitude,
//           latitude: data.latitude,
//           pincode: data.pincode,
//           destination: destinationCountryName, // Use full country name here
//           weightapx: data.weight + " KG",
//           pickupInstructions: data.instructions,
//           pickupDatetime:
//             formatDate(data.pickupDate) +
//             " " +
//             " " +
//             "&" +
//             data.pickupHour +
//             " " +
//             data.pickupPeriod,
//           vendorName: data.vendor,
//           status: "RUN SHEET",
//           Pickuparea: data.pickuparea,
//           pickupBookedBy: username,
//           franchise:frachise
//         },
//       };

//       const response = await fetch(apiURL.CHENNAI, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//       });

//       const json = await response.json();
//       console.log(json.sheet1);

//       reset();
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }

//     setShowModal(true);

//   };

//   const closeModal = () => {
//     setShowModal(false);
//   };

//   const uploadImages = async (images) => {
//     const uploadedURLs = [];
//     console.log(awbNumber);
//     const uploadPromises = images.map((image, index) => {
//       const imageRef = ref(storage, `${awbNumber}/${image.name}`);
//       const uploadTask = uploadBytesResumable(imageRef, image);

//       return new Promise((resolve, reject) => {
//         uploadTask.on(
//           "state_changed",
//           (snapshot) => {
//             // Calculate upload progress
//             const progress = Math.round(
//               (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//             );
//             setUploadProgress((prev) => ({ ...prev, [index]: progress }));
//           },
//           (error) => reject(error),
//           async () => {
//             try {
//               const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//               console.log(downloadURL);
//               uploadedURLs.push(downloadURL);
//               resolve();
//             } catch (error) {
//               reject(error);
//             }
//           }
//         );
//       });
//     });

//     await Promise.all(uploadPromises);
//     return uploadedURLs;
//   };

//   return (
//     <div className="">
//       <Nav />
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4  flex-col gap-4">
//         <h className="text-3xl font-bold">Sales</h>
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="bg-white p-6 rounded-md shadow-none w-full max-w-4xl"
//         >
//           <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
//             Submit Pickup Details
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <div className="mb-4">
//               <label className="block text-gray-700 font-semibold mb-2">
//                 Consignor Name:
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter consignor name"
//                 {...register("Consignorname", {
//                   required: "Consignor name is required",
//                 })}
//                 className={`w-full px-3 py-2 border ${
//                   errors.Consignorname ? "border-red-500" : "border-gray-300"
//                 } rounded-md focus:outline-none focus:border-[#8847D9]`}
//               />
//               {errors.Consignorname && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.Consignorname.message}
//                 </p>
//               )}
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700 font-semibold mb-2">
//                 Consignor Phone Number:
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter consignor phone number"
//                 {...register("Consignornumber", {
//                   required: "Consignor phone number is required",
//                   pattern: {
//                     value: /^[0-9]+$/,
//                     message: "Please enter a valid phone number",
//                   },
//                   onChange: (e) => {
//                     // Remove non-numeric characters
//                     e.target.value = e.target.value.replace(/[^0-9]/g, "");
//                   },
//                 })}
//                 className={`w-full px-3 py-2 border ${
//                   errors.Consignornumber ? "border-red-500" : "border-gray-300"
//                 } rounded-md focus:outline-none focus:border-[#8847D9]`}
//               />
//               {errors.Consignornumber && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.Consignornumber.message}
//                 </p>
//               )}
//             </div>

//             <div className="mb-4">
//               <label className="block text-gray-700 font-semibold mb-2">
//                 Consignor location:
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter Consignor location"
//                 {...register("Consignorlocation", {
//                   required: "Enter Consignor location",
//                 })}
//                 className={`w-full px-3 py-2 border ${
//                   errors.Consignorlocation
//                     ? "border-red-500"
//                     : "border-gray-300"
//                 } rounded-md focus:outline-none focus:border-[#8847D9]`}
//               />
//               {errors.Consignorlocation && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.Consignorlocation.message}
//                 </p>
//               )}
//             </div>

//             <div className="mb-4">
//               <label className="block text-gray-700 font-semibold mb-2">
//                 consignee Name:
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter consignee name"
//                 {...register("consigneename", {
//                   required: "Consignee name is required",
//                 })}
//                 className={`w-full px-3 py-2 border ${
//                   errors.consigneename ? "border-red-500" : "border-gray-300"
//                 } rounded-md focus:outline-none focus:border-[#8847D9]`}
//               />
//               {errors.consigneename && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.consigneename.message}
//                 </p>
//               )}
//             </div>

//             <div className="mb-4">
//               <label className="block text-gray-700 font-semibold mb-2">
//                 consignee Phone Number:
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter consignee phone number"
//                 {...register("consigneenumber", {
//                   required: "consignee phone number is required",
//                   pattern: {
//                     value: /^[0-9]+$/,
//                     message: "Please enter a valid phone number",
//                   },
//                 })}
//                 className={`w-full px-3 py-2 border ${
//                   errors.consigneenumber ? "border-red-500" : "border-gray-300"
//                 } rounded-md focus:outline-none focus:border-[#8847D9]`}
//               />
//               {errors.consigneenumber && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.consigneenumber.message}
//                 </p>
//               )}
//             </div>
            
          

//             <div className="mb-4">
//               <label className="block text-gray-700 font-semibold mb-2">
//                 Pickup Date:
//               </label>
//               <input
//                 type="date"
//                 {...register("pickupDate", {
//                   required: "Pickup date is required",
//                 })}
//                 className={`w-full px-3 py-2 border ${
//                   errors.pickupDate ? "border-red-500" : "border-gray-300"
//                 } rounded-md focus:outline-none focus:border-[#8847D9]`}
//               />
//               {errors.pickupDate && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.pickupDate.message}
//                 </p>
//               )}
//             </div>


//             <div className="mb-4">
//               <label className="block text-gray-700 font-semibold mb-2">
//                 Special Instructions:{" "}
//                 <span className="text-gray-500">(optional)</span>:
//               </label>
//               <textarea
//                 placeholder="Enter any special instructions"
//                 {...register("instructions")}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#8847D9]"
//               ></textarea>
//             </div>
//             <div>
//               <p>Frachise</p>
//               <select
//                 className={`w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:border-[#8847D9]`}
//                 onChange={(e) => {
//                   setfrachise(e.target.value)
//                   console.log(e.target.value)
//                 }}
//               >
//                 <option value="select">select</option>
//                 <option value="CHENNAI">CHENNAI</option>
//                 <option value="COIMBATORE">KOVAI</option>
//                 <option value="PONDY">PONDY</option>
//               </select>
//             </div>
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700 font-semibold mb-2">
//               Upload Images (max 5):
//             </label>
//             <input
//               type="file"
//               multiple
//               onChange={(e) => {
//                 const files = Array.from(e.target.files).slice(0, 5); // Limit to 5 files
//                 setFiles(files);
//               }}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#8847D9]"
//             />
//             {files.length > 0 && (
//               <div className="mt-2">
//                 {files.map((file, index) => (
//                   <p key={index} className="text-gray-700">
//                     {file.name}
//                   </p>
//                 ))}
//               </div>
//             )}
//           </div>
//           <div className="flex justify-center">
//             <button
//               type="submit"
//               className={`bg-[#8847D9] text-white font-semibold py-2 px-4 rounded-md transition duration-300 ${
//                 loading ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//               disabled={loading}
//             >
//               {loading ? "Submitting..." : "Submit"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default PickupBooking;