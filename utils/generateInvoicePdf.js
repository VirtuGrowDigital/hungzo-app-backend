import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoicePdf = (order) => {
  return new Promise((resolve, reject) => {
    try {
      const dir = "invoices";
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      const filePath = `${dir}/invoice-${order._id}.pdf`;
      const doc = new PDFDocument({ margin: 40 });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      doc.fontSize(20).text("Hungzo Invoice", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Order ID: ${order._id}`);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
      doc.moveDown();

      doc.text("Bill To:");
      doc.text(order.userDetails.name);
      doc.text(order.userDetails.email);
      doc.text(order.userDetails.phone);
      doc.text(order.userDetails.address);
      doc.moveDown();

      doc.text("Items:");
      doc.moveDown(0.5);

      order.items.forEach((item) => {
        doc.text(
          `${item.productName} (${item.varietyName || ""}) x ${item.quantity} = ₹${item.total}`
        );
      });

      doc.moveDown();
      doc.text(`Subtotal: ₹${order.subTotal}`);
      doc.text(`Delivery: ₹${order.deliveryCharge}`);
      doc.text(`GST: ₹${order.gstAmount}`);
      doc.fontSize(14).text(`Total: ₹${order.totalAmount}`, { bold: true });

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};
