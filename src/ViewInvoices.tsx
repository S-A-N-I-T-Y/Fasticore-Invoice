import { useNavigate } from "react-router-dom";
import { deleteInvoice } from "./store/InvoiceSlice";
import { Edit2,Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { Download } from "lucide-react";

const ViewInvoices = () => {
  const { invoices } = useSelector((state: RootState) => state.invoices);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div>
      <div className="min-h-screen p-5">
        <div className="flex justify-between mb-5">
          <p className="text-base font-semibold lg:text-3xl">Saved Invoices</p>
          <button
            onClick={() => navigate("/create-invoice")}
            className="bg-fasticore-blue font-bold text-white px-3 py-2 rounded cursor-pointer transition-all duration-500 hover:scale-95"
          >
            Create Invoice
          </button>
        </div>
        <div>
          <div className="mb-5">
            {invoices.length === 0 ? (
              <p>No Invoices Found</p>
            ) : (
              <p>Invoices Found: {invoices.length}</p>
            )}
          </div>
          <div className="flex flex-col items-center">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex w-[100%] md:w-[80%] lg:w-[60%] border justify-between shadow-lg rounded-lg p-4 mb-4 lg:p-10 transition-all duration-700 hover:scale-[.98] cursor-pointer"
              >
                <div>
                  <span>{inv.invoiceNo}</span>-<span>{inv.to.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm lg:gap-5">
                  <Trash2
                    onClick={() => dispatch(deleteInvoice(inv.id))}
                    size={20}
                    className="text-red-500 transition-all animation-duration-initial hover:animate-bounce"
                  />
                  <Edit2
                    size={20}
                    onClick={() =>
                      navigate("/create-invoice", { state: { inv } })
                    }
                    className="text-amber-500 transition-all animation-duration-initial hover:animate-pulse"
                  />
                  <Download className=" rounded text-blue-300 cursor-pointer transition-colors duration-300 hover:text-blue-500">
                    <PDFDownloadLink
                      className=""
                      document={
                        <InvoicePDF
                          invoice={inv}
                          logoUrl={inv.logoUrl}
                          signatureUrl={inv.signatureUrl}
                        />
                      }
                      fileName={`Invoice-${inv.id}.pdf`}
                    >
                      {({ loading }) =>
                        loading ? "loading Document" : "Download PDF"
                      }
                    </PDFDownloadLink>
                  </Download>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoices;
