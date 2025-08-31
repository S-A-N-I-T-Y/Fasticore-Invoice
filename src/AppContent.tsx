import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import CreateInvoice from "./CreateInvoice";
import ViewInvoices from "./ViewInvoices";
import InvoicePage from "./InvoicePage";
import InvoicePreview from "./InvoicePreview";

const AppContent = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-invoice" element={<CreateInvoice />} />
          <Route path="/invoices" element={<ViewInvoices />} />
          <Route path="/invoice" element={<InvoicePage />} />
          <Route path="/preview" element={<InvoicePreview />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default AppContent;
