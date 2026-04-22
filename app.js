// ================= NAVIGATION =================
function showTool(toolId) {
  document.querySelectorAll(".tool").forEach(tool => {
    tool.style.display = "none";
  });
  
  document.getElementById(toolId).style.display = "block";
}

// ================= HELPERS =================
function generateInvoiceNumber() {
  let year = new Date().getFullYear();
  let random = Math.floor(100 + Math.random() * 900);
  return `INV-${year}-${random}`;
}

function formatDate() {
  let d = new Date();
  let day = String(d.getDate()).padStart(2, '0');
  let month = String(d.getMonth() + 1).padStart(2, '0');
  let year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatKES(amount) {
  return "KES " + Number(amount).toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// ================= HELB =================
function calculateHELB() {
  let loan = document.getElementById("loan").value;
  let years = document.getElementById("years").value;
  
  let interest = 0.04;
  let total = loan * (1 + interest * years);
  let monthly = total / (years * 12);
  
  document.getElementById("helbResult").innerText =
    "Monthly Payment: KES " + monthly.toFixed(2);
}

// ================= GRADE =================
function calculateGrade() {
  let marks = document.getElementById("marks").value;
  let grade = "";
  
  if (marks >= 80) grade = "A";
  else if (marks >= 70) grade = "B";
  else if (marks >= 60) grade = "C";
  else if (marks >= 50) grade = "D";
  else grade = "E";
  
  document.getElementById("gradeResult").innerText =
    "Grade: " + grade;
}

// ================= INVOICE CORE =================
let items = [];
let total = 0;
let currentInvoiceNumber = generateInvoiceNumber();

// ➜ ADD ITEM
function generateInvoice() {
  let item = document.getElementById("item").value;
  let quantity = parseFloat(document.getElementById("quantity").value);
  let unitPrice = parseFloat(document.getElementById("unitPrice").value);
  
  if (!item || isNaN(quantity) || isNaN(unitPrice)) {
    alert("Fill all item fields correctly");
    return;
  }
  
  let totalPrice = quantity * unitPrice;
  
  items.push({ item, quantity, unitPrice, totalPrice });
  total += totalPrice;
  
  renderInvoice();
  
  // clear inputs
  document.getElementById("item").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("unitPrice").value = "";
}

// ➜ RENDER LIST
function renderInvoice() {
  let list = document.getElementById("invoiceList");
  list.innerHTML = "";
  
  items.forEach((entry, index) => {
    let li = document.createElement("li");
    li.innerText =
      `${index + 1}. ${entry.item} - ${entry.quantity} x ${formatKES(entry.unitPrice)} = ${formatKES(entry.totalPrice)}`;
    list.appendChild(li);
  });
  
  document.getElementById("total").innerText =
    "Total: " + formatKES(total);
}

// ➜ DELETE ITEM
function deleteItem() {
  let index = parseInt(document.getElementById("deleteIndex").value) - 1;
  
  if (isNaN(index) || index < 0 || index >= items.length) {
    alert("Invalid item number");
    return;
  }
  
  total -= items[index].totalPrice;
  items.splice(index, 1);
  
  renderInvoice();
  document.getElementById("deleteIndex").value = "";
}

// ================= BUILD HTML =================
function buildInvoiceHTML(logoDataURL=null) {
  let businessName = document.getElementById("businessName").value || "Your Business Name";
  let businessAddress = document.getElementById("businessAddress").value || "";
  let customerName = document.getElementById("customerName").value || "Customer";
  let contactInfo = document.getElementById("contactInfo").value || "-";
  let dueDate = document.getElementById("dueDate").value || "-";
  let vatRate = parseFloat(document.getElementById("vatRate").value) || 0;
  
  let date = formatDate();
  
  let subTotal = 0;
  
  let rows = items.map((entry, index) => {
    subTotal += entry.totalPrice;
    return `
      <tr>
       <td style="text-align:center;">${index + 1}</td>
       <td style="text-align:center;">${entry.item}</td>
       <td style="text-align:center;">${entry.quantity}</td>
       <td style="text-align:center;">${formatKES(entry.unitPrice)}</td>
       <td style="text-align:center;">${formatKES(entry.totalPrice)}</td>
      </tr>
    `;
  }).join("");
  
  let vatAmount = subTotal * (vatRate / 100);
  let grandTotal = subTotal + vatAmount;
  
  
  
  return `   
   <div class="invoice-container" style="font-family: Arial, sans-serif;">

   <!-- TOP HEADER ROW -->
   <div style="
    display:flex;
    justify-content:space-between;
    background:#f5f5f5;
    padding:12px 0px;
    margin-bottom:20px;
  ">
    
    <!-- LEFT -->
    <div style="display:flex; align-items:center; gap:15px;">
      <img src="${logoDataURL || 'images/default-logo.jpeg'}" 
           style="height:60px; width:60px; object-fit:contain; border-radius:6px;">
    
      <div>
        <h2 style="margin:0; font-size:20px;">${businessName}</h2>
        <p style="margin:2px 0; font-size:13px; color:#555;">${businessAddress}</p>
      </div>
    </div>
  
    <!-- RIGHT -->
    <div style="text-align:right; margin-rght:5px;">
      <h1 style="margin:0; font-size:22px;">INVOICE</h1>
      <p style="margin:3px 0;"># ${currentInvoiceNumber}</p>
      <p style="margin:3px 0;">Date: ${date}</p>
      <p style="margin:3px 0;">Due: ${dueDate}</p>
    </div>
  
  </div>
  
  
  <!-- BILL TO (LEFT aligned under business) -->
  <div style="margin-bottom:20px;">
    <h4 style="margin:0 0 5px 0; color:#444;">Bill To</h4>
    <p style="margin:2px 0; font-weight:bold;">${customerName}</p>
    <p style="margin:2px 0; color:#555;">${contactInfo}</p>
  </div>

  <!-- TABLE -->

  <table style="width:100%; border-collapse: collapse; margin-top:10px; font-size:14px;">
    <thead>
      <tr style="background:#eaeaea;">
        <th style="border:1px solid #ddd; padding:10px; font-size:13px;">#</th>
        <th style="border:1px solid #ddd; padding:10px; font-size:13px;">Item</th>
        <th style="border:1px solid #ddd; padding:10px; font-size:13px;">Qty</th>
        <th style="border:1px solid #ddd; padding:10px; font-size:13px;">Unit Price</th>
        <th style="border:1px solid #ddd; padding:10px; font-size:13px;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <!-- TOTALS -->
  <div style="margin-top:25px; display:flex; justify-content:flex-end;">
    <table style="border-collapse:collapse; min-width:260px; font-size:14px;">
      
      <tr>
        <td style="padding:6px 10px;">Subtotal</td>
        <td style="padding:6px 10px; text-align:right;">
          ${formatKES(subTotal)}
        </td>
      </tr>
  
      <tr>
        <td style="padding:6px 10px;">VAT (${vatRate}%)</td>
        <td style="padding:6px 10px; text-align:right;">
          ${formatKES(vatAmount)}
        </td>
      </tr>
  
      <tr>
        <td style="padding:10px; font-weight:bold; border-top:2px solid #333;">
          Total
        </td>
        <td style="padding:10px; text-align:right; font-weight:bold; border-top:2px solid #333;">
          ${formatKES(grandTotal)}
        </td>
      </tr>
  
    </table>
  </div>

  <!-- FOOTER -->
  <div style="margin-top:40px; text-align: left; font-size:12px; color:#888;">
    Thank you for your business! <br>
   <span style="font-size:9px;">
     Generated by Kenya Tools Hub • ${APP_VERSION}
   </span>
  </div>

</div>
`;
}

function handleLogoAndProceed(callback) {
  const file = document.getElementById("logoUpload").files[0];
  
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      callback(e.target.result); // pass logo
    };
    reader.readAsDataURL(file);
  } else {
    callback(null); // no logo
  }
}

