"use client";

import React, { useState } from "react";
import axios from "../../axios/api";

const Home = () => {
  const [dbUri, setDBUri] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("userDB", { dbUri });
      console.log("DBUri", dbUri);

      if (res.status === 200) {
        alert("Connected to MongoDB");
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
    </div>
  );
};

export default Home;
