import React, { useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const navigator = useNavigate();
  const auth = getAuth();
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const onChange = (event) => {
    let boolean = null;
    if (event.target.value === "true") {
      boolean = true;
    }
    if (!event.target.value === "false") {
      boolean = false;
    }
    //Files
    if (event.target.files) {
      setFormData((prevData) => ({
        ...formData,
        images: event.target.files,
      }));
    }
    //Text/Boolean/Number
    if (!event.target.files) {
      setFormData((prevData) => ({
        ...prevData,
        [event.target.id]: boolean ?? event.target.value,
      }));
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (+formData.discountedPrice >= +formData.regularPrice) {
      setLoading(false);
      toast.error("Discounted price needs to be less than Regular Price.");
      return;
    }

    if (formData.images.length > 6) {
      setLoading(false);
      toast.error("Max 6 images are allowed!");
      return;
    }

    let geolocation = {};
    let location;
    if (geolocationEnabled) {
      const resp = await fetch(
        `https://maps.googleapi.com/maps/api/geocode/json?address=${formData.address}&key=${process.env.REALTOR_CLONE_GEOCODE_API_KEY}`
      );
      const data = await resp.json();
      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location = data.status === "ZERO_RESULTS" && undefined;

      if (location === undefined || location.includes("undefined")) {
        setLoading(false);
        toast.error("Please enter a correct address!");
        return;
      } else {
        geolocation.lat = formData.latitude;
        geolocation.lng = formData.longitude;
      }
    }

    const storeImage = (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...formData.images].map((image) => storeImage(image))
    ).catch((err) => {
      setLoading(false);
      toast.error("Images not uploaded!");
      return;
    });
    const formDataCopy = {
      ...formData,
      imageUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing created!");
    navigator(`/category/${formDataCopy.type}/${docRef}`);
  };

  const sellRentButtonClasses =
    "px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full";

  const inputClasses =
    "w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center";

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="max-w-md px-2 mx-auto ">
      <h1 className="text-3xl text-center mt-6 font-bold">Create a Listing</h1>
      <form onSubmit={submitHandler}>
        <p className="text-lg mt-6 font-semibold">Sell / Rent</p>
        <div className="flex">
          <button
            type="button"
            id="type"
            value="sell"
            onClick={onChange}
            className={`mr-3 ${sellRentButtonClasses} ${
              formData.type === "rent"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}>
            sell
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={`ml-3 ${sellRentButtonClasses} ${
              formData.type === "sell"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}>
            rent
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Name</p>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={onChange}
          placeholder="Name"
          max="32"
          minLength="10"
          required
          className={`${inputClasses} "mb-6 text-xl"`}
        />
        <div className="flex space-x-6 mb-6">
          <div>
            <p className="text-lg font-semibold">Bedrooms</p>
            <input
              type="number"
              id="bedrooms"
              value={formData.bedrooms}
              onChange={onChange}
              min="1"
              max="20"
              required
              className={`${inputClasses} "text-lg"`}
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Bathrooms</p>
            <input
              type="number"
              id="bathrooms"
              value={formData.bathrooms}
              onChange={onChange}
              min="1"
              max="20"
              required
              className={`${inputClasses}`}
            />
          </div>
        </div>
        <p className="text-lg mt-6 font-semibold">Parking spot</p>
        <div className="flex">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
            className={`mr-3 ${sellRentButtonClasses} ${
              !formData.parking
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}>
            Yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={`ml-3 ${sellRentButtonClasses} ${
              formData.parking
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}>
            No
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Furnished</p>
        <div className="flex">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={`mr-3 ${sellRentButtonClasses} ${
              !formData.furnished
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}>
            Yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={`ml-3 ${sellRentButtonClasses} ${
              formData.furnished
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}>
            No
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Address</p>
        <textarea
          type="text"
          id="address"
          value={formData.address}
          onChange={onChange}
          placeholder="Address"
          required
          className={`${inputClasses} "mb-6 text-xl"`}
        />
        {!geolocationEnabled && (
          <div className="flex space-x-6 justify-start mb-6">
            <div>
              <p className="text-lg font-semibold ">Latitude: </p>
              <input
                type="number"
                id="latitude"
                value={formData.latitude}
                onChange={onChange}
                required
                min="-90"
                max="90"
                className={`${inputClasses} "text-xl"`}
              />
            </div>
            <div>
              <p className="text-lg font-semibold ">Longitude: </p>
              <input
                type="number"
                id="longitude"
                value={formData.longitude}
                onChange={onChange}
                required
                min="-180"
                max="180"
                className={`${inputClasses} "text-xl"`}
              />
            </div>
          </div>
        )}
        <p className="text-lg font-semibold">Description</p>
        <textarea
          type="text"
          id="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Description"
          required
          className={`${inputClasses} "mb-6 text-xl"`}
        />
        <p className="text-lg font-semibold">Offer</p>
        <div className="flex mb-6">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
            className={`mr-3 ${sellRentButtonClasses} ${
              !formData.offer
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}>
            Yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={`ml-3 ${sellRentButtonClasses} ${
              formData.offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}>
            No
          </button>
        </div>
        <div className="flex items-center mb-6">
          <div>
            <p className="text-lg font-semibold">Regular Price</p>
            <div className="flex w-full justify-center items-center space-x-6">
              <input
                type="number"
                id="regularPrice"
                value={formData.regularPrice}
                onChange={onChange}
                min="4000"
                max="4000000"
                required
                className={`${inputClasses} "text-xl"`}
              />
              {formData.type === "rent" && (
                <div>
                  <p className="text-md w-full whitespace-nowrap ">
                    Rs / Month
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {formData.offer && (
          <div className="flex items-center mb-6">
            <div>
              <p className="text-lg font-semibold">Discounted Price</p>
              <div className="flex w-full justify-center items-center space-x-6">
                <input
                  type="number"
                  id="discountedPrice"
                  value={formData.iscountedPrice}
                  onChange={onChange}
                  min="4000"
                  max="4000000"
                  required={formData.offer}
                  className={`${inputClasses} "text-xl"`}
                />
                {formData.type === "rent" && (
                  <div>
                    <p className="text-md w-full whitespace-nowrap ">
                      Rs / Month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="mb-6">
          <p className="text-lg font-semibold">Images</p>
          <p className="text-gray-600">
            The first image will be the cover (max 6)
          </p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg, .png, .jpeg"
            multiple
            required
            className={`${inputClasses} "px-3 py-1.5"`}
          />
        </div>
        <button
          type="submit"
          className="mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
          Create Listing
        </button>
      </form>
    </main>
  );
};

export default CreateListing;
