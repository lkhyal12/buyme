import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { getErrorMsg } from "../lib/utils";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import ProductCard from "./ProductCard";
const PeopleAlsoBought = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/products/recommendations");
        console.log(response);
        setRecommendations(response.data.products);
      } catch (err) {
        const errorMsg = getErrorMsg(err);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecommendations();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">
        People also bought
      </h3>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((item) => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
