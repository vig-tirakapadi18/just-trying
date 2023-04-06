import React from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const navigator = useNavigate();
  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const authProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, authProvider);
      const user = result.user;

      //Checking for the user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timeStamp: serverTimestamp(),
        });
      }

      navigator("/");
    } catch (error) {
      toast.error("Couldn't connect to Google. Try again!");
    }
  };

  return (
    <button
      type="button"
      onClick={onGoogleClick}
      className="flex items-center justify-center w-full bg-red-600 font-semibold uppercase px-7 py-3 text-white rounded text-sm hover:bg-red-700 transition duration-150 ease-in-out active:bg-red-800 shadow-md hover:shadow-lg">
      <FcGoogle className="bg-white rounded-lg mr-1 text-lg" />
      Continue with Google
    </button>
  );
};

export default OAuth;
