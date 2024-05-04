"use client";

import React, { useState } from "react";
import styles from "./Operations.module.scss";
import FeedbackList from "../FeedbackList/FeedbackList";
import axios from "../../axios/api";

const Operations = () => {
  const [dbUri, setDBUri] = useState("");
  const [Loading, setLoading] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("userDB", { dbUri });
      console.log("DBUri", dbUri);

      if (res.status === 200) {
        console.log("Connected to MongoDB and data processed");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.Operations}>
      <h2>Transform your Data 📊✅</h2>
      <form onSubmit={handleSubmit} action="">
        <input
          type="text"
          placeholder="Enter Database URI"
          onChange={(e) => setDBUri(e.target.value)}
          value={dbUri}
        />
        <button type="submit">Connect DB</button>
      </form>
      {Loading === true && (
        <p className={styles.connecting}>Connecting DB...</p>
      )}
      {Loading === false && <p className={styles.connected}>Db Connected ✅</p>}
      {Loading === null && (
        <p className={styles.enteruri}>Enter a DB URI to connect 🧑🏻‍💻 </p>
      )}

      <FeedbackList />
    </div>
  );
};

export default Operations;
