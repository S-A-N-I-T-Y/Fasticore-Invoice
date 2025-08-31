import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Invoice } from "@/types/InvoiceType";

export interface InitialState {
  invoices: Invoice[];
}

// const initialState: InitialState = {
//   invoices: [],
// };


export const loadState = (): { invoices: Invoice[] } => {
  const serializedState = localStorage.getItem("invoices");
  if (!serializedState) {
    return {
      invoices: [],
    };
  } else {
    return JSON.parse(serializedState);
  }
};

export const saveState = (state: InitialState) => {
  // SerializingState
  const serializedState = JSON.stringify(state);
  // Saving invoiceSerializedState
  localStorage.setItem("invoices", serializedState);
};

const initialState: InitialState = loadState();

export const InvoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      const newInvoice: Invoice = { ...action.payload };
      state.invoices.push(newInvoice);
      saveState(state);
    },
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      const updatedInvoice = { ...action.payload };
      const index = state.invoices.findIndex(
        (inv) => inv.id === updatedInvoice.id
      );

      if (index !== -1) {
        state.invoices[index] = updatedInvoice;
      }

      saveState(state);
    },
    deleteInvoice: (state, action: PayloadAction<string>) => {
      state.invoices = state.invoices.filter(
        (inv) => inv.id !== action.payload
      );

      saveState(state);
    },
  },
});

export const { addInvoice, updateInvoice, deleteInvoice } =
  InvoiceSlice.actions;

export default InvoiceSlice.reducer;
