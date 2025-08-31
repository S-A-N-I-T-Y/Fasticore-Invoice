export type Item = {
  quantity: number;
  description: string;
  price: number;
  amount: number;
};
export type From = {
  name: string;
  address: string;
  state: string;
};
export type To = {
  name: string;
  address: string;
  state: string;
};

export type Invoice = {
  id: string;
  companyName: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  items: Item[];
  from: From;
  to: To;
  subTotal: number;
  discount: number;
  tax: number;
  logoUrl: string;
  signatureUrl: string;
};
