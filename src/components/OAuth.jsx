import React from "react";
import { FcGoogle } from "react-icons/fc";

const OAuth = () => {
  return (
    <button className="flex items-center justify-center w-full bg-red-600 font-semibold uppercase px-7 py-3 text-white rounded text-sm hover:bg-red-700 transition duration-150 ease-in-out active:bg-red-800 shadow-md hover:shadow-lg">
      <FcGoogle className="bg-white rounded-lg mr-1 text-lg" />
      Continue with Google
    </button>
  );
};

export default OAuth;
