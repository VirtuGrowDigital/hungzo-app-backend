import { transporter } from "./mailer.js";
import { generateInvoicePdf } from "./generateInvoicePdf.js";

// send order placed mail
export const sendOrderPlacedMail = async (email, order) => {
  const invoicePath = await generateInvoicePdf(order);

  const itemsHtml = order.items.map(i => `
    <tr>
      <td style="padding:8px 0;">${i.productName} ${i.varietyName ? `(${i.varietyName})` : ""}</td>
      <td style="padding:8px 0; text-align:center;">${i.quantity}</td>
      <td style="padding:8px 0; text-align:right;">₹${i.total}</td>
    </tr>
  `).join("");

  await transporter.sendMail({
    from: `"Hungzo" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "🎉 Order Confirmed | Invoice Attached",
    html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Order Confirmation</title>
  </head>
  <body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4; padding:20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background:#ff6b00; color:#ffffff; padding:20px; text-align:center;">
                <h1 style="margin:0;">Hungzo</h1>
                <p style="margin:5px 0 0;">Order Confirmed 🍽️</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:24px;">
                <h2 style="margin-top:0;">Thank you for your order!</h2>
                <p>Your order has been placed successfully. Here are the details:</p>

                <p style="margin:10px 0;">
                  <strong>Order ID:</strong> ${order._id}<br/>
                  <strong>Payment Method:</strong> ${order.paymentMethod}<br/>
                  <strong>Delivery Address:</strong> ${order.shippingAddress}
                </p>

                <!-- Order Items -->
                <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eee; margin-top:16px;">
                  <thead>
                    <tr>
                      <th align="left" style="padding:8px 0;">Item</th>
                      <th align="center" style="padding:8px 0;">Qty</th>
                      <th align="right" style="padding:8px 0;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>

                <!-- Summary -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                  <tr>
                    <td>Subtotal</td>
                    <td align="right">₹${order.subTotal}</td>
                  </tr>
                  <tr>
                    <td>Delivery Charges</td>
                    <td align="right">₹${order.deliveryCharge}</td>
                  </tr>
                  <tr>
                    <td>GST</td>
                    <td align="right">₹${order.gstAmount}</td>
                  </tr>
                  <tr>
                    <td style="padding-top:10px; font-weight:bold;">Total</td>
                    <td style="padding-top:10px; font-weight:bold;" align="right">₹${order.totalAmount}</td>
                  </tr>
                </table>

                <!-- Status -->
                <p style="margin-top:20px;">
                  <strong>Order Status:</strong>
                  <span style="color:#ff6b00;">${order.orderStatus}</span>
                </p>

                <!-- CTA -->
                <div style="text-align:center; margin:30px 0;">
                  <a href="#" style="background:#ff6b00; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:4px; font-weight:bold;">
                    Track Your Order
                  </a>
                </div>

                <p>If you have any questions, feel free to reply to this email.</p>
                <p>Happy ordering! 😊</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f8f8f8; padding:16px; text-align:center; font-size:12px; color:#777;">
                © ${new Date().getFullYear()} Hungzo. All rights reserved.<br/>
                This is an automated email, please do not reply.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
    attachments: [
      {
        filename: `Invoice-${order._id}.pdf`,
        path: invoicePath,
      },
    ],
  });
};




// send order status mail
export const sendOrderStatusMail = async (email, order) => {
  const statusConfig = {
    Accepted: {
      title: "Order Accepted",
      message: "Your order has been accepted and will be prepared shortly.",
      color: "#2ecc71",
      emoji: "✅",
    },
    Preparing: {
      title: "Preparing Your Order",
      message: "Our kitchen is preparing your delicious order.",
      color: "#f39c12",
      emoji: "👨‍🍳",
    },
    "Out for Delivery": {
      title: "Out for Delivery",
      message: "Your order is on the way to your doorstep.",
      color: "#3498db",
      emoji: "🚚",
    },
    Delivered: {
      title: "Order Delivered",
      message: "Your order has been delivered. Enjoy your meal!",
      color: "#27ae60",
      emoji: "🍽️",
    },
    Cancelled: {
      title: "Order Cancelled",
      message: "Unfortunately, your order has been cancelled.",
      color: "#e74c3c",
      emoji: "❌",
    },
  };

  const status = statusConfig[order.orderStatus];

  await transporter.sendMail({
    from: `"Hungzo Updates" <${process.env.MAIL_USER}>`,
    to: email,
    subject: `${status.emoji} ${status.title} | Hungzo`,
    html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Order Status Update</title>
  </head>
  <body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background:${status.color}; color:#ffffff; padding:20px; text-align:center;">
                <h1 style="margin:0;">Hungzo</h1>
                <p style="margin:6px 0 0;">${status.emoji} ${status.title}</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:24px;">
                <h2 style="margin-top:0;">Hello ${order.userDetails?.name || "Customer"},</h2>
                <p>${status.message}</p>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                  <tr>
                    <td><strong>Order ID:</strong></td>
                    <td align="right">${order._id}</td>
                  </tr>
                  <tr>
                    <td><strong>Current Status:</strong></td>
                    <td align="right">
                      <span style="color:${status.color}; font-weight:bold;">
                        ${order.orderStatus}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Delivery Address:</strong></td>
                    <td align="right">${order.shippingAddress}</td>
                  </tr>
                  <tr>
                    <td><strong>Total Amount:</strong></td>
                    <td align="right">₹${order.totalAmount}</td>
                  </tr>
                </table>

                <!-- CTA -->
                <div style="text-align:center; margin:30px 0;">
                  <a href="#"
                    style="
                      background:${status.color};
                      color:#ffffff;
                      padding:12px 24px;
                      text-decoration:none;
                      border-radius:4px;
                      font-weight:bold;
                      display:inline-block;
                    ">
                    Track Your Order
                  </a>
                </div>

                <p>If you have any questions, feel free to contact our support team.</p>
                <p>Thank you for ordering with <strong>Hungzo</strong> 🙏</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f8f8f8; padding:16px; text-align:center; font-size:12px; color:#777;">
                © ${new Date().getFullYear()} Hungzo. All rights reserved.<br/>
                This is an automated message. Please do not reply.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
  });
};

