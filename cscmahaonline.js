/*=========================================================
    CSC & MahaOnline Management System
    Dhanadayi Enterprises
=========================================================*/

"use strict";

/*=========================================================
    LOCAL STORAGE KEYS
=========================================================*/

const CSC_STORAGE_KEY = "cscTransactions";

let cscTransactions =
    JSON.parse(localStorage.getItem(CSC_STORAGE_KEY)) || [];

/*=========================================================
    DOM ELEMENTS
=========================================================*/

const cscForm = document.getElementById("cscForm");

const service = document.getElementById("service");

const transactionType =
    document.getElementById("transactionType");

const customerName =
    document.getElementById("customerName");

const mobile =
    document.getElementById("mobile");

const amount =
    document.getElementById("amount");

const cost =
    document.getElementById("cost");

const remarks =
    document.getElementById("remarks");

const tableBody =
    document.getElementById("cscTableBody");

/*=========================================================
    DASHBOARD
=========================================================*/

const todayIncome =
    document.getElementById("todayIncome");

const todayExpense =
    document.getElementById("todayExpense");

const todayProfit =
    document.getElementById("todayProfit");

const todayTransactions =
    document.getElementById("todayTransactions");

/*=========================================================
    DAILY SUMMARY
=========================================================*/

const summaryIncome =
    document.getElementById("summaryIncome");

const summaryExpense =
    document.getElementById("summaryExpense");

const summaryProfit =
    document.getElementById("summaryProfit");

const summaryTransactions =
    document.getElementById("summaryTransactions");

/*=========================================================
    FILTERS
=========================================================*/

const filterDate =
    document.getElementById("filterDate");

const filterService =
    document.getElementById("filterService");

const filterType =
    document.getElementById("filterType");

const searchText =
    document.getElementById("searchText");

/*=========================================================
    SERVICE LIST
=========================================================*/

const incomeServices = [

"Mobile Recharge",

"DTH Recharge",

"Electricity Bill",

"Water Bill",

"Gas Bill",

"FASTag",

"Farmer ID",

"Pik Vima",

"PM Kisan",

"PAN Card",

"Income Certificate",

"Domicile Certificate",

"Caste Certificate",

"Nationality Certificate",

"Senior Citizen Card",

"Aadhaar eKYC",

"Building Worker Form",

"Ayushman Bharat",

"MahaDBT",
"Aadhar card Print",
"Other CSC Service",
"Photo Print",
"Xerox",
"EshramCard",
"Lamination"

];

const expenseServices = [

"Xerox Paper Expense",

"Photo Paper Expense",

"Printer Ink",

"Printer Repair",

"Society Light Bill",

"Internet Bill",

"Shop Rent",

"Stationery",

"Salary",

"Other Expense"

];

