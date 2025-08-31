// InvoicePDF.tsx
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Invoice } from "./types/InvoiceType";

type invoiceProps = {
  invoice: Invoice;
  logoUrl: string;
  signatureUrl: string;
};

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    color: "#333",
  },
  container: {
    maxWidth: 350,
    margin: "0 auto",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  },
  header: {
    backgroundColor: "#60a5fa",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  logo: {
    width: 30,
    height: 30,
  },
  info: {
    margin: 10,
    fontSize: 10,
    color: "#6b7280",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  table: {
    width: "100%",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  tableHeader: {
    backgroundColor: "#60a5fa",
    color: "white",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  tableRow: {
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tableCell: {
    fontSize: 10,
    width: "25%",
    textAlign: "center",
  },
  section: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  textLight: {
    fontSize: 10,
    color: "#9ca3af",
  },
  totals: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    display: "flex",
    flexDirection: "row",
    margin: 10,
    justifyContent: "flex-end",
    textAlign: "center",
  },
  signature: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  signatureImg: {
    width: 100,
    height: 40,
    borderBottom: "1px solid black",
  },
  signatureLabel: {
    fontSize: 10,
    marginTop: 3,
  },
});

const InvoicePDF = ({ invoice, logoUrl, signatureUrl }: invoiceProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>{invoice.companyName}</Text>
          {logoUrl ? <Image src={logoUrl} style={styles.logo} /> : null}
        </View>

        {/* Invoice info */}
        <View style={styles.info}>
          <View style={styles.row}>
            <Text>Invoice No: </Text>
            <Text>{invoice.invoiceNo}</Text>
          </View>
          <View style={styles.row}>
            <Text>Invoice Date: </Text>
            <Text>{invoice.invoiceDate}</Text>
          </View>
          <View style={styles.row}>
            <Text>Due-Date: </Text>
            <Text>{invoice.dueDate || "2025-11-01"}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Qty</Text>
            <Text style={[styles.tableCell]}>Description</Text>
            <Text style={styles.tableCell}>Price</Text>
            <Text style={styles.tableCell}>Amount</Text>
          </View>
          {invoice.items.map((item, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={[styles.tableCell]}>{item.description}</Text>
              <Text style={styles.tableCell}>{item.price}</Text>
              <Text style={styles.tableCell}>{item.amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* From / To and Totals */}
        <View style={styles.section}>
          <View>
            <Text>From</Text>
            <Text style={styles.textLight}>{invoice.from.name}</Text>
            <Text style={styles.textLight}>{invoice.from.address}</Text>
            <Text style={styles.textLight}>{invoice.from.state}</Text>

            <Text style={{ marginTop: 5 }}>To</Text>
            <Text style={styles.textLight}>{invoice.to.name || "Name"}</Text>
            <Text style={styles.textLight}>{invoice.to.address}</Text>
            <Text style={styles.textLight}>{invoice.to.state}</Text>
          </View>

          <View>
            <View style={styles.totals}>
              <Text>SUB-TOTAL:</Text>
              <Text>{invoice.subTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totals}>
              <Text>DISCOUNT:</Text>
              <Text>{invoice.discount.toFixed(2)}</Text>
            </View>
            <View style={styles.totals}>
              <Text>TAX:</Text>
              <Text>{invoice.tax.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Signature */}
        <View style={styles.signatureBlock}>
          <View style={styles.signature}>
            <Image src={signatureUrl} style={styles.signatureImg} />
            <Text style={styles.signatureLabel}>Signature</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
