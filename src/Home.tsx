import { Link } from "react-router-dom";
import "./index.css";

const Home = () => {
  return (
    <div className=" min-h-[100vh] flex flex-col justify-center items-center ">
      <div className="flex gap-5">
        <Link
          className=" bg-blue-600 text-white p-2 rounded shadow transition-all duration-300 hover:scale-110"
          to="/create-invoice"
        >
          Create Invoice
        </Link>
        <Link
          className=" bg-red-600 text-white p-2 rounded shadow transition-all duration-300 hover:scale-110"
          to="/invoices"
        >
          View Invoices
        </Link>
      </div>
    </div>
  );
};

export default Home;
