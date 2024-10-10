import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import apiURL from "./apiURL";
import { storage } from "./firebase"; // Import storage from your Firebase config
import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";
import { useForm } from "react-hook-form";

const API_URL = apiURL.CHENNAI;

function PaymentConfirmationForm() {
  const { awbnumber } = useParams();
  const [details, setDetails] = useState(null);
  const [paymentProof, setPaymentProof] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const barcodeRef = useRef(null); // Ref for barcode generation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();

  const generatePDF = () => {
    const doc = new jsPDF();

    // Format date as day/month/year
    const todayDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Generate barcode
    JsBarcode(barcodeRef.current, awbnumber, {
      format: "CODE128",
      displayValue: true,
      width: 2, // Adjust width as needed
      height: 40, // Adjust height as needed
      fontOptions: "bold", // Make the text bold
      fontSize: 16, // Increase font size for the barcode text
      textMargin: 5, // Space between the barcode and text
      margin: 10, // Margin around the barcode
      background: "#ffffff", // Background color of the barcode
      lineColor: "#000000", // Color of the bars
      scale: 4, // Higher scale for better quality
    });
    const barcodeImage = barcodeRef.current.toDataURL();

    // Add logo with adjusted size (height will auto-adjust)
    const logoUrl = "/shiphtlogo.png";
    doc.addImage(logoUrl, "PNG", 140, 10, 50, 0); // Increased width to 50, height auto-adjusts

    // Add title and date
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(`${details.service} Service`, 20, 30);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${todayDate}`, 20, 40);

    // Set line width for borders
    doc.setLineWidth(0.5);

    // From section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("From:", 20, 60);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Name: ${details.consignorname}`, 20, 70);
    doc.text(`Phone Number: ${details.consignorphonenumber}`, 20, 80);
    const fromLocation = doc.splitTextToSize(
      `Location: ${details.consignorlocation}`,
      85
    );
    doc.text(fromLocation, 20, 90);

    // Horizontal line between "From" and "To" sections
    doc.line(10, 107, 200, 107);

    // To section
    doc.setFont("helvetica", "bold");
    doc.text("To:", 110, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${details.consigneename}`, 110, 70);
    doc.text(`Phone Number: ${details.consigneephonenumber}`, 110, 80);
    const toLocation = doc.splitTextToSize(
      `Location: ${details.consigneelocation}`,
      85
    );
    doc.text(toLocation, 110, 90);

    // Shipment Details section
    doc.setFont("helvetica", "bold");
    doc.text("Shipment Details:", 20, 115); // Adjusted Y position to place below the line
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Weight (kg): ${details.actualWeight} kg`, 20, 125);
    doc.text(
      `Pce/Shpt: ${details.actualNoOfPackages} / ${details.actualNoOfPackages}`,
      20,
      135
    );
    doc.text(`Content: ${details.content}`, 20, 145);

    // Horizontal line above "AWB Number" section
    doc.line(10, 154, 200, 154); // Border above "AWB Number"

    // Add barcode section with improved quality
    doc.setFont("helvetica", "bold");
    doc.text(`AWB Number: ${awbnumber}`, 20, 165);
    doc.addImage(barcodeImage, "PNG", 20, 175, 100, 30);

    // Save PDF
    doc.save(`${details.consignorname}-client-form.pdf`);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await axios.get(API_URL);
        const userDetails = result.data.sheet1.find(
          (item) =>
            item.status === "PAYMENT PENDING" && item.awbNumber == awbnumber
        );
        console.log(userDetails);
        setDetails(userDetails);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [awbnumber]);

  const uploadFileToFirebase = async (file, folder) => {
    const storageRef = ref(storage, `${awbnumber}/${folder}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPaymentProof(file);
    }
  };

  const validateForm = () => {
    if (!paymentProof) {
      setFormError("Payment proof image is required.");
      return false;
    }
    setFormError("");
    return true;
  };

  const onSubmit = async (data) => {
    if (!validateForm()) return;

    setSubmitLoading(true);

    try {
      if (!details) {
        throw new Error("User details not found");
      }

      const paymentProofUrl = await uploadFileToFirebase(
        paymentProof,
        "PAYMENT PROOF"
      );

      await axios.put(`${API_URL}/${details.id}`, {
        sheet1: {
          status: "PAYMENT DONE",
          logisticsCost: data.logisticsCost,
        },
      });
      setShowPopup(true);
    } catch (error) {
      handleError(error);
    } finally {
      setSubmitLoading(false);
      resetForm(); // Reset form after submission
    }
  };

  const handleError = (error) => {
    if (error.response) {
      setError(
        `Error ${error.response.status}: ${
          error.response.data.message || error.message
        }`
      );
    } else if (error.request) {
      setError("Network error. Please check your connection.");
    } else {
      setError(`Error: ${error.message}`);
    }
  };

  const resetForm = () => {
    setPaymentProof(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-purple-600"
          role="status"
        >
          <span className="visually-hidden">...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      {details ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-50 p-4 rounded-lg shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Payment Confirmation
          </h2>
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none"
          >
            Back
          </button>
          <div className="flex flex-col mb-4">
            <label className="text-gray-700 font-medium mb-1">
              Phone Number:
            </label>
            <input
              type="text"
              value={details.consignorphonenumber}
              readOnly
              className="p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-gray-700 font-medium mb-1">Name:</label>
            <input
              type="text"
              value={details.consignorname}
              readOnly
              className="p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-gray-700 font-medium mb-1">
              Destination:
            </label>
            <input
              type="text"
              value={details.destination}
              readOnly
              className="p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-gray-700 font-medium mb-1">
              Actual Weight:
            </label>
            <input
              type="text"
              value={details.actualWeight + " " + "KG"}
              readOnly
              className="p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-gray-700 font-medium mb-1">
              PickUp Person Name:
            </label>
            <input
              type="text"
              value={details.pickUpPersonName}
              readOnly
              className="p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-gray-700 font-medium mb-1">
              Shiphit AWB Number:
            </label>
            <input
              type="text"
              value={awbnumber}
              readOnly
              className="p-2 border rounded bg-gray-100"
            />
          </div>

          {/* FROM */}
          <div className="flex flex-col mb-4">
            <label className="text-gray-700 font-medium mb-1">From:</label>
            <input
              type="text"
              value={details.consignorlocation}
              readOnly
              className="p-2 border rounded bg-gray-100"
            />
          </div>
          {/* TO */}
          <div className="flex flex-col mb-4">
            <label className="text-gray-700 font-medium mb-1">To:</label>
            <input
              type="text"
              value={details.consigneelocation}
              readOnly
              className="p-2 border rounded bg-gray-100"
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="text-gray-700 font-medium mb-1">
              Pickup connected datetime
            </label>
            <input
              type="text"
              value={details.pickupCompletedDatatime}
              readOnly
              className="p-2 border rounded bg-gray-100"
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="text-gray-700 font-medium mb-1">
              Enter Logistics Cost
            </label>
            <input
              type="text"
              className="p-2 border rounded bg-gray-100"
              value={details.logisticsCost}
              placeholder="Enter Logistic Cost"
              {...register("logisticsCost", {
                required: "Consignor phone number is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message:
                    "Please enter a valid phone number consisting of digits only",
                },
                valueAsNumber: true, // Converts input value to an integer
                validate: (value) =>
                  Number.isInteger(value) ||
                  "Please enter a valid integer number",
              })}
            />
          </div>
          {errors.logisticsCost && (
            <p className="text-red-500 text-sm mt-1">
              {errors.logisticsCost.message}
            </p>
          )}
          <div className="flex flex-col mb-4">
            <label className="text-gray-700 font-medium mb-1">
              Payment Proof:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="p-2 border rounded"
            />
          </div>
          {formError && <p className="text-red-500 text-sm">{formError}</p>}
          <button
            type="submit"
            className="w-full mt-4 p-2 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
            disabled={submitLoading}
          >
            {submitLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      ) : (
        <div className="text-center text-gray-500">
          No details found for the given AWB number.
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Payment Submitted</h3>
            <p className="mb-4">Click below to generate your PDF.</p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={generatePDF}
            >
              Generate PDF
            </button>
            <button
              className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              onClick={() => {
                setShowPopup(false);
                navigate("/Payment-confirm");
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hidden canvas for generating barcode */}
      <canvas ref={barcodeRef} style={{ display: "none" }} />
    </div>
  );
}

export default PaymentConfirmationForm;
