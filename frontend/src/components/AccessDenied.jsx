import { Link } from "react-router-dom";

const AccessDenied = () => {
  return (
    <div className="w-full h-dvh flex items-center justify-center">
      <div className="flex flex-col items-center relative z-20">
        <h2 className="max-w-2xl font-semibold text-3xl sm:text-4xl lg:text-5xl text-red-600 text-center mb-5 leading-normal">
          Access Denied You Must Be An Admin To Get To This Page
        </h2>
        <Link
          to="/"
          className="bg-emerald-500  text-white px-10 py-2 font-semibold text-lg rounded-lg"
        >
          Go To Home Page
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
