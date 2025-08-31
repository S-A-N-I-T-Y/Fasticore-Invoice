import { PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { useLocation } from "react-router-dom";
import type { Invoice } from "./types/InvoiceType";

const InvoicePreview = () => {
  const location = useLocation();
  const invoice: Invoice = location.state?.invoice;
  return (
    <PDFViewer width={500} height={600}>
      <InvoicePDF
        invoice={invoice}
        logoUrl={invoice.logoUrl}
        signatureUrl={invoice.signatureUrl}
      />
    </PDFViewer>
  );
};

export default InvoicePreview;
