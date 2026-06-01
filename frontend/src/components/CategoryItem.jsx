import React from "react";
import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
  console.log(category);
  return (
    <div className="relative h-80 lg:h-96 rounded-lg overflow-hidden  w-full ">
      <Link to={`/category${category.href}`}>
        <div className="h-full w-full cursor-pointer">
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-gray-900 opacity-90 z-20">
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-110 "
              //   loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-black/20">
              <h3 className="text-white text-2xl font-bold mb-2">
                {category.name}
              </h3>
              <p className="text-gray-200 text-sm">Explore {category.name}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryItem;
