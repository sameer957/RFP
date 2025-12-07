export const emailTemplate = (rfpJson) => {
  return `
    <div style="font-family: Arial, sans-serif; background: #f5f7fa; padding: 20px;">
      <div style="max-width: 650px; margin: auto; background: white; border-radius: 10px; overflow: hidden; border: 1px solid #e5e7eb;">
        
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <h2 style="color: #fff; margin: 0;">📄 Request For Proposal</h2>
        </div>

        <div style="padding: 25px;">
          <p style="font-size: 15px; color: #374151;">Dear Vendor,</p>
          <p style="font-size: 15px; color: #374151;">
            You are invited to submit a proposal for the following requirement:
          </p>

          <h3 style="margin-top: 25px; color: #111827;">${rfpJson.title}</h3>
          <p style="color: #4b5563;">${rfpJson.description}</p>

          <h3 style="margin-top: 25px; color: #111827;">Requirements</h3>
          <ul style="padding-left: 20px; color: #374151;">
            ${rfpJson.items
              .map(
                (item) => `
              <li style="margin-bottom: 12px;">
                <strong>${item.name}</strong><br/>
                <span style="color: #6b7280;">${item.specs}</span>
              </li>`,
              )
              .join("")}
          </ul>

          <h3 style="margin-top: 25px; color: #111827;">Budget</h3>
          <p style="color: #374151;">${rfpJson.budget}</p>

          <h3 style="margin-top: 25px; color: #111827;">Delivery Timeline</h3>
          <p style="color: #374151;">${rfpJson.deliveryTimeline}</p>

          <h3 style="margin-top: 25px; color: #111827;">Payment Terms</h3>
          <p style="color: #374151;">${rfpJson.paymentTerms}</p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

          <p style="color: #374151;">Please reply to this email with your detailed proposal.</p>

        </div>

        <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 13px; color: #6b7280;">
          © ${new Date().getFullYear()} RFP Management System — All Rights Reserved.
        </div>
      </div>
    </div>
  `;
};