/*=========================================================
    DATE
=========================================================*/
function getPreviousDate() {

    const date = new Date();

    // Go to previous day
    date.setDate(date.getDate() - 1);

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
function getCurrentDate() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getToday(){

    const d = new Date();

    return d.toISOString().split("T")[0];

}

/*=========================================================
    TIME
=========================================================*/

function getTime(){

    return new Date().toLocaleTimeString("en-IN");

}

/*=========================================================
    FORMAT CURRENCY
=========================================================*/

function money(value){

    return Number(value || 0)
        .toLocaleString("en-IN",{

            style:"currency",

            currency:"INR",

            minimumFractionDigits:0

        });

}

/*=========================================================
    AUTO TYPE
=========================================================*/

service.addEventListener("change",()=>{

    if(incomeServices.includes(service.value)){

        transactionType.value="income";

    }

    else if(expenseServices.includes(service.value)){

        transactionType.value="expense";

    }

    else{

        transactionType.value="";

    }

});

/*=========================================================
    SAVE STORAGE
=========================================================*/

function saveStorage(){

    localStorage.setItem(

        CSC_STORAGE_KEY,

        JSON.stringify(cscTransactions)

    );

}

/*=========================================================
    INITIALIZE
=========================================================*/

window.onload=function(){

    filterDate.value=getToday();

    loadDashboard();
   updateTodayDate();
    displayTransactions();
	//updateServiceSummary();

};

/*=========================================================
    EDIT MODE
=========================================================*/

let editId = null;

/*=========================================================
    VALIDATION
=========================================================*/

function validateForm() {

    document
        .querySelectorAll(".input-error")
        .forEach(el => el.classList.remove("input-error"));

    if (service.value === "") {

        service.classList.add("input-error");

        alert("Please select a service.");

        service.focus();

        return false;
    }

    if (amount.value.trim() === "") {

        amount.classList.add("input-error");

        alert("Please enter amount.");

        amount.focus();

        return false;
    }

    if (Number(amount.value) <= 0) {

        amount.classList.add("input-error");

        alert("Amount must be greater than zero.");

        amount.focus();

        return false;
    }

    if (mobile.value.trim() !== "") {

        if (!/^[6-9]\d{9}$/.test(mobile.value.trim())) {

            mobile.classList.add("input-error");

            alert("Enter valid mobile number.");

            mobile.focus();

            return false;

        }

    }

    return true;

}

/*=========================================================
    SAVE TRANSACTION
=========================================================*/

cscForm.addEventListener("submit", function (e) {
debugger
    e.preventDefault();
   let onlineBalance = parseFloat(localStorage.getItem(ONLINE_BALANCE_KEY));

    if (isNaN(onlineBalance)) {
        onlineBalance = 0;
    }
    if (!validateForm()) return;
	


    const record = {

        id: editId || Date.now(),

        date: getCurrentDate(),

        time: new Date().toLocaleTimeString(
            "mr-IN"
        ),


        service: service.value,

        type: transactionType.value,

        customer: customerName.value.trim(),

        mobile: mobile.value.trim(),

        amount: Number(amount.value),

        cost: Number(cost.value || 0),

        net:

            transactionType.value === "income"

                ? Number(amount.value) - Number(cost.value || 0)

                : -Number(amount.value),

        remarks: remarks.value.trim()

    };

	let balance =
calculateBalance(
record.service,
Number(record.amount)
);

const validation = validateBalances(balance);

if (!validation.success) {

    alert(validation.message);   // or alert(validation.message);

    return;
}

    if (editId == null) {

        cscTransactions.unshift(record);

        showToast("Transaction Saved");

    }

    else {

        const index = cscTransactions.findIndex(

            x => x.id == editId

        );

        if (index !== -1)

            cscTransactions[index] = record;

        showToast("Transaction Updated");

        editId = null;

    }

    saveStorage();

    cscForm.reset();

    transactionType.value = "";

    loadDashboard();

    displayTransactions();
	
	

onlineBalance =
    Number(onlineBalance || 0)
    - Number(balance.onlineDebit || 0)
    + Number(balance.onlineCredit || 0);

cashBalance =
    Number(cashBalance || 0)
    - Number(balance.cashDebit || 0)
    + Number(balance.cashCredit || 0);

if (isNaN(onlineBalance)) onlineBalance = 0;
if (isNaN(cashBalance)) cashBalance = 0;

// onlineBalance =onlineBalance- balance.onlineDebit
// + balance.onlineCredit;



// cashBalance =
// cashBalance
// - balance.cashDebit
// + balance.cashCredit;



localStorage.setItem(

ONLINE_BALANCE_KEY,

onlineBalance

);



localStorage.setItem(

CASH_BALANCE_KEY,

cashBalance

);
loadOnlineBalance();

});

/*=========================================================
    EDIT
=========================================================*/

function editTransaction(id) {


    if (!isAdmin()) {

        alert("You are not authorized to edit transactions.");

        return;

    }

    const t = cscTransactions.find(x => x.id == id);

    if (!t) return;

    editId = id;

    service.value = t.service;

    transactionType.value = t.type;

    customerName.value = t.customer;

    mobile.value = t.mobile;

    amount.value = t.amount;

    cost.value = t.cost;

    remarks.value = t.remarks;

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

/*=========================================================
    DELETE
=========================================================*/

function deleteTransaction(id) {

       if (!isAdmin()) {

          alert("You are not authorized to delete transactions.");

        return;

    }
    if (!confirm("Delete this transaction?"))

        return;

    cscTransactions = cscTransactions.filter(

        x => x.id != id

    );

    saveStorage();

    loadDashboard();

    displayTransactions();

    showToast("Transaction Deleted");

}

/*=========================================================
    TOAST MESSAGE
=========================================================*/

function showToast(message) {

    let toast = document.getElementById("toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "toast";

        toast.style.position = "fixed";

        toast.style.right = "20px";

        toast.style.top = "20px";

        toast.style.background = "#198754";

        toast.style.color = "#fff";

        toast.style.padding = "14px 24px";

        toast.style.borderRadius = "8px";

        toast.style.boxShadow = "0 8px 20px rgba(0,0,0,.2)";

        toast.style.zIndex = "99999";

        document.body.appendChild(toast);

    }

    toast.innerHTML = message;

    toast.style.display = "block";

    clearTimeout(toast.timer);

    toast.timer = setTimeout(() => {

        toast.style.display = "none";

    }, 2500);

}

/*=========================================================
    DISPLAY TRANSACTIONS
=========================================================*/
function isAdmin() {

    const user = JSON.parse(localStorage.getItem("loggedUser"));

    return user && user.role === "ADMIN";

}
function displayTransactions() {

    const filteredTransactions = getFilteredTransactions();

    tableBody.innerHTML = "";

    if (filteredTransactions.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="12" class="no-data">
                    No Transactions Found
                </td>
            </tr>
        `;

        return;
    }

    filteredTransactions.forEach((item, index) => {
      const disabled = isAdmin() ? "" : "disabled";
        const badge =
            item.type === "income"
                ? '<span class="badge badge-income">Income</span>'
                : '<span class="badge badge-expense">Expense</span>';
				
				let actionButtons = `
    <button
        class="action-btn edit-btn"
        onclick="editTransaction(${item.id})"
        ${disabled}>

        <i class="fa fa-edit"></i>

    </button>

    <button
        class="action-btn delete-btn"
        onclick="deleteTransaction(${item.id})"
        ${disabled}>

        <i class="fa fa-trash"></i>

    </button>
`;

        const row = `

        <tr>

            <td>${index + 1}</td>

            <td>${formatDate(item.date)}</td>

            <td>${item.time}</td>

            <td>${item.service}</td>

            <td>${badge}</td>

            <td>${item.customer || "-"}</td>

            <td>${item.mobile || "-"}</td>

            <td>${money(item.amount)}</td>

            <td>${money(item.cost)}</td>

            <td>${money(item.net)}</td>

            <td>${item.remarks || "-"}</td>
            <td>
           ${actionButtons}
              </td>
            

        </tr>

        `;

        tableBody.insertAdjacentHTML("beforeend", row);

    });

}
// <td>

                // <button
                    // class="action-btn edit-btn"
                    // onclick="editTransaction(${item.id})">

                    // <i class="fa fa-edit"></i>

                // </button>

                // <button
                    // class="action-btn delete-btn"
                    // onclick="deleteTransaction(${item.id})">

                    // <i class="fa fa-trash"></i>

                // </button>

            // </td>
/*=========================================================
    FILTER TRANSACTIONS
=========================================================*/

function getFilteredTransactions() {

    let data = [...cscTransactions];

    if (filterDate.value !== "") {

        data = data.filter(x => x.date === filterDate.value);

    }

    if (filterService.value !== "ALL") {

        data = data.filter(x => x.service === filterService.value);

    }

    if (filterType.value !== "ALL") {

        data = data.filter(x => x.type === filterType.value);

    }

    const search = searchText.value.trim().toLowerCase();

    if (search !== "") {

        data = data.filter(x =>

            (x.customer || "").toLowerCase().includes(search) ||

            (x.mobile || "").includes(search) ||

            (x.service || "").toLowerCase().includes(search)

        );

    }

    return data.sort((a, b) => b.id - a.id);

}

/*=========================================================
    FORMAT DATE
=========================================================*/

function formatDate(date) {

    if (!date) return "";

    const d = new Date(date);

    return d.toLocaleDateString("en-GB");

}

/*=========================================================
    FILTER EVENTS
=========================================================*/

filterDate.addEventListener("change", () => {

    displayTransactions();

    loadDashboard();

});

filterService.addEventListener("change", () => {

    displayTransactions();

    loadDashboard();

});

filterType.addEventListener("change", () => {

    displayTransactions();

    loadDashboard();

});

searchText.addEventListener("keyup", () => {

    displayTransactions();

});

document
.getElementById("searchBtn")
.addEventListener("click", () => {

    displayTransactions();

});

document
.getElementById("resetFilter")
.addEventListener("click", () => {

    filterDate.value = getToday();

    filterService.value = "ALL";

    filterType.value = "ALL";

    searchText.value = "";

    displayTransactions();

    loadDashboard();

});

/*=========================================================
    LOAD DASHBOARD
=========================================================*/

function loadDashboard() {

    const data = getFilteredTransactions();

    let income = 0;

    let expense = 0;

    let profit = 0;

    data.forEach(item => {

        if (item.type === "income") {

            income += Number(item.amount);

            profit += Number(item.net);

        }

        else {

            expense += Number(item.amount);

            profit -= Number(item.amount);

        }

    });

    todayIncome.innerHTML = money(income);

    todayExpense.innerHTML = money(expense);

    todayProfit.innerHTML = money(profit);

    todayTransactions.innerHTML = data.length;

    summaryIncome.innerHTML = money(income);

    summaryExpense.innerHTML = money(expense);

    summaryProfit.innerHTML = money(profit);

    summaryTransactions.innerHTML = data.length;
	updateServiceSummary();

}

/*=========================================================
    SERVICE TOTAL IDS
=========================================================*/

const serviceIds = {

    "Mobile Recharge": "mobileCollection",

    "Electricity Bill": "electricityCollection",

    "Pik Vima": "pikvimaCollection",

    "Farmer ID": "farmerCollection",

    "PAN Card": "panCollection",

    "Aadhaar eKYC": "aadhaarCollection"

};

const expenseIds = {

    "Xerox Paper Expense": "xeroxExpense",

    "Photo Paper Expense": "photoExpense",

    "Printer Ink": "inkExpense",
	
    "Stationery": "Stationery",
   
  
    "Society Light Bill": "lightExpense",
    "Other Expense": "otherExpense"

};

/*=========================================================
    UPDATE SERVICE SUMMARY
=========================================================*/

function updateServiceSummary() {

    const data = getFilteredTransactions();

    Object.values(serviceIds).forEach(id => {

        const el = document.getElementById(id);

        if(el) el.innerHTML = money(0);

    });

    Object.values(expenseIds).forEach(id => {

        const el = document.getElementById(id);

        if(el) el.innerHTML = money(0);

    });

    let certificateTotal = 0;

    let otherServiceTotal = 0;

    data.forEach(item=>{

        if(item.type==="income"){

            if(serviceIds[item.service]){

                document.getElementById(serviceIds[item.service]).innerHTML =
                money(getServiceTotal(item.service,data));

            }

            if(

                item.service==="Income Certificate" ||

                item.service==="Domicile Certificate" ||

                item.service==="Caste Certificate" ||

                item.service==="Nationality Certificate" ||

                item.service==="Senior Citizen Card"

            ){

                certificateTotal += item.amount;

            }

            if(

                item.service==="PM Kisan" ||
                  item.service==="PAN Card" ||
                item.service==="MahaDBT" ||
				 item.service==="EshramCard" ||
				item.service==="Xerox" ||
                item.service==="Photo Print" ||
				item.service==="Xerox" ||
                item.service==="Ayushman Bharat" ||

                item.service==="Building Worker Form" ||

                item.service==="Other CSC Service"

            ){

                otherServiceTotal += item.amount;

            }

        }

        else{

            if(expenseIds[item.service]){

                document.getElementById(expenseIds[item.service]).innerHTML =
                money(getServiceTotal(item.service,data));

            }

        }

    });

  const certificatetotalcont=document.getElementById("certificateTotal");

    if(certificatetotalcont)

        certificatetotalcont.innerHTML=money(certificateTotal);
    const certificate=document.getElementById("certificateCollection");

    if(certificate)

        certificate.innerHTML=money(certificateTotal);

    const other=document.getElementById("otherCollection");

    if(other)

        other.innerHTML=money(otherServiceTotal);

}

/*=========================================================
    GET TOTAL OF SERVICE
=========================================================*/

function getServiceTotal(serviceName,data){

    return data

    .filter(x=>x.service===serviceName)

    .reduce((sum,x)=>sum+Number(x.amount),0);

}

/*=========================================================
    TOP SERVICE
=========================================================*/

function getTopService(){

    const data=getFilteredTransactions();

    const totals={};

    data.forEach(item=>{

        if(item.type!=="income") return;

        totals[item.service]=(totals[item.service]||0)+item.amount;

    });

    let topName="-";

    let topAmount=0;

    Object.keys(totals).forEach(name=>{

        if(totals[name]>topAmount){

            topAmount=totals[name];

            topName=name;

        }

    });

    return{

        name:topName,

        amount:topAmount

    };

}

/*=========================================================
    TOP EXPENSE
=========================================================*/

function getTopExpense(){

    const data=getFilteredTransactions();

    const totals={};

    data.forEach(item=>{

        if(item.type!=="expense") return;

        totals[item.service]=(totals[item.service]||0)+item.amount;

    });

    let topName="-";

    let topAmount=0;

    Object.keys(totals).forEach(name=>{

        if(totals[name]>topAmount){

            topAmount=totals[name];

            topName=name;

        }

    });

    return{

        name:topName,

        amount:topAmount

    };

}


/*=========================================================
            DOWNLOAD DAILY EXCEL REPORT
=========================================================*/

document
.getElementById("downloadExcel")
.addEventListener("click",downloadExcelReport);

function downloadExcelReport(){
	debugger

    const reportDate = filterDate.value || getCurrentDate();

    const filteredTransactions = getFilteredTransactions();

    if(filteredTransactions.length===0){

        alert("No Transactions Found.");

        return;

    }

    let totalIncome=0;

    let totalExpense=0;

    let totalCost=0;

    let totalProfit=0;

    let totalLoss=0;

    let transactionCount=filteredTransactions.length;

    const excelData=[];

    /*------------------------------------------
            COMPANY HEADER
    ------------------------------------------*/

    excelData.push([
        "DHANADAI ENTERPRISES"
    ]);

    excelData.push([
        "CSC | MahaOnline"
    ]);

    excelData.push([
        "Cash Management System"
    ]);

    excelData.push([
        "Date : "+formatDate(reportDate)
    ]);

    excelData.push([]);

    excelData.push([
        "Sr No",
        "Date",
        "Time",
        "Service",
        "Type",
        "Customer",
        "Mobile",
        "Amount",
        "Cost",
        "Net Amount",
        "Remarks"
    ]);

    /*------------------------------------------
            TRANSACTIONS
    ------------------------------------------*/

    filteredTransactions.forEach((item,index)=>{

        if(item.type==="income"){

            totalIncome+=Number(item.amount);

            totalProfit+=Number(item.net);

        }
        else{

            totalExpense+=Number(item.amount);

            totalLoss+=Number(item.amount);

        }

        totalCost+=Number(item.cost);

        excelData.push([

            index+1,

            formatDate(item.date),

            item.time,

            item.service,

            item.type.toUpperCase(),

            item.customer,

            item.mobile,

            item.amount,

            item.cost,

            item.net,

            item.remarks

        ]);

    });

    /*------------------------------------------
            EMPTY ROW
    ------------------------------------------*/

    excelData.push([]);

    /*------------------------------------------
            SUMMARY
    ------------------------------------------*/

    excelData.push(["Daily Summary"]);

    excelData.push([
        "Total Transactions",
        transactionCount
    ]);

    excelData.push([
        "Total Income",
        totalIncome
    ]);

    excelData.push([
        "Total Expense",
        totalExpense
    ]);

    excelData.push([
        "Total Cost",
        totalCost
    ]);

    excelData.push([
        "Total Profit",
        totalProfit
    ]);

    excelData.push([
        "Total Loss",
        totalLoss
    ]);

    excelData.push([
        "Net Profit",
        totalProfit-totalLoss
    ]);

    /*------------------------------------------
            CREATE WORKBOOK
    ------------------------------------------*/

    const wb=XLSX.utils.book_new();

    const ws=XLSX.utils.aoa_to_sheet(excelData);

    /*------------------------------------------
            COLUMN WIDTH
    ------------------------------------------*/

    ws["!cols"]=[

        {wch:8},
        {wch:12},
        {wch:12},
        {wch:28},
        {wch:12},
        {wch:22},
        {wch:18},
        {wch:15},
        {wch:15},
        {wch:15},
        {wch:30}

    ];

    XLSX.utils.book_append_sheet(

        wb,

        ws,

        "Daily Report"

    );

    XLSX.writeFile(

        wb,

        `CSC_Daily_Report_${reportDate}.xlsx`

    );

}


/*=========================================================
            DOWNLOAD PDF REPORT
=========================================================*/
document
.getElementById("printReport")
.addEventListener("click", function () {

    downloadPDFReport(true);

});
// document
// .getElementById("downloadPDF")
// .addEventListener("click",downloadPDFReport);

document
.getElementById("downloadPDF")
.addEventListener("click", function () {

    downloadPDFReport(false);

});
async function downloadPDFReport(printMode = false){

    const reportDate = filterDate.value || getCurrentDate();
   // const reportDate = filterDate.value || getToday();

    const filteredTransactions = getFilteredTransactions();

    if(filteredTransactions.length===0){

        alert("No Transactions Found");

        return;

    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({

        orientation:"landscape",

        unit:"mm",

        format:"a4"

    });
	
	 // ==========================================
    // YOUR COMPLETE PDF CODE GOES HERE
    // Header
    // Summary
    // AutoTable
    // Service Summary
    // Expense Summary
    // Footer
    // ==========================================

   

    /*---------------------------------------
            CALCULATIONS
    ---------------------------------------*/

    let totalIncome=0;

    let totalExpense=0;

    let totalCost=0;

    let totalProfit=0;

    let totalLoss=0;

    filteredTransactions.forEach(item=>{

        totalCost += Number(item.cost);

        if(item.type==="income"){

            totalIncome += Number(item.amount);

            totalProfit += Number(item.net);

        }
        else{

            totalExpense += Number(item.amount);

            totalLoss += Number(item.amount);

        }

    });

    const netProfit=totalProfit-totalLoss;

    /*---------------------------------------
            HEADER
    ---------------------------------------*/

    // doc.setFont("helvetica","bold");

    // doc.setFontSize(18);

    // doc.text("DHANADAI ENTERPRISES",148,15,{align:"center"});

    // doc.setFontSize(13);

    // doc.text("CSC | MahaOnline Seva Kendra",148,22,{align:"center"});

    // doc.text("Daily Cash Management System",148,28,{align:"center"});

    // doc.setFontSize(10);

    // doc.text("Mahalpatane | Tal. Deola | Dist. Nashik",148,34,{align:"center"});

    // doc.line(10,38,287,38);

    // doc.setFontSize(11);

    // doc.text("Report Date : "+formatDate(reportDate),10,45);

    // doc.text("Generated : "+new Date().toLocaleString(),190,45);
	
	/*=========================================================
        PROFESSIONAL HEADER
=========================================================*/

// Header Background
doc.setFillColor(0, 70, 170);
doc.rect(0, 0, 297, 28, "F");

// Company Name
doc.setTextColor(255, 255, 255);
doc.setFont("helvetica", "bold");
doc.setFontSize(22);
doc.text("DHANADAI ENTERPRISES", 148, 11, { align: "center" });

doc.setFontSize(13);
doc.text("CSC | MahaOnline", 148, 18, { align: "center" });

doc.setFontSize(11);
doc.text("Cash Management System", 148, 24, { align: "center" });

// Reset Text Color
doc.setTextColor(0, 0, 0);

// Report Information
doc.setFillColor(240, 240, 240);
doc.roundedRect(10, 34, 277, 14, 2, 2, "F");

doc.setFontSize(10);
doc.setFont("helvetica", "bold");

doc.text(
    "Report Date : " + formatDate(reportDate),
    15,
    42
);

doc.text(
    "Generated : " + new Date().toLocaleString(),
    185,
    42
);

    /*---------------------------------------
            SUMMARY
    ---------------------------------------*/

    doc.autoTable({

        startY:50,

        theme:"grid",

        head:[["Daily Summary","Amount"]],
		columnStyles:{

        7:{halign:"right"},
        8:{halign:"right"},
        9:{halign:"right"}

    },

        body:[

            ["Total Transactions",filteredTransactions.length],

            ["Total Income",formatAmount(totalIncome)],

            ["Total Expense",formatAmount(totalExpense)],

            ["Total Cost",formatAmount(totalCost)],

            ["Gross Profit",formatAmount(totalProfit)],

            ["Total Loss",formatAmount(totalLoss)],

            ["Net Profit",formatAmount(netProfit)]

        ]

    });

    /*---------------------------------------
            TRANSACTION TABLE
    ---------------------------------------*/

    const rows=[];

    filteredTransactions.forEach((item,index)=>{

        rows.push([

            index+1,

            formatDate(item.date),

            item.time,

            item.service,

            item.customer,

            item.mobile,

            item.type,

            formatAmount(item.amount),

            formatAmount(item.cost),

            formatAmount(item.net),

            item.remarks

        ]);

    });

    // doc.autoTable({

        // startY:doc.lastAutoTable.finalY+8,

        // theme:"striped",

        // styles:{

            // fontSize:8,

            // cellPadding:2

        // },

        // head:[[

            // "Sr",

            // "Date",

            // "Time",

            // "Service",

            // "Customer",

            // "Mobile",

            // "Type",

            // "Amount",

            // "Cost",

            // "Net",

            // "Remarks"

        // ]],

        // body:rows

    // });
doc.autoTable({

   // startY:84,

    head:[[
        "Sr",
        "Date",
        "Time",
        "Service",
        "Customer",
		"Mobile",
        "Type",
        "Amount",
        "Cost",
        "Net",
		"Remarks"
    ]],

    body:rows,

    theme:"grid",

    headStyles:{

        fillColor:[0,70,170],

        textColor:255,

        fontStyle:"bold",

        halign:"center"

    },

    alternateRowStyles:{

        fillColor:[245,248,255]

    },

    styles:{

        fontSize:8,

        cellPadding:3,

        lineColor:[220,220,220]

    },

    columnStyles:{

        6:{halign:"right"},

        7:{halign:"right"},

        8:{halign:"right"}

    }

});
    /*---------------------------------------
            SERVICE SUMMARY
    ---------------------------------------*/

    const serviceTotals={};

    filteredTransactions.forEach(item=>{

        if(item.type==="income"){

            serviceTotals[item.service]=(serviceTotals[item.service]||0)+item.amount;

        }

    });

    const serviceRows=[];

    Object.keys(serviceTotals).forEach(key=>{

        serviceRows.push([

            key,

            formatAmount(serviceTotals[key])

        ]);

    });

    doc.autoTable({

        startY:doc.lastAutoTable.finalY+8,

        head:[["Service Wise Collection","Amount"]],

        body:serviceRows,

        theme:"grid"

    });

    /*---------------------------------------
            EXPENSE SUMMARY
    ---------------------------------------*/

    const expenseTotals={};

    filteredTransactions.forEach(item=>{

        if(item.type==="expense"){

            expenseTotals[item.service]=(expenseTotals[item.service]||0)+item.amount;

        }

    });

    const expenseRows=[];

    Object.keys(expenseTotals).forEach(key=>{

        expenseRows.push([

            key,

            formatAmount(expenseTotals[key])

        ]);

    });

    doc.autoTable({

        startY:doc.lastAutoTable.finalY+8,

        head:[["Expense Head","Amount"]],

        body:expenseRows,

        theme:"grid"

    });

    /*---------------------------------------
            FOOTER
    ---------------------------------------*/

    // const pages=doc.internal.getNumberOfPages();

    // for(let i=1;i<=pages;i++){

        // doc.setPage(i);

        // // doc.setFontSize(9);

        // doc.line(10,195,287,195);
		// const pageHeight = doc.internal.pageSize.height;

// doc.setDrawColor(180);
// doc.line(14, pageHeight - 22, 196, pageHeight - 22);

// doc.setFontSize(9);
// doc.setTextColor(100);

        // doc.text(

            // "Generated by Dhanadai Enterprises | CSC | MahaOnline Daily Cash Management System" +"Date Time : " +
    // new Date().toLocaleString("en-IN"),

            // 10,

            // 200

        // );

        // doc.text(

            // "Page "+i+" of "+pages,

            // 260,

            // 200

        // );

    // }
	const pages = doc.internal.getNumberOfPages();

for(let i=1;i<=pages;i++){

    doc.setPage(i);

    doc.setFillColor(0,70,170);

    doc.rect(0,200,297,10,"F");

    doc.setTextColor(255,255,255);

    doc.setFontSize(9);

    doc.text(
        "Generated by Dhanadai Enterprises DHANADAI ENTERPRISES | CSC | MahaOnline Daily Cash Management System",
        10,
        206
    );

    doc.text(
        "Page " + i + " / " + pages,
        270,
        206,
        {align:"right"}
    );

}
 if (printMode) {

        doc.autoPrint();

        window.open(doc.output("bloburl"), "_blank");

    } else {

        doc.save("CSC_Daily_Report_" + reportDate + ".pdf");

    }
    /*---------------------------------------
            SAVE
    ---------------------------------------*/

    // doc.save(

        // "CSCMahaonline_Daily_Report_"+reportDate+".pdf"

    // );

}

let y = 55;

function drawCard(x, title, value, r, g, b) {

    doc.setFillColor(r, g, b);

    doc.roundedRect(x, y, 52, 22, 2, 2, "F");

    doc.setTextColor(255,255,255);

    doc.setFontSize(9);

    doc.text(title, x + 4, y + 7);

    doc.setFontSize(14);

    doc.setFont("helvetica","bold");

    doc.text(value, x + 4, y + 16);

}

const ONLINE_BALANCE_KEY="onlineBalance";


function loadOnlineBalance() {

    // Read from localStorage every time
    let onlineBalance = parseFloat(localStorage.getItem(ONLINE_BALANCE_KEY));
    let cashBalance = parseFloat(localStorage.getItem(CASH_BALANCE_KEY));

    // Handle invalid values
    if (isNaN(onlineBalance)) {
        onlineBalance = 0;
        localStorage.setItem(ONLINE_BALANCE_KEY, 0);
    }

    if (isNaN(cashBalance)) {
        cashBalance = 0;
        localStorage.setItem(CASH_BALANCE_KEY, 0);
    }

    // Update global variables (if you use them elsewhere)
    window.onlineBalance = onlineBalance;
    window.cashBalance = cashBalance;

    // Update UI
    document.getElementById("onlineBalance").innerHTML = money(onlineBalance);
    document.getElementById("cashBalance").innerHTML = money(cashBalance);
}
// function loadOnlineBalance(){
	

// debugger

// // let onlineBalance =Number(localStorage.getItem(ONLINE_BALANCE_KEY)) || 0;
    // document.getElementById(
        // "onlineBalance"
    // ).innerHTML =
    // money(onlineBalance);
	
	    // document.getElementById(
        // "cashBalance"
    // ).innerHTML =
    // money(cashBalance);

// }


window.addEventListener(
"load",
()=>{

    loadOnlineBalance();

});

document
.getElementById("addOnlineBtn")
.addEventListener("click", function () {

    // Amount entered by user
    const amount = Number(document.getElementById("addOnlineAmount").value);

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    // Read current online balance from localStorage
    let onlineBalance = parseFloat(localStorage.getItem(ONLINE_BALANCE_KEY));

    if (isNaN(onlineBalance)) {
        onlineBalance = 0;
    }

    // Add amount
    onlineBalance += amount;

    // Save
    localStorage.setItem(ONLINE_BALANCE_KEY, onlineBalance);

    // Update global variable (optional)
    window.onlineBalance = onlineBalance;

    // Refresh UI
    loadOnlineBalance();

    // Clear textbox
    document.getElementById("addOnlineAmount").value = "";

    alert("Online balance updated successfully.");

});

// document
// .getElementById("addOnlineBtn")
// .addEventListener(
// "click",
// function(){
// debugger

// let amount =
// Number(
// document.getElementById(
// "addOnlineAmount"
// ).value
// );

// let onlineBalance =
// Number(
// document.getElementById(
// "onlineBalance"
// ).value
// );



// if(amount<=0){

// alert("Enter valid amount");

// return;

// }


// onlineBalance += amount;


// localStorage.setItem(

// ONLINE_BALANCE_KEY,

// onlineBalance

// );



// document.getElementById(
// "addOnlineAmount"
// ).value="";


// loadOnlineBalance();


// showToast(
// "Online Balance Added Successfully"
// );


// });
	
function formatAmount(amount){

    return "Rs. " +
        Number(amount || 0).toLocaleString("en-IN",{
            minimumFractionDigits:2,
            maximumFractionDigits:2
        });

}

///services login balance and cash update

// const serviceLogic = {


    // // Online payment services
    // "Mobile Recharge":{
        // type:"ONLINE",
        // cost:"FULL"
    // },

    // "Water Bill":{
        // type:"ONLINE",
        // cost:"FULL"
    // },
	
	
	 // "Pik Vima":{
        // type:"ONLINE",
        // cost:"FULL"
    // },
	
	// "Farmer ID":{
        // type:"ONLINE",
        // cost:"FULL"
    // },
	
	// "MahaDBT":{
        // type:"ONLINE",
        // cost:"FULL"
    // },
	
	// "Other CSC Service":{
        // type:"ONLINE",
        // cost:"FULL"
    // },
	
	
	 // "PM Kisan":{
        // type:"ONLINE",
        // cost:"FULL"
    // },
    // "PAN Card":{
        // type:"ONLINE",
        // cost:"FULL"
    // },


    // "Electricity Bill":{
        // type:"ONLINE",
        // cost:"FULL"
    // },


    // "FASTag":{
        // type:"ONLINE",
        // cost:"FULL"
    // },

  // // CSC income services

    // "Income Certificate":{
        // type:"SERVICE",
         // cost:"FULL"
    // },


    // // CSC income services

   
    // "Senior Citizen Card":{
        // type:"SERVICE",
         // cost:"FULL"
    // },
	 // "Building Worker Form":{
        // type:"SERVICE",
        // cost:"FULL"
    // },
	
    // "Aadhaar eKYC":{
        // type:"SERVICE",
        // cost:"FULL"
    // },
	
	// "Ayushman Bharat":{
        // type:"SERVICE",
        // cost:"FULL"
    // },

    

    // "Caste Certificate":{
        // type:"SERVICE",
         // cost:"FULL"
    // },


    // "Nationality Certificate":{
        // type:"SERVICE",
        // cost:"FULL"
    // },


    // // Expenses
    // "Xerox Paper Expense":{
        // type:"EXPENSE"
    // },
   
    // "Photo Paper Expense":{
        // type:"EXPENSE"
    // },
	
	// "Other Expense":{
        // type:"EXPENSE"
    // },
    // "Printer Ink":{
        // type:"EXPENSE"
    // },
	// "Printer Repair":{
        // type:"EXPENSE"
    // },

   // "Internet Bill":{
        // type:"EXPENSE"
    // },

   // "Shop Rent":{
        // type:"EXPENSE"
    // },
    // "Society Light Bill":{
        // type:"EXPENSE"
    // }


    

// };


const serviceLogic = {

    // ===========================
    // Online Services
    // ===========================
    "Mobile Recharge": {
        type: "ONLINE",
        customerCharge: 0,
        onlineCost: "FULL",
        paymentMode: "ONLINE"
    },

  "DTH Recharge": {
        type: "ONLINE",
        customerCharge: 0,
        onlineCost: "FULL",
        paymentMode: "ONLINE"
    },
    "Electricity Bill": {
        type: "ONLINE",
        customerCharge: 0,
        onlineCost: "FULL",
        paymentMode: "ONLINE"
    },

    "Water Bill": {
        type: "ONLINE",
        customerCharge: 0,
        onlineCost: "FULL",
        paymentMode: "ONLINE"
    },

    "FASTag": {
        type: "ONLINE",
        customerCharge: 0,
        onlineCost: "FULL",
        paymentMode: "ONLINE"
    },

    "Pik Vima": {
        type: "SERVICE",
        customerCharge: 0,
        onlineCost: 0
    },
   
   "Other CSC Service":{
         type: "SERVICE",
        customerCharge: 0,
        onlineCost: 0
     },
	 "Photo Print":{
         type: "SERVICE",
        customerCharge: 0,
        onlineCost: 0
     },
	 
	  "MahaDBT":{
         type: "SERVICE",
        customerCharge: 0,
        onlineCost: 0
     },
	 
	  "EshramCard":{
         type: "SERVICE",
        customerCharge: 0,
        onlineCost: 0
     },
	  "PAN Card":{
         type: "SERVICE",
        customerCharge: 0,
        onlineCost: 0
     },
	   "Xerox":{
         type: "SERVICE",
        customerCharge: 0,
        onlineCost: 0
     },
    "PM Kisan": {
         type: "SERVICE",
        customerCharge: 0,
        onlineCost: 0
        
    },
   "Aadhar card Print": {
         type: "SERVICE",
        customerCharge: 0,
        onlineCost: 0
        
    },

   "Lamination": {
         type: "SERVICE",
        customerCharge: 0,
        onlineCost: 0
        
    },

    "Farmer ID": {
         type: "SERVICE",
        customerCharge: 0,
        onlineCost: 0
        // paymentMode: "ONLINE"
    },

    // ===========================
    // CSC / MahaOnline Services
    // ===========================
    "Income Certificate": {
        type: "SERVICE",
        customerCharge: 0,
        onlineCost: 70
    },

    "Domicile Certificate": {
        type: "SERVICE",
        customerCharge: 0,
        onlineCost: 70
    },

    "Caste Certificate": {
        type: "SERVICE",
        customerCharge: 0,
        onlineCost: 70
    },

    "Nationality Certificate": {
        type: "SERVICE",
        customerCharge: 0,
        onlineCost: 70
    },

    "Senior Citizen Card": {
        type: "SERVICE",
        customerCharge: 0,
        onlineCost: 70
    },

    "Building Worker Form": {
        type: "SERVICE",
        customerCharge: 0,
        onlineCost: 0
    },

    "Aadhaar eKYC": {
        type: "SERVICE",
        customerCharge: 0,
        onlineCost: 0
    },

    "Ayushman Bharat": {
        type: "SERVICE",
        customerCharge: 0,
        onlineCost: 0
    },

    // ===========================
    // Expenses
    // ===========================
    "Xerox Paper Expense": {
        type: "EXPENSE",
        paymentMode: "CASH"
    },

    "Photo Paper Expense": {
        type: "EXPENSE",
        paymentMode: "CASH"
    },
	"Stationery": {
        type: "EXPENSE",
        paymentMode: "CASH"
    },
	"Salary": {
        type: "EXPENSE",
        paymentMode: "CASH"
    },
   
    "Printer Ink": {
        type: "EXPENSE",
        paymentMode: "CASH"
    },

    "Printer Repair": {
        type: "EXPENSE",
        paymentMode: "CASH"
    },

    "Internet Bill": {
        type: "EXPENSE",
        paymentMode: "ONLINE"
    },

    "Society Light Bill": {
        type: "EXPENSE",
        paymentMode: "CASH"
    },

    "Shop Rent": {
        type: "EXPENSE",
        paymentMode: "CASH"
    },

    "Other Expense": {
        type: "EXPENSE",
        paymentMode: "CASH"
    }

};

const CASH_BALANCE_KEY =
"cashBalance";





let cashBalance =
Number(
localStorage.getItem(
CASH_BALANCE_KEY
)
)||0;

function validateBalances(balanceResult) {

    // Read latest balances
    const currentOnlineBalance = Number(localStorage.getItem(ONLINE_BALANCE_KEY)) || 0;
    const currentCashBalance = Number(localStorage.getItem(CASH_BALANCE_KEY)) || 0;

    /*---------------------------------------
        Online Balance Validation
    ---------------------------------------*/
    if (balanceResult.onlineDebit > currentOnlineBalance) {

        return {
            success: false,
            message:
                "❌ Online Balance is not sufficient.\n\n" +
                "Current Online Balance : " + money(currentOnlineBalance) +
                "\nRequired : " + money(balanceResult.onlineDebit) +
                "\n\nPlease add online balance first."
        };
    }

    /*---------------------------------------
        Cash Balance Validation
    ---------------------------------------*/
    if (balanceResult.cashDebit > currentCashBalance) {

        return {
            success: false,
            message:
                "❌ Cash Balance is not sufficient.\n\n" +
                "Current Cash Balance : " + money(currentCashBalance) +
                "\nRequired : " + money(balanceResult.cashDebit) +
                "\n\nPlease add cash first."
        };
    }

    return {
        success: true
    };
}
//export Backup
document.getElementById("exportBackup").addEventListener("click", function () {

    const backup = {

        backupDate: new Date().toLocaleString(),

        transactions:
            JSON.parse(localStorage.getItem("transactions")) || [],

        cscTransactions:
            JSON.parse(localStorage.getItem("cscTransactions")) || [],

        dailyHistory:
            JSON.parse(localStorage.getItem("dailyHistory")) || [],

        openingCash:
            localStorage.getItem("openingCash"),

        cashBalance:
            localStorage.getItem("cashBalance"),

        onlineBalance:
            localStorage.getItem("onlineBalance")

    };

    const blob = new Blob(
        [JSON.stringify(backup, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    const date = new Date().toISOString().split("T")[0];

    a.href = url;

    a.download = "CSCMahaonline_Backup_" + date + ".json";

    a.click();

    URL.revokeObjectURL(url);

});

document.getElementById("importBackupBtn").addEventListener("click", function () {

    document.getElementById("importBackup").click();

});

document.getElementById("importBackup").addEventListener("change", function (e) {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {

        try {

            const data = JSON.parse(event.target.result);

            localStorage.setItem(
                "transactions",
                JSON.stringify(data.transactions || [])
            );

            localStorage.setItem(
                "cscTransactions",
                JSON.stringify(data.cscTransactions || [])
            );

            localStorage.setItem(
                "dailyHistory",
                JSON.stringify(data.dailyHistory || [])
            );

            localStorage.setItem(
                "openingCash",
                data.openingCash || 0
            );

            localStorage.setItem(
                "cashBalance",
                data.cashBalance || 0
            );

            localStorage.setItem(
                "onlineBalance",
                data.onlineBalance || 0
            );

            alert("Backup restored successfully.");

            location.reload();

        }
        catch (err) {

            alert("Invalid backup file.");

        }

    };

    reader.readAsText(file);

});

function logout() {

    if (confirm("Are you sure you want to logout?")) {

        localStorage.removeItem("loggedUser");

        window.location.href = "index.html";

    }

}

function calculateBalance(serviceName, amount) {


   
    // Always convert to number
    amount = Number(amount);

    // If invalid, use 0
    if (isNaN(amount)) {
        amount = 0;
    }

    // Default return object
    const result = {
        onlineDebit: 0,
        onlineCredit: 0,
        cashDebit: 0,
        cashCredit: 0,
        profit: 0,
		onlineCost: "",
        paymentMode: ""
    };

    // Find service configuration
    const logic = serviceLogic[serviceName];

    // If service not configured, treat as normal cash income
    if (!logic) {
        result.cashCredit = amount;
        result.profit = amount;
		result.onlineDebit=amount;
        return result;
    }

    switch (logic.type) {

        /*====================================
            ONLINE SERVICES
            Mobile Recharge
            DTH Recharge
            Electricity Bill
            FASTag Recharge
        ====================================*/

        case "ONLINE":
             result.onlineCost=logic.onlineCost;
             result.paymentMode=logic.paymentMode;
            // Online balance decreases
            result.onlineDebit = amount;

            // Customer pays cash
            result.cashCredit = amount;

            // No direct profit calculation here
            result.profit = 0;

            break;

        /*====================================
            CSC SERVICES
            Income Certificate etc.
        ====================================*/

        case "SERVICE":
             
            const onlineCost = Number(logic.onlineCost || 0);
              result.onlineCost=onlineCost;
              result.paymentMode=logic.paymentMode;
            // Online payment for the government portal
            result.onlineDebit = onlineCost;

            // Customer gives full cash
            result.cashCredit = amount;

            // Net earning
            result.profit = amount - onlineCost;

            break;

        /*====================================
            EXPENSES
        ====================================*/

        case "EXPENSE":

            // Decide whether the expense is paid online or by cash
            if (logic.paymentMode === "ONLINE") {

                result.onlineDebit = amount;

            } else {
                result.onlineDebit = 0;
                result.cashDebit = amount;

            }

            result.profit = -amount;

            break;

        default:
           
            result.cashCredit = amount;

            result.profit = amount;

            break;
    }

    // Final safety check - prevent NaN
    Object.keys(result).forEach(key => {

        result[key] = Number(result[key]);

        if (isNaN(result[key])) {
            result[key] = 0;
        }

    });

    return result;
}

// =========================================================
// SHOW TODAY DATE
// =========================================================
function updateTodayDate() {

    const today = new Date();

    const dayName = new Intl.DateTimeFormat("mr-IN", {
        weekday: "long"
    }).format(today);

    const date = new Intl.DateTimeFormat("mr-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(today);

    document.getElementById("todayDate").innerHTML =
        `📅 ${dayName}, ${date}`;
}

// function calculateBalance(serviceName,amount){
// debugger

// let result={

    // onlineDebit:0,

    // onlineCredit:0,

    // cashDebit:0,

    // cashCredit:0,

    // profit:0

// };


// let logic =
// serviceLogic[serviceName];



// if(!logic){

// return result;

// }



// /*
 // ONLINE SERVICES

 // Mobile Recharge
 // DTH
 // Electricity
 // FASTag

// */


// if(logic.type==="ONLINE"){


    // result.onlineDebit =
    // amount;


    // result.cashCredit =
    // amount;


// }



// /*
 // CSC SERVICE

 // Income Certificate

// */

// else if(logic.type==="SERVICE"){


    // result.onlineDebit =
    // logic.onlineCost;



    // result.cashCredit =
    // amount;



    // result.profit =
    // amount -
    // logic.onlineCost;


// }



// /*
 // EXPENSE

// */


// else if(logic.type==="EXPENSE"){


    // result.cashDebit =
    // amount;


// }



// return result;


// }