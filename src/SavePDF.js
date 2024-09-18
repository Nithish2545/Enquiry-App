import JsBarcode from "jsbarcode";
import jsPDF from "jspdf";
import { useRef } from "react";

function SavePDF(
  FROM_NAME,
  FROM_PHONE_NUMBER,
  FROM_LOCATION,
  TO_NAME,
  TO_PHONE_NUMBER,
  TO_LOCATION,
  WEIGHT,
  CONTENT,
  AWBNUMBER
) {

  const barcodeRef = useRef(null);
  const staticAwbNumber = AWBNUMBER;
  const todayDate = new Date().toLocaleDateString();

 
}

export default SavePDF;