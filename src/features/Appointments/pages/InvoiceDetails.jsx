import { queryClient } from "@/common/queryClient";
import { redirect, useParams } from "react-router";
import { invoiceDetailsQuery } from "../queries";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ReceiptText } from "lucide-react";
import {  downloadInvoiceAsPdf, settleInvoice } from "../appointmentApi";
import toast from "react-hot-toast";

function InvoiceDetails() {
  const { invoiceId } = useParams();

  const query = useQuery(invoiceDetailsQuery(invoiceId));

  const settleInvoiceMutation = useMutation({
    mutationFn: (invoiceId) => settleInvoice(invoiceId),
    onSuccess: () => {
      toast.success("invoice settled successfully");
      queryClient.invalidateQueries({ queryKey: [invoiceId] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError:(error)=>{
      toast.error(error.response?.data?.title ?? "failed to settle invoice")
    }
  });

  const invoice = query.data;

  function settleInvoiceHandler() {
    settleInvoiceMutation.mutate(invoiceId)
  }
  function downloadPdfHandler()
  {
    downloadInvoiceAsPdf(invoiceId)
  }

  if (query.isLoading) {
    return <p>loading</p>;
  } else if (query.isError) {
    return <p>error</p>;
  }

  return (
    <div className="grid gap-1 p-2 ">
      <div className="flex gap-1 items-center bg-background">
        <div className="w-2 h-18 bg-border rounded-lg"></div>
        <div className="flex items-center justify-start gap-2">
          <ReceiptText />
          <h1 className="text-2xl  uppercase font-semibold text-text mb-1">
            Invoice Details
          </h1>
        </div>
      </div>
      {invoice.paymentStatus === "Unpaid" && (
        <div className="text-right px-2 py-6">
          <button className="primary-button" onClick={settleInvoiceHandler}>
            Settle Invoice
          </button>
        </div>
      )}
      {invoice.paymentStatus === "Paid" && (
        <div className="text-right px-2 py-6">
          <button className="primary-button" onClick={downloadPdfHandler}>
            Download pdf
          </button>
        </div>
      )}
      <section className="flex justify-between flex-wrap items-center p-4 border border-border-dark">
        <div className="flex justify-start items-center gap-1">
          <p>invoice id:</p>
          <p className="font-semibold">{invoice.invoiceId.slice(0, 8)}</p>
        </div>
        <div className="flex justify-start items-center gap-1">
          <p>customer:</p>
          <p className="font-semibold">{invoice.customer.name}</p>
        </div>
        <div className="flex justify-start items-center gap-1">
          <p>issued at:</p>
          <p className="font-semibold">
            {new Date(invoice.issuedAtUtc).toLocaleString()}
          </p>
        </div>
        <div className="flex justify-start items-center gap-1">
          <p>state:</p>
          <p
            className={`font-bold p-2 rounded-md ${invoice.paymentStatus === "Paid" ? "bg-green-400" : "bg-red-400"}`}
          >
            {invoice.paymentStatus}
          </p>
        </div>
      </section>
      <section className="mt-4 border-border-dark border">
        <table className="w-full text-left table-auto ">
          <thead>
            <tr>
              <th className="p-2">Description</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Unit Price</th>
              <th className="p-2">Line-Total</th>
            </tr>
          </thead>
          <tbody className="">
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td className="border border-border-dark p-2">
                  {item.description}
                </td>
                <td className="border border-border-dark p-2">
                  {item.quantity}
                </td>
                <td className="border border-border-dark p-2">
                  ${item.unitPrice}
                </td>
                <td className="border border-border-dark p-2">
                  ${item.lineTotal}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-lg">
          <div className="flex justify-end gap-2 p-4 border border-border-dark">
            <p>Sub-total:</p>
            <p className="font-bold">${invoice.subtotal}</p>
          </div>
          <div className="flex justify-end gap-2 p-4 border border-border-dark">
            <p>tax:</p>
            <p className="font-bold">${invoice.taxAmount}</p>
          </div>
          <div className="flex justify-end gap-2 p-4 border border-border-dark">
            <p>Descount:</p>
            <p className="font-bold">${invoice.discountAmount}</p>
          </div>
          <div className="flex justify-end gap-2 p-4 border border-border-dark">
            <p>Total:</p>
            <p className="font-bold">${invoice.total}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function loader({ params }) {
  if (!localStorage.getItem("auth")) {
    throw redirect("/login");
  }

  const { invoiceId } = params;
  queryClient.query(invoiceDetailsQuery(invoiceId));
}

export default InvoiceDetails;
