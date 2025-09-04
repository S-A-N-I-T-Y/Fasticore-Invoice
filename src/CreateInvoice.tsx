import { useEffect, useRef, useState } from "react";
import type { Invoice, Item } from "./types/InvoiceType";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon, Trash2, Upload } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import { useDispatch } from "react-redux";
import { addInvoice, updateInvoice } from "./store/InvoiceSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

let invoiceCounter = 0;
const now = new Date();
const todaysDate = now.toISOString().split("T")[0];

const generateInvoiceNumber = () => {
  invoiceCounter++;
  const year = new Date().getFullYear();

  return `INV${year}-${String(invoiceCounter).padStart(4, "0")}`;
};

const generateInvoiceId = () => {
  return (
    `INV_` + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
  );
};

const CreateInvoice = () => {
  const location = useLocation();
  const editingInvoice: Invoice = location.state?.inv;
  const sigCanvas: React.RefObject<SignatureCanvas | null> = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [invoice, setInvoice] = useState<Invoice>(() => {
    if (editingInvoice) return editingInvoice;
    return {
      id: generateInvoiceId(),
      companyName: "Fasticore Technology",
      invoiceNo: generateInvoiceNumber(),
      invoiceDate: `${todaysDate}`,
      dueDate: "",
      items: [],
      from: {
        name: "Fasticore Technologies",
        address: "Port-Harcout",
        state: "Rivers, Nigeria",
      },
      to: {
        name: "Okpara Justin",
        address: "Independence Layout",
        state: "Enugu, Nigeria",
      },
      subTotal: 0,
      discount: 0,
      tax: 0,
      discountAmount: 0,
      taxAmount: 0,
      total: 0,
      logoUrl: "String",
      signatureUrl: "String",
    };
  });

  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef: any = useRef(null);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    if (!file) return;

    // validate file type
    if (!file.type.startsWith("image/")) {
      toast("Please select a valid image file", {
        action: { label: "Close", onClick: () => console.log("close") },
      });
      return;
    }

    // validate size
    if (file.size > 5 * 1024 * 1024) {
      toast("File size must be less than 5MB", {
        action: { label: "Close", onClick: () => console.log("close") },
      });
      return;
    }

    // special case: SVG → rasterize to high-quality PNG
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const svgText = reader.result as string;
        const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
          const scale = 4;
          const canvas = document.createElement("canvas");
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.setTransform(scale, 0, 0, scale, 0, 0);
            ctx.drawImage(img, 0, 0);
          }
          const pngBase64 = canvas.toDataURL("image/png");
          setInvoice({ ...invoice, logoUrl: pngBase64 });
        };
        img.src = url;
      };
      return;
    }

    //  default: JPG, PNG, WebP, etc.
    const imageUrl = URL.createObjectURL(file);
    setInvoice({ ...invoice, logoUrl: imageUrl });
  };

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [
        ...invoice.items,
        { quantity: 0, description: "", price: 0, amount: 0, name: "" },
      ],
    });
  };

  const updateFields = (field: keyof Invoice, value: string) => {
    if (field === "discount" || field === "tax") {
      let newValue = Number(value);
      setInvoice({ ...invoice, [field]: newValue });
    }
    // setInvoice({ ...invoice, [field]: value });
  };

  // Handle key press to prevent invalid characters in real-time
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTableDataCellElement>,
    field: keyof Item | keyof Invoice
  ) => {
    const char = e.key;
    const currentValue = e.currentTarget.textContent || "";

    // Allow control keys (backspace, delete, arrow keys, etc.)
    if (
      e.ctrlKey ||
      e.metaKey ||
      e.altKey ||
      [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
        "Enter",
      ].includes(char)
    ) {
      return;
    }

    // For numeric fields, only allow numbers and decimal point
    if (
      field === "quantity" ||
      field === "price" ||
      field === "discount" ||
      field === "tax"
    ) {
      const isNumber = /[0-9]/.test(char);
      const isDecimal = char === "." && !currentValue.includes(".");

      if (!isNumber && !isDecimal) {
        e.preventDefault();
      }
    }
  };

  const updateItems = (index: number, field: keyof Item, value: string) => {
    const newItems: Item[] = [...invoice.items];

    const item = { ...newItems[index], [field]: value };

    if (field === "quantity" || field === "price") {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      item.amount = qty * price;
    }

    newItems[index] = item;

    // const total = newItems.reduce((a, b) => a + Number(b.amount), 0);

    setInvoice({ ...invoice, items: newItems });
  };

  const deleteItems = (index: number) => {
    const updatedItems = invoice.items.filter((_, i) => i !== index);
    // const newSubtotal = updatedItems.reduce((a, b) => a + Number(b.amount), 0);

    setInvoice({ ...invoice, items: updatedItems });
  };

  useEffect(() => {
    const subTotal = invoice.items.reduce((a, b) => a + Number(b.amount), 0);

    let discountAmount = 0;

    discountAmount = (invoice.discount * subTotal) / 100;

    discountAmount = Math.min(discountAmount, subTotal);

    const taxableAmount = subTotal - discountAmount;
    const taxAmount = (taxableAmount * invoice.tax) / 100;

    const total = taxableAmount + taxAmount;
    setInvoice({
      ...invoice,
      subTotal,
      discountAmount,
      taxAmount,
      total,
    });
  }, [invoice.discount, invoice.items, invoice.tax]);

  const generateCanvasUrl = () => {
    if (sigCanvas.current) {
      const sigUrl = sigCanvas.current?.getCanvas().toDataURL("image/png");
      setInvoice({ ...invoice, signatureUrl: sigUrl });
    }
  };

  const handleSave = () => {
    dispatch(addInvoice(invoice));
    setTimeout(() => {
      toast("Invoice has been saved", {
        description: "Invoice saved ",
        action: {
          label: "Close",
          onClick: () => console.log("Invoice Saved"),
        },
      });
      navigate("/invoices");
    }, 1000);
  };

  const handleUpdate = () => {
    dispatch(updateInvoice(invoice));

    setTimeout(() => {
      toast("Invoice Updated", {
        action: {
          label: "close",
          onClick: () => console.log("Invoice updated"),
        },
      });
      navigate("/invoices");
    }, 1000);
  };

  return (
    <div>
      <div className="flex justify-center px-5 py-5 items-center min-h-screen bg-fasticore-blue">
        <div className="max-w-[550px] border-2 shadow-lg rounded-lg py-5 bg-white">
          <div className="flex justify-between items-center p-3 mx-5 mb-4 border bg-fasticore-blue">
            <h3
              className="text-xl font-semibold lg:text-2xl px-2 py-1 text-white rounded hover:outline-2 outline-gray-300"
              onBlur={(e) =>
                updateFields("companyName", e.currentTarget.textContent || "")
              }
              contentEditable
              suppressContentEditableWarning
            >
              {invoice.companyName}
            </h3>

            <div
              className="relative cursor-pointer group"
              onClick={handleLogoClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-transparent group-hover:border-blue-300 transition-all duration-200">
                <img width={60} height={60} src={invoice.logoUrl} />

                {isHovered && (
                  <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center rounded-lg">
                    <div className="text-white text-sm">
                      <Upload size={16} />
                    </div>
                  </div>
                )}

                {!invoice.logoUrl && (
                  <div className="absolute inset-0 bg-black hover:opacity-40 flex items-center justify-center rounded-lg">
                    <div className="text-white text-sm">
                      <Upload size={16} />
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e)}
                className="hidden"
              ></input>
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
                <span
                  className="hover:outline-2 outline-gray-300"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    updateFields("dueDate", e.currentTarget.textContent || "")
                  }
                >
                  {invoice.dueDate ? invoice.dueDate : "2025-11-01"}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-2 px-5">
            <Table className="table-fixed w-full mb-2">
              <TableHeader>
                <TableRow className="bg-fasticore-blue">
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Qty</TableHead>
                  <TableHead className=" lg:w-[150px] text-white">
                    Des
                  </TableHead>
                  <TableHead className="text-white">Price</TableHead>
                  <TableHead className="text-white">Amount</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border">
                {invoice.items.map((invItem, index) => (
                  <TableRow
                    key={index}
                    className={index % 2 !== 0 ? `bg-gray-300` : ""}
                  >
                    <TableCell
                      className="overflow-hidden overflow-ellipsis whitespace-nowrap hover:outline-blue-300 hover:outline "
                      suppressContentEditableWarning
                      contentEditable
                      onKeyDown={(e) => handleKeyPress(e, "name")}
                      onBlur={(e) =>
                        updateItems(
                          index,
                          "name",
                          e.currentTarget.textContent || ""
                        )
                      }
                    >
                      {invItem.name}
                    </TableCell>
                    <TableCell
                      className="hover:outline-blue-300 hover:outline "
                      suppressContentEditableWarning
                      contentEditable
                      onKeyDown={(e) => handleKeyPress(e, "quantity")}
                      onBlur={(e) =>
                        updateItems(
                          index,
                          "quantity",
                          e.currentTarget.textContent || ""
                        )
                      }
                    >
                      {invItem.quantity}
                    </TableCell>
                    <TableCell
                      className="overflow-hidden overflow-ellipsis whitespace-nowrap  hover:outline-blue-300 hover:outline"
                      suppressContentEditableWarning
                      contentEditable
                      onBlur={(e) =>
                        updateItems(
                          index,
                          "description",
                          e.currentTarget.textContent || ""
                        )
                      }
                    >
                      {invItem.description}
                    </TableCell>

                    <TableCell
                      className=" hover:outline-blue-300 hover:outline"
                      suppressContentEditableWarning
                      contentEditable
                      onKeyDown={(e) => handleKeyPress(e, "price")}
                      onBlur={(e) =>
                        updateItems(
                          index,
                          "price",
                          e.currentTarget.textContent || ""
                        )
                      }
                    >
                      {invItem.price}
                    </TableCell>
                    <TableCell
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        updateItems(
                          index,
                          "amount",
                          e.currentTarget.textContent || ""
                        )
                      }
                    >
                      {invItem.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <Trash2
                        onClick={() => deleteItems(index)}
                        className="cursor-pointer hover:text-red-400 transition-all duration-200 "
                        size={20}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <button
              className="cursor-pointer mt-2 inline-flex text-fasticore-blue"
              onClick={() => addItem()}
            >
              <PlusIcon size={20} /> Add Item
            </button>
          </div>

          <div className="mb-4 px-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Discount (%)</TableHead>
                  <TableHead>Tax (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell
                    onKeyDown={(e) => handleKeyPress(e, "discount")}
                    onBlur={(e) =>
                      updateFields(
                        "discount",
                        e.currentTarget.textContent || ""
                      )
                    }
                    contentEditable
                    suppressContentEditableWarning
                    className="border-2 w-1/2"
                  >
                    {invoice.discount}
                  </TableCell>
                  <TableCell
                    onKeyDown={(e) => handleKeyPress(e, "tax")}
                    onBlur={(e) =>
                      updateFields("tax", e.currentTarget.textContent || "")
                    }
                    contentEditable
                    suppressContentEditableWarning
                    className="border-2 w-1/2 "
                  >
                    {invoice.tax}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between mb-4 px-5 text-sm lg:text-base">
            <div>
              <div className="mb-4">
                <p>From</p>
                <p
                  className="font-light text-gray-400  hover:outline-2 outline-gray-300"
                  suppressContentEditableWarning
                  contentEditable
                >
                  {invoice.from.name}
                </p>
                <p
                  className="font-light text-gray-400  hover:outline-2 outline-gray-300"
                  suppressContentEditableWarning
                  contentEditable
                >
                  {invoice.from.address}
                </p>
                <p
                  className="font-light text-gray-400  hover:outline-2 outline-gray-300"
                  suppressContentEditableWarning
                  contentEditable
                >
                  {invoice.from.state}
                </p>
              </div>
              <div className="mb-4">
                <p>To</p>
                <p
                  className="font-light text-gray-400  hover:outline-2 outline-gray-300"
                  suppressContentEditableWarning
                  contentEditable
                >
                  {invoice.to.name ? invoice.to.name : "Name"}
                </p>
                <p
                  className="font-light text-gray-400  hover:outline-2 outline-gray-300"
                  suppressContentEditableWarning
                  contentEditable
                >
                  {" "}
                  {invoice.to.address}
                </p>
                <p
                  className="font-light text-gray-400  hover:outline-2 outline-gray-300"
                  suppressContentEditableWarning
                  contentEditable
                >
                  {invoice.to.state}
                </p>
              </div>
            </div>

            <div className="text-[13px]">
              <div className="flex justify-between gap-2  ">
                <p className="uppercase ">sub-total:</p>
                <span className=" text-right">
                  {invoice.subTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <p className="uppercase ">Discount({invoice.discount}%):</p>
                <span
                  className=" hover:outline-2 outline-gray-300 w-full text-right"
                  suppressContentEditableWarning
                  contentEditable
                >
                  {invoice.discountAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between gap-2  mb-4">
                <p className="uppercase ">Tax({invoice.tax}%):</p>
                <span
                  suppressContentEditableWarning
                  contentEditable
                  className="w-full text-right  hover:outline-2 outline-gray-300"
                >
                  {invoice.taxAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between gap-2 font-medium bg-gray-200 px-6 py-2 text-base">
                <p className="uppercase ">Total:</p>
                <span className="w-full text-right ">
                  {invoice.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-5">
            {editingInvoice ? (
              <button
                onClick={() => handleUpdate()}
                className="bg-blue-500 font-bold px-3 py-1.5 mt-4 rounded text-white cursor-pointer transition-colors duration-300 hover:bg-blue-600"
              >
                update
              </button>
            ) : (
              <button
                onClick={() => handleSave()}
                className="bg-blue-500 font-bold px-3 py-1.5 mt-4  rounded text-white cursor-pointer transition-colors duration-300 hover:bg-blue-600"
              >
                Save
              </button>
            )}

            <div>
              <div className="border-b">
                <SignatureCanvas
                  ref={sigCanvas}
                  onEnd={() => generateCanvasUrl()}
                  canvasProps={{
                    width: 150,
                    height: 40,
                    className: "sigCanvas",
                  }}
                ></SignatureCanvas>
              </div>
              <p className="text-center text-sm lg:text-base">Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
