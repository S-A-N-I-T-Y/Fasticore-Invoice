import { configureStore } from "@reduxjs/toolkit";
import invoiceReducer from "./InvoiceSlice";

export const store = configureStore({
  reducer: {
    invoices: invoiceReducer,
  },
});
// Infering rootstate and app dispatch types from store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred Type
export type AppDispatch = typeof store.dispatch;
