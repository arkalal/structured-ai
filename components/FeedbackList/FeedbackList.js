"use client";

import React, { useEffect, useState } from "react";
import axios from "../../axios/api";
import styles from "./FeedbackList.module.scss";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchData = async () => {
    const { data } = await axios.get("feedback");
    setFeedbacks(data);
  };

  console.log("feedbacks", feedbacks);

  return (
    <div className={styles.FeedbackList}>
      <button onClick={fetchData}>Get structured Data</button>
      {feedbacks && feedbacks.length > 1 ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Feedback</th>
                <th>Sentiment</th>
                <th>Complaints</th>
                <th>Switched To</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map(
                ({ _id, feedback, sentiment, complaints, switchedTo }) => (
                  <tr key={_id}>
                    <td>{feedback}</td>
                    <td>{sentiment}</td>
                    <td>{complaints.join(", ")}</td>
                    <td>{switchedTo}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <h2>No data available 😇🧑🏻‍💻📈 </h2>
        </>
      )}{" "}
    </div>
  );
};

export default FeedbackList;
