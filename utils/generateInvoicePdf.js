import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoicePdf = (order) => {
  return new Promise((resolve, reject) => {
    try {
      const dir = "invoices";
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      const filePath = path.join(dir, `invoice-${order._id}.pdf`);
      const doc = new PDFDocument({ size: "A4", margin: 40 });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      /* ================= HEADER ================= */
      doc
        .fontSize(24)
        .fillColor("#ff6b00")
        .text("Hungzo", { align: "left" });

      doc
        .fontSize(12)
        .fillColor("#000")
        .text("Order Invoice", { align: "right" });

      doc.moveDown(1);

      doc
        .fontSize(10)
        .fillColor("#555")
        .text(`Invoice ID: ${order._id}`)
        .text(`Order Date: ${new Date(order.createdAt).toLocaleString()}`);

      doc.moveDown();

      /* ================= CUSTOMER DETAILS ================= */
      doc
        .fontSize(12)
        .fillColor("#000")
        .text("Billed To", { underline: true });

      doc
        .fontSize(10)
        .text(order.userDetails.name || "")
        .text(order.userDetails.email || "")
        .text(order.userDetails.phone || "")
        .text(order.userDetails.address || "");

      doc.moveDown(1.5);

      /* ================= ITEMS TABLE HEADER ================= */
      const tableTop = doc.y;
      const itemX = 40;
      const qtyX = 300;
      const priceX = 360;
      const totalX = 460;

      doc
        .fontSize(11)
        .fillColor("#ffffff")
        .rect(40, tableTop, 520, 22)
        .fill("#ff6b00");

      doc
        .fillColor("#ffffff")
        .text("Item", itemX, tableTop + 6)
        .text("Qty", qtyX, tableTop + 6)
        .text("Price", priceX, tableTop + 6)
        .text("Total", totalX, tableTop + 6);

      doc.moveDown();

      /* ================= ITEMS ROWS ================= */
      doc.fillColor("#000");
      let yPosition = tableTop + 30;

      order.items.forEach((item) => {
        doc
          .fontSize(10)
          .text(
            `${item.productName} ${item.varietyName ? `(${item.varietyName})` : ""}`,
            itemX,
            yPosition,
            { width: 240 }
          )
          .text(item.quantity.toString(), qtyX, yPosition)
          .text(`₹${item.price}`, priceX, yPosition)
          .text(`₹${item.total}`, totalX, yPosition);

        yPosition += 22;
      });

      doc.moveDown(2);

      /* ================= SUMMARY ================= */
      const summaryTop = yPosition + 10;

      doc
        .fontSize(10)
        .text("Subtotal", 360, summaryTop)
        .text(`₹${order.subTotal}`, 460, summaryTop);

      doc
        .text("Delivery Charges", 360, summaryTop + 16)
        .text(`₹${order.deliveryCharge}`, 460, summaryTop + 16);

      doc
        .text("GST", 360, summaryTop + 32)
        .text(`₹${order.gstAmount}`, 460, summaryTop + 32);

      doc
        .fontSize(12)
        .fillColor("#000")
        .text("Total Amount", 360, summaryTop + 54, { bold: true })
        .text(`₹${order.totalAmount}`, 460, summaryTop + 54);

      doc.moveDown(3);


      /* ================= FOOTER ================= */
      doc
        .fontSize(9)
        .fillColor("#777")
        .text(
          "Thank you for ordering with Hungzo.\nFor any queries, contact support@hungzo.com",
          { align: "center" }
        );

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};
