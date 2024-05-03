"use client";

import React, { useEffect, useState } from "react";
import axios from "../../axios/api";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      const { data } = await axios.get("feedback"); // Ensure this points to your API that fetches processed feedback
      setFeedbacks(data);
    };
    fetchFeedback();
  }, []);

  console.log("feedbacks", feedbacks);

  return <div>FeedbackList</div>;
};

export default FeedbackList;
