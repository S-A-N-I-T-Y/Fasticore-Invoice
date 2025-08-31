import type { Invoice } from "./types/InvoiceType";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";
import InvoicePDF from "./InvoicePDF";

const InvoicePage = () => {
  const location = useLocation();
  const invoice: Invoice = location.state?.inv;
  console.log(invoice);

//   const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-center px-5 py-5 items-center min-h-screen">
        <div className="max-w-[550px] shadow-lg rounded-lg py-5">
          <div className="flex justify-between items-center p-3 mx-5 mb-4 border bg-blue-400">
            <h3 className="text-xl font-semibold lg:text-2xl px-2 py-1 text-white rounded ">
              {invoice.companyName}
            </h3>

            <div className="relative cursor-pointer group">
              <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-transparent group-hover:border-blue-300 transition-all duration-200">
                <img width={60} src={invoice.logoUrl} alt="fasticore logo" />
              </div>
            </div>
          </div>

          <div className="flex justify-end px-5 mb-4 text-sm lg:text-base">
            <div className="text-sm text-slate-400">
              <div className="flex gap-2">
                <p>Invoice No:</p>
                <span>{invoice.invoiceNo}</span>
              </div>
              <div className="flex gap-2">
                <p>Invoice Date:</p>
                <span>{invoice.invoiceDate}</span>
              </div>
              <div className="flex justify-between gap-2">
                <p>Due-Date:</p>
                <span>{invoice.dueDate ? invoice.dueDate : "2025-11-01"}</span>
              </div>
            </div>
          </div>

          <div className="mb-4 px-5">
            <Table className="table-fixed w-full mb-2">
              <TableHeader>
                <TableRow className="bg-blue-400">
                  <TableHead className="text-white">Qty</TableHead>
                  <TableHead className="lg:w-[200px] text-white">
                    Desription
                  </TableHead>
                  <TableHead className="text-white">Price</TableHead>
                  <TableHead className="text-white text-right">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((invItem, index) => (
                  <TableRow key={index}>
                    <TableCell>{invItem.quantity}</TableCell>
                    <TableCell className="overflow-hidden overflow-ellipsis whitespace-nowrap ">
                      {invItem.description}
                    </TableCell>
                    <TableCell>{invItem.price}</TableCell>
                    <TableCell className="text-right">
                      {invItem.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between mb-4 px-5 text-sm lg:text-base">
            <div>
              <div className="mb-4">
                <p>From</p>
                <p className="font-light text-gray-400  ">
                  {invoice.from.name}
                </p>
                <p className="font-light text-gray-400 ">
                  {invoice.from.address}
                </p>
                <p className="font-light text-gray-400  ">
                  {invoice.from.state}
                </p>
              </div>
              <div className="mb-4">
                <p>To</p>
                <p className="font-light text-gray-400 ">
                  {invoice.to.name ? invoice.to.name : "Name"}
                </p>
                <p className="font-light text-gray-400  ">
                  {" "}
                  {invoice.to.address}
                </p>
                <p className="font-light text-gray-400  ">{invoice.to.state}</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between gap-2 font-medium ">
                <p className="uppercase ">sub-total:</p>
                <span className=" text-right">
                  {invoice.subTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between gap-2 font-medium text ">
                <p className="uppercase ">Discount:</p>
                <span className=" hover:outline-2 outline-gray-300 w-full text-right">
                  {invoice.discount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between gap-2 font-medium">
                <p className="uppercase ">Tax:</p>
                <span className="w-full text-right  ">
                  {invoice.tax.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-5">
            {/* <button
              onClick={() => navigate("/preview", { state: { invoice } })}
              className="bg-blue-400 font-bold px-3 py-1.5 mt-4  rounded text-white cursor-pointer transition-colors duration-300 hover:bg-blue-500"
            >
              Download PDF
            </button> */}

            <PDFDownloadLink
              className="bg-blue-400 font-bold px-3 py-1.5 mt-4  rounded text-white cursor-pointer transition-colors duration-300 hover:bg-blue-500"
              document={
                <InvoicePDF
                  invoice={invoice}
                  logoUrl={invoice.logoUrl}
                  signatureUrl={invoice.signatureUrl}
                />
              }
              fileName={`Invoice-${invoice.id}.pdf`}
            >
              {({ loading }) => (loading ? "loading Document" : "Download PDF")}
            </PDFDownloadLink>

            <div>
              <div className="border-b">
                <img src={invoice.signatureUrl} />
              </div>
              <p className="text-center text-sm lg:text-base">Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
