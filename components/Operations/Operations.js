"use client";

import React, { useState } from "react";
import styles from "./Operations.module.scss";
import FeedbackList from "../FeedbackList/FeedbackList";
import axios from "../../axios/api";

const Operations = () => {
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
    <div className={styles.Operations}>
      <form onSubmit={handleSubmit} action="">
        <input
          type="text"
          placeholder="Enter Database URI"
          onChange={(e) => setDBUri(e.target.value)}
          value={dbUri}
        />
        <button type="submit">Connect DB</button>
      </form>

      <FeedbackList />
    </div>
  );
};

export default Operations;
