import { Link } from "react-router-dom";
import "./index.css";

const Home = () => {
  return (
    <div className=" min-h-[100vh] flex justify-center items-center bg-fasticore-blue">
      <div className="">
        <div className="mb-4">
          <h1 className="text-3xl lg:text-6xl  text-center text-white font-bungee font-bold">
            F-Invoicer
          </h1>
          <p className="text-center text-white">Keeping your invoicing and payments <br /> simple and secure!</p>
        </div>
        <div className="flex justify-center gap-5">
          <Link
            className=" bg-blue-700 text-white px-4 py-2 rounded shadow transition-all duration-300 hover:scale-110"
            to="/create-invoice"
          >
            Create Invoice
          </Link>
          <Link
            className=" bg-white text-black p-2 rounded shadow transition-all duration-300 hover:scale-110"
            to="/invoices"
          >
            View Invoices
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
