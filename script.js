function showTool(toolId) {
  document.querySelectorAll(".tool").forEach(tool => {
    tool.style.display = "none";
  });
  
  document.getElementById(toolId).style.display = "block";
}

// Helb Calculator
function calculateHELB() {
  let loan = document.getElementById("loan").value;
  let years = document.getElementById("years").value;
  
  let interest = 0.04; // 4%
  let total = loan * (1 + interest * years);
  let monthly = total / (years * 12);
  
  document.getElementById("helbResult").innerText =
    "Monthly Payment: KES " + monthly.toFixed(2);
}

// Grade Calculator
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

// Invoice Generator
let total = 0;
let items = [];

function generateInvoice() {
  let item = document.getElementById("item").value;
  let quantity = parseFloat(document.getElementById("quantity").value);
  let unitPrice = parseFloat(document.getElementById("unitPrice").value);
  
  if (!item || isNaN(quantity) || isNaN(unitPrice)) return;
  
  let totalPrice = quantity * unitPrice;
  
  items.push({ item, quantity, unitPrice, totalPrice });
  
  total += totalPrice;
  
  renderInvoice();
  
  // Clear inputs
  document.getElementById("item").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("unitPrice").value = "";
}

function generateInvoiceNumber() {
  return "INV-" + Date.now();
}

function formatDate() {
  let d = new Date();

  let day = String(d.getDate()).padStart(2, '0');
  let month = String(d.getMonth() + 1).padStart(2, '0');
  let year = String(d.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
}

function renderInvoice() {
  let list = document.getElementById("invoiceList");
  list.innerHTML = "";
  
  items.forEach((entry, index) => {
    let li = document.createElement("li");
    
    li.innerText =
      `${index + 1}. ${entry.item} - ${entry.quantity} x KES ${entry.unitPrice.toFixed(2)} = KES ${entry.totalPrice.toFixed(2)}`;
    
    list.appendChild(li);
  });
  
  document.getElementById("total").innerText =
    "Total: KES " + total.toFixed(2);
}

function deleteItem() {
  let index = parseInt(document.getElementById("deleteIndex").value) - 1;
  
  if (isNaN(index) || index < 0 || index >= items.length) return;
  
  total -= items[index].totalPrice;
  
  items.splice(index, 1);
  
  renderInvoice();
  
  document.getElementById("deleteIndex").value = "";
}

function downloadPDF() {
  if (items.length === 0) {
    alert("Add at least one item");
    return;
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  let businessName = document.getElementById("businessName").value || "Your Business Name";
  let customerName = document.getElementById("customerName").value || "Customer";
  let contactInfo = document.getElementById("contactInfo").value || "-";
  
  let invoiceNumber = generateInvoiceNumber();
  let date = formatDate();
  
  // ===== HEADER =====
  doc.setFontSize(18);
  doc.text(businessName, 20, 20);
  
  doc.setFontSize(12);
  doc.text("INVOICE", 150, 20);
  doc.text("No: " + invoiceNumber, 150, 28);
  doc.text("Date: " + date, 150, 36);
  
  doc.line(20, 40, 190, 40);
  
  // ===== CUSTOMER INFO =====
  doc.text("Bill To:", 20, 50);
  doc.text(customerName, 20, 58);
  doc.text(contactInfo, 20, 66);
  
  // ===== TABLE =====
  let y = 80;
  
  doc.text("No", 20, y);
  doc.text("Item", 35, y);
  doc.text("Qty", 110, y);
  doc.text("Unit Price", 130, y);
  doc.text("Total", 160, y);
  
  doc.line(20, y + 2, 190, y + 2);
  
  y += 10;
  
  items.forEach((entry, index) => {
    doc.text(String(index + 1), 20, y);
    doc.text(entry.item, 35, y);
    doc.text(String(entry.quantity), 110, y);
    doc.text("KES " + entry.unitPrice.toFixed(2), 130, y);
    doc.text("KES " + entry.totalPrice.toFixed(2), 160, y);
    
    y += 10;
  });
  
  // ===== TOTAL =====
  doc.line(20, y, 190, y);
  y += 10;
  
  doc.setFontSize(14);
  doc.text("Total: KES " + total.toFixed(2), 140, y);
  
  // ===== FOOTER =====
  y += 20;
  doc.setFontSize(10);
  doc.text("Thank you for your business, welcome!", 20, y);
  
  doc.save("invoice.pdf");
}
