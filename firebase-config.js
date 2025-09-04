// firebase-config.js
// Firebase modular SDK v9+ | Pure JavaScript Module

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

// Firebase configuration (EnglaBet Project)
const firebaseConfig = {
  apiKey: "AIzaSyDivFTAKUznc1xryU8marfMDZG3v1eYsl8",
  authDomain: "englabet-ad1fe.firebaseapp.com",
  projectId: "englabet-ad1fe",
  storageBucket: "englabet-ad1fe.firebasestorage.app",
  messagingSenderId: "124544822433",
  appId: "1:124544822433:web:c77c980f28c99364c214e0",
  measurementId: "G-JMYYM433R7"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const analytics = getAnalytics(app); // Optional: for usage tracking

// Export services for use in other modules
export { app, auth, database, analytics };

// === Utility Functions ===

// Save business data to Realtime Database
export function saveBusinessData(businessId, businessData) {
  return set(ref(database, 'businesses/' + businessId), businessData);
}

// Check if a slug is already taken
export function checkSlugAvailability(slug) {
  return get(child(ref(database), 'businessSlugs/' + slug))
    .then(snapshot => !snapshot.exists());
}

// Reserve a slug for a business
export function reserveBusinessSlug(slug, businessId) {
  return set(ref(database, 'businessSlugs/' + slug), businessId);
}

// Send sign-in link to user's email
export function sendAuthLink(email, redirectUrl) {
  const actionCodeSettings = {
    // Must be an authorized domain (e.g., your Firebase Hosting or web.app)
    url: redirectUrl || 'https://englabet-7ef09.web.app/welcome',
    handleCodeInApp: true
  };

  return sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
      // Store email locally to complete sign-in after redirect
      window.localStorage.setItem('emailForSignIn', email);
      console.log("Authentication link sent to:", email);
      return true;
    })
    .catch((error) => {
      console.error("Error sending sign-in link:", error);
      throw error;
    });
}

// Complete sign-in when user returns via email link
export async function completeSignInWithEmailLink() {
  try {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');

      if (!email) {
        email = window.prompt('Please enter your email to confirm sign-in:');
      }

      if (!email) {
        throw new Error("Email is required to complete authentication.");
      }

      const result = await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem('emailForSignIn');
      console.log("Signed in successfully:", result.user.email);
      return result.user;
    } else {
      console.log("No Firebase sign-in link detected.");
      return null;
    }
  } catch (error) {
    console.error("Failed to complete sign-in:", error);
    throw error;
  }
}