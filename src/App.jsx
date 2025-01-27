import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PickupBooking from "./PickupBooking";
import RateCardForm from "./RateCard";
import PaymentConfirm from "./PaymentConfirm";
import PaymentConfirmationForm from "./PaymentConfirmationForm";
import SignIn from "./SignIn";
import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import CancelOrReshedule from "./CancelOrReshedule";
import Pickups from "./Pickups";
import LogisticsDashboard from "./LogisticsDashboard";
import { collection, getDocs, query } from "firebase/firestore";
import AllPickups from "./AllPickups";
import PickupIncentive from "./PickupIncentive";
import VendorRates from "./VendorRates";
import ExtraChargesModule from "./ExtraChargesModule";
import SalesIncentive from "./SalesIncentive";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isConnectionFast, setIsConnectionFast] = useState(true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkConnectionSpeed(); // Check the speed when online
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsConnectionFast(false); // No internet means no speed
    };

    const checkConnectionSpeed = async () => {
      try {
        const startTime = Date.now();
        await fetch("https://www.google.com/favicon.ico", { method: "HEAD" }); // Lightweight request
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Set threshold for "slow" internet, e.g., 1 second
        setIsConnectionFast(duration < 1000);
      } catch (error) {
        setIsConnectionFast(false); // Treat request failure as slow/no internet
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial connection speed check
    if (isOnline) checkConnectionSpeed();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOnline]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const q = query(collection(db, "LoginCredentials"));
        const querySnapshot = await getDocs(q);
        for (const doc of querySnapshot.docs) {
          const result = doc.data();
          // Check if the document has an array named after the email
          if (result[user.email]) {
            const dataset = {
              name: result[user.email][0],
              email: result[user.email][1],
              role: result[user.email][2],
              Location: result[user.email][3],
            };
            // Store user data in localStorage and wait until it's stored
            localStorage.setItem("LoginCredentials", JSON.stringify(dataset));
          }
        }
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false); // Stop loading once auth state is determined
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or component
  }

  return (
    <Router>
      <div>
        <Routes>
          {/* If user is not present, redirect to SignIn */}
          <Route
            path="/"
            element={user ? <PickupBooking /> : <Navigate to="/signin" />}
          />
          {/* Only allow access to other routes if user is logged in */}
          <Route
            path="/Pickup-Booking"
            element={user ? <PickupBooking /> : <Navigate to="/signin" />}
          />
          <Route
            path="/Cancel-reschedule"
            element={user ? <CancelOrReshedule /> : <Navigate to="/signin" />}
          />
          <Route
            path="/addExtraCharges"
            element={user ? <ExtraChargesModule /> : <Navigate to="/signin" />}
          />
          <Route
            path="/Pickups"
            element={user ? <Pickups /> : <Navigate to="/signin" />}
          />
          <Route
            path="/all-Pickups"
            element={user ? <AllPickups /> : <Navigate to="/signin" />}
          />
          <Route
            path="/Sale-rates"
            element={user ? <RateCardForm /> : <Navigate to="/signin" />}
          />
          <Route
            path="/vendor-rates"
            element={user ? <VendorRates /> : <Navigate to="/signin" />}
          />
          <Route
            path="/Payment-confirm"
            element={user ? <PaymentConfirm /> : <Navigate to="/signin" />}
          />
          <Route
            path="/logistics-Dashboard"
            element={user ? <LogisticsDashboard /> : <Navigate to="/signin" />}
          />
          <Route
            path="/Payment-confirmation-form/:awbnumber"
            element={
              user ? <PaymentConfirmationForm /> : <Navigate to="/signin" />
            }
          />
          <Route
            path="/Sales-Incentive"
            element={user ? <SalesIncentive /> : <Navigate to="/signin" />}
          />
          <Route
            path="/Pickup-Incentive"
            element={user ? <PickupIncentive /> : <Navigate to="/signin" />}
          />
          {/* Sign In route, only accessible if no user is logged in */}
          <Route
            path="/signin"
            element={!user ? <SignIn /> : <Navigate to="/Pickup-Booking" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
