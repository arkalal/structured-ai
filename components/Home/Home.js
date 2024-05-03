"use client";

import React, { useState } from "react";
import axios from "../../axios/api";
import FeedbackList from "../FeedbackList/FeedbackList";

const Home = () => {
  const [dbUri, setDBUri] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("userDB", { dbUri });
      console.log("DBUri", dbUri);

      if (res.status === 200) {
        console.log("Connected to MongoDB and data processed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} action="">
        <input
          type="text"
          placeholder="Enter Database URI"
          onChange={(e) => setDBUri(e.target.value)}
        />
        <button type="submit">Connect DB</button>
      </form>

      <FeedbackList />
    </div>
  );
};

export default Home;
