import React, { useState } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const nameChangeHandler = (event) => {
    const enteredName = event.target.value;
    setName(enteredName);
  };

  const emailChangeHandler = (event) => {
    const enteredEmail = event.target.value;
    setEmail(enteredEmail);
  };

  const passwordChangeHandler = (event) => {
    const enteredPassword = event.target.value;
    setPassword(enteredPassword);
  };

  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">Sign Up</h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80"
            alt="key"
            className="w-full rounded-2xl"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form>
            <input
              className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
              type="name"
              id="name"
              value={name}
              onChange={nameChangeHandler}
              placeholder="Your Name"
            />
            <input
              className="mb-6 w-full px-4 py-2 text-xl text-gray-700  border-gray-300  bg-white rounded transition ease-in-out"
              type="email"
              id="email"
              value={email}
              onChange={emailChangeHandler}
              placeholder="Email ID"
            />
            <div className="relative mb-6">
              <input
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={passwordChangeHandler}
                placeholder="Password"
              />
              {showPassword ? (
                <BsEyeSlashFill
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              ) : (
                <BsEyeFill
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              )}
            </div>
            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
              <p className="mb-6 text-sm">
                Already have an account?
                <Link
                  to="/sign-in"
                  className="text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1">
                  Sign in
                </Link>
              </p>
              <p className="text-sm">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-700 transition duration-200 ease-in-out">
                  Forgot Password?
                </Link>
              </p>
            </div>
            <button className="w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800">
              Sign up
            </button>
            <div className="my-4  items-center before:border-t flex before:flex-1 before:border-gray-400 after:border-t after:flex-1 after:border-gray-400">
              <p className="text-center font-semibold mx-4">OR</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
