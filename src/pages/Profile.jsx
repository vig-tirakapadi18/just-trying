import React, { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FcHome } from "react-icons/fc";

const Profile = () => {
  const auth = getAuth();

  const [changeDetail, setChangeDetail] = useState(false);
  const [name, setName] = useState(auth.currentUser.displayName);
  const [email, setEmail] = useState(auth.currentUser.email);

  const navigator = useNavigate();

  const logoutHandler = () => {
    auth.signOut();
    navigator("/");
  };

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const submitHandler = async (event) => {
    // event.preventDefault();
    try {
      if (auth.currentUser.displayName !== name) {
        //Updating displayName in the Firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        //Updating name in the Firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("User details updated!");
    } catch (error) {
      toast.error("Couldn't update user details!");
    }
  };

  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form onSubmit={submitHandler}>
            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeDetail}
              onChange={onNameChange}
              className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
                changeDetail && "bg-red-200 focus:bg-red-200"
              }`}
            />
            <input
              type="email"
              id="email"
              value={email}
              disabled={!changeDetail}
              onChange={onEmailChange}
              className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
            />
            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
              <p className="flex items-center">
                Edit your name?
                <span
                  onClick={() => {
                    changeDetail && submitHandler();
                    setChangeDetail((prevState) => !prevState);
                  }}
                  className="text-red-600 hover:text-red-800 transition ease-in-out duration-200 ml-1 cursor-pointer">
                  {changeDetail ? "Apply change" : "Edit"}
                </span>
              </p>
              <p
                onClick={logoutHandler}
                className="text-blue-600 hover:text-blue-800 transition ease-in-out duration-200 cursor-pointer">
                Sign out
              </p>
            </div>
          </form>
          <button
            type="submit"
            className="w-full bg-blue-600  text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800 sl">
            <Link
              to="/create-listing"
              className="flex justify-center items-center">
              <FcHome className="p1 mr-2 text-3xl rounded-full bg-red-200 border-2" />
              Sell or rent your home
            </Link>
          </button>
        </div>
      </section>
    </>
  );
};

export default Profile;