function previewInvoice() {
  if (items.length === 0) {
    alert("Add at least one item");
    return;
  }
  
  handleLogoAndProceed((logo) => {
    const win = window.open("", "_blank");
    
    win.document.write(`
      <html>
        <head>
          <title>Preview</title>
        <style>
          @page {
            size: A4;
            margin: 0;
          }
        
          body {
            margin: 0;
            background: #ccc;
          }
        
          .invoice-container {
            width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            background: white;
            padding: 20mm;
            box-sizing: border-box;
          }
        
          @media print {
            body {
              background: none;
            }
        
            .invoice-container {
              margin: 0;
            }
          }
        
          table {
            width: 100%;
            border-collapse: collapse;
          }
        
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
          }
        </style>
        </head>
        <body>
          ${buildInvoiceHTML(logo)}
        </body>
      </html>
    `);
    
    win.document.close();
  });
}

function printInvoice() {
  if (items.length === 0) {
    alert("Add at least one item");
    return;
  }
  
  handleLogoAndProceed((logo) => {
    const win = window.open("", "_blank");
    
    win.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }
          
            body {
              margin: 0;
              background: #ccc;
            }
          
            .invoice-container {
              width: 210mm;
              min-height: 297mm;
              margin: 20px auto;
              background: white;
              padding: 20mm;
              box-sizing: border-box;
            }
          
            @media print {
              body {
                background: none;
              }
          
              .invoice-container {
                margin: 0;
              }
            }
          
            table {
              width: 100%;
              border-collapse: collapse;
            }
          
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
            }
        </style>
        <body>
          ${buildInvoiceHTML(logo)}
        </body>
      </html>
    `);
    
    win.document.close();
    
    win.onload = () => win.print();
  });
}

// ================= DOWNLOAD PDF =================
function downloadInvoice() {
  if (items.length === 0) {
    alert("Add at least one item");
    return;
  }
  
  handleLogoAndProceed((logo) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });
    
    const fullHTML = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial;
              width: 210mm;
              margin: auto;
              padding: 20px;
            }

            table {
              border-collapse: collapse;
              width: 100%;
            }

            th, td {
              border: 1px solid #ddd;
              padding: 8px;
            }
          </style>
        </head>
        <body>
          ${buildInvoiceHTML(logo)}
        </body>
      </html>
    `;
    
    doc.html(fullHTML, {
      callback: function(doc) {
        doc.save(`invoice-${currentInvoiceNumber}.pdf`);
      },
      x: 20,
      y: 20,
      width: 170,
      windowWidth: 1024
    });
  });
}

const APP_VERSION = "v1.3";

document.addEventListener("DOMContentLoaded", function() {
  
  // ✅ Set version
  document.getElementById("appVersion").innerText = APP_VERSION;
  
  // ✅ Existing logo preview code
  document.getElementById("logoUpload").addEventListener("change", function() {
    const file = this.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById("logoPreview").src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  
});
