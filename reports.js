/* =========================================================
   DHANADAYI CSP CASH MANAGER

   report.js

   PHASE 2A - PROFESSIONAL REPORT MODULE
=========================================================*/


// =========================================================
// STORAGE KEYS
// =========================================================

const REPORT_STORAGE = {


    OPENING_CASH:
    "dhanadayi_opening_cash",


    TRANSACTIONS:
    "dhanadayi_transactions"


};




// =========================================================
// GLOBAL DATA
// =========================================================


let reportTransactions = [];

let reportOpeningCash = 0;




// =========================================================
// PAGE LOAD
// =========================================================


document.addEventListener(
"DOMContentLoaded",

function(){

debugger
    loadReportData();


    setTodayDate();


    generateReport();


}

);




// =========================================================
// LOAD LOCAL STORAGE DATA
// =========================================================


function loadReportData(){
debugger


    let cash =

    localStorage.getItem(
        REPORT_STORAGE.OPENING_CASH
    );



    if(cash){


        reportOpeningCash =
        Number(cash);


    }




    let data =

    localStorage.getItem(
        REPORT_STORAGE.TRANSACTIONS
    );



    if(data){


        reportTransactions =
        JSON.parse(data);


    }
    else{


        reportTransactions=[];


    }



}




// =========================================================
// SET DEFAULT DATE
// =========================================================


function setTodayDate(){


let dateBox =

document.getElementById(
"reportDate"
);



if(dateBox){


let today =

new Date()
.toISOString()
.split("T")[0];


dateBox.value=today;



}



}




// =========================================================
// VIEW REPORT BUTTON
// =========================================================



let viewButton =

document.getElementById(
"viewReport"
);



if(viewButton){


viewButton.addEventListener(

"click",

function(){


generateReport();


}

);


}





// =========================================================
// GENERATE REPORT
// =========================================================


function generateReport(){

debugger

let selectedDate =

document.getElementById(
"reportDate"
).value;



let selectedBank =

document.getElementById(
"bankFilter"
).value;





let filtered =

reportTransactions.filter(

function(item){



let dateMatch =

item.date===selectedDate;



let bankMatch =

selectedBank==="ALL"
||
item.bank===selectedBank;



return dateMatch && bankMatch;



}

);




calculateSummary(filtered);



showReportTable(filtered);



}







// =========================================================
// SUMMARY CALCULATION
// =========================================================


function calculateSummary(data){



let withdrawal=0;

let deposit=0;

let charges=0;

let count=data.length;



data.forEach(

function(item){



charges +=

Number(
item.charge || 0
);




if(
item.type==="withdrawal"
||
item.type==="cashout"
||
item.type==="upi"
){


withdrawal +=

Number(item.amount);


}





if(
item.type==="deposit"
||
item.type==="cashin"
){


deposit +=

Number(item.amount);


}




}



);





let opening =

calculateOpeningCash();



let closing =

opening
-
withdrawal
+
deposit;






setReportValue(
"reportOpening",
opening
);



setReportValue(
"reportClosing",
closing
);



setReportValue(
"reportWithdrawal",
withdrawal
);



setReportValue(
"reportDeposit",
deposit
);



setReportValue(
"reportCharges",
charges
);



document.getElementById(
"reportCount"
).innerHTML=count;



}




// =========================================================
// OPENING CASH FOR SELECTED DATE
// =========================================================


function calculateOpeningCash(){


let todayOpening =

reportOpeningCash;



return todayOpening;


}





// =========================================================
// DISPLAY TABLE
// =========================================================


function showReportTable(data){



let tbody =

document.getElementById(
"reportTable"
);



if(!tbody){

return;

}



tbody.innerHTML="";





data.forEach(

function(item){



let row=

document.createElement(
"tr"
);





row.innerHTML=`

<td>

${formatDisplayDate(item.date)}

</td>

<td>

${item.time}

</td>


<td>

${

item.bank==="FINO"

?

"Fino Payment Bank"

:

"Bank of Maharashtra"

}

</td>



<td>

${getTypeName(item.type)}

</td>



<td>

${item.customer || "-"}

</td>



<td>

₹${Number(item.amount)
.toLocaleString("en-IN")}

</td>



<td>

₹${Number(item.charge)
.toLocaleString("en-IN")}

</td>


`;



tbody.appendChild(row);



}



);



}

function formatDisplayDate(dateString) {

    if (!dateString) return "";

    // If stored as YYYY-MM-DD
    const parts = dateString.split("-");

    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    // Fallback
    const date = new Date(dateString);

    if (!isNaN(date.getTime())) {

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }

    return dateString;
}


// =========================================================
// TRANSACTION TYPE NAME
// =========================================================


function getTypeName(type){



let list={


withdrawal:
"AEPS Withdrawal",


deposit:
"AEPS Deposit",


upi:
"UPI Cash",


cashin:
"Cash In",


cashout:
"Cash Out"


};



return list[type] || type;


}






// =========================================================
// SET VALUE
// =========================================================


function setReportValue(id,value){



let element=

document.getElementById(id);



if(element){


element.innerHTML=

"₹"+

Number(value)
.toLocaleString(
"en-IN"
);



}



}







// =========================================================
// PRINT REPORT
// =========================================================


let printButton=

document.getElementById(
"printReport"
);



if(printButton){


printButton.onclick=function(){


window.print();


};


}






// =========================================================
// DOWNLOAD EXCEL CSV
// =========================================================


let excelButton=

document.getElementById(
"downloadExcel"
);



if(excelButton){


excelButton.onclick=function(){


downloadExcels();


};


}


function downloadExcels() {

    const reportDate = document.getElementById("reportDate").value;
    const selectedBank = document.getElementById("bankFilter").value;

    // Filter Transactions
    const filteredTransactions = reportTransactions.filter(item => {

        const dateMatch = item.date === reportDate;

        const bankMatch =
            selectedBank === "ALL" ||
            item.bank === selectedBank;

        return dateMatch && bankMatch;

    });

    if (filteredTransactions.length === 0) {

        alert("या तारखेसाठी कोणताही व्यवहार उपलब्ध नाही.");

        return;
    }

    // ===========================
    // Totals
    // ===========================

    let totalWithdrawal = 0;
    let totalDeposit = 0;
    let totalUPI = 0;
    let totalCharges = 0;

    filteredTransactions.forEach(item => {

        totalCharges += Number(item.charge || 0);

        switch (item.type) {

            case "withdrawal":

                totalWithdrawal += Number(item.amount);
                break;

            case "deposit":

                totalDeposit += Number(item.amount);
                break;

            case "upi":

                totalUPI += Number(item.amount);
                break;

            case "cashin":

                totalDeposit += Number(item.amount);
                break;

            case "cashout":

                totalWithdrawal += Number(item.amount);
                break;
        }

    });

    const openingCash = reportOpeningCash;

    const remainingCash =
        openingCash -
        totalWithdrawal +
        totalDeposit;

    // ===========================
    // Excel Data
    // ===========================

    const excelData = [];

    // Report Title
    excelData.push(["धनदाई एंटरप्रायझेस-फिनो पेमेंट | महाराष्ट्र बँक Cash Management System"]);
    excelData.push(["DAILY TRANSACTION REPORT"]);
    excelData.push([]);

    excelData.push(["Report Date", formatReportDate(reportDate)]);
    excelData.push(["Bank", selectedBank]);
    excelData.push([]);

    // Column Header

    excelData.push([
        "Sr No",
        "Date",
        "Time",
        "Bank",
        "Transaction Type",
        "Customer Name",
        "Mobile Number",
        "Aadhaar Number",
        "Amount",
        "Charges",
        "Remarks"
    ]);

    // ===========================
    // Data
    // ===========================

    filteredTransactions.forEach((item, index) => {

        excelData.push([

            index + 1,

            formatReportDate(item.date),

            item.time,

            item.bank === "FINO"
                ? "Fino Payment Bank"
                : "Bank of Maharashtra",

            getTypeName(item.type),

            item.customer,

            item.mobile,

            item.aadhaar,

            Number(item.amount),

            Number(item.charge),

            item.remarks

        ]);

    });

    // Blank Row
    excelData.push([]);

    // ===========================
    // Summary
    // ===========================
 
  excelData.push([
        "Total Transactions",
        filteredTransactions.length
    ]);
    excelData.push(["SUMMARY"]);
   
    excelData.push([
        "Opening Cash",
        openingCash
    ]);

    excelData.push([
        "Total Deposit",
        totalDeposit
    ]);

    excelData.push([
        "Total Withdrawal",
        totalWithdrawal
    ]);

    excelData.push([
        "Total UPI Cash",
        totalUPI
    ]);

    excelData.push([
        "Total Charges",
        totalCharges
    ]);

    excelData.push([
        "Remaining Cash",
        remainingCash
    ]);

   

    // ===========================
    // Create Workbook
    // ===========================

    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // Auto Width

    ws["!cols"] = [

        { wch: 8 },
        { wch: 15 },
        { wch: 12 },
        { wch: 25 },
        { wch: 25 },
        { wch: 25 },
        { wch: 18 },
        { wch: 20 },
        { wch: 15 },
        { wch: 12 },
        { wch: 35 }

    ];

    XLSX.utils.book_append_sheet(
        wb,
        ws,
        "Daily Report"
    );

    XLSX.writeFile(
        wb,
        `FinoPaymentBank_Report_${reportDate}.xlsx`
    );

}

document
.getElementById("downloadPDF")
.addEventListener("click", downloadPDF);

async function downloadPDF() {
	debugger

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF("p", "mm", "a4");

    const reportDate =
        document.getElementById("reportDate").value;

    const selectedBank =
        document.getElementById("bankFilter").value;

    const filteredTransactions =
        reportTransactions.filter(item => {

            const dateMatch =
                item.date === reportDate;

            const bankMatch =
                selectedBank === "ALL" ||
                item.bank === selectedBank;

            return dateMatch && bankMatch;

        });

    if(filteredTransactions.length===0){

        alert("No transactions found.");

        return;
    }

    let withdrawal = 0;
    let deposit = 0;
    let upi = 0;
    let charges = 0;

    filteredTransactions.forEach(item=>{

        charges += Number(item.charge||0);

        switch(item.type){

            case "withdrawal":

                withdrawal += Number(item.amount);

                break;

            case "deposit":

                deposit += Number(item.amount);

                break;

            case "upi":

                upi += Number(item.amount);

                break;

            case "cashin":

                deposit += Number(item.amount);

                break;

            case "cashout":

                withdrawal += Number(item.amount);

                break;
        }

    });

    const closing =
        reportOpeningCash
        - withdrawal
        + deposit;

    // ==========================
    // HEADER
    // ==========================

    // doc.setFontSize(18);
    // doc.text("FINO PAYMENT BANK CASH MANAGER",105,15,{align:"center"});

    // doc.setFontSize(14);
    // doc.text("Daily Transaction Report",105,23,{align:"center"});

    // doc.setFontSize(10);

    // doc.text(
        // "Report Date : " +
        // formatReportDate(reportDate),
        // 14,
        // 35
    // );

    // doc.text(
        // "Bank : " + selectedBank,
        // 150,
        // 35
    // );
   // Blue Title
doc.setFillColor(0, 91, 170);
doc.rect(0, 0, 210, 22, "F");

doc.setFont("helvetica", "bold");
doc.setTextColor(255, 255, 255);
doc.setFontSize(20);

doc.text(
    "FINO PAYMENT BANK CASH MANAGER",
    105,
    14,
    { align: "center" }
);

// Subtitle
doc.setTextColor(40, 40, 40);
doc.setFontSize(14);

doc.text(
    "Daily Transaction Report",
    105,
    30,
    { align: "center" }
);

// Report Details
doc.setFontSize(11);
doc.setFont("helvetica", "bold");

doc.text(
    "Report Date : " + formatReportDate(reportDate),
    14,
    40
);

doc.text(
    "Bank : " +
    (
        selectedBank === "ALL"
            ? "All Banks"
            : selectedBank === "FINO"
                ? "Fino Payment Bank"
                : "Bank of Maharashtra"
    ),
    150,
    40
);

    // ==========================
    // SUMMARY
    // ==========================
doc.autoTable({

    startY: 48,

    theme: "grid",

    styles: {

        fontSize: 11,

        fontStyle: "bold",

        halign: "left"

    },

    headStyles: {

        fillColor: [0, 91, 170],

        textColor: [255, 255, 255],

        fontStyle: "bold",

        fontSize: 12

    },

    alternateRowStyles: {

        fillColor: [245, 248, 255]

    },

    head: [

        ["SUMMARY", "AMOUNT"]

    ],

    body: [

        ["Opening Cash", "Rs. " + reportOpeningCash.toLocaleString("en-IN")],

        ["Total Deposit", "Rs. " + deposit.toLocaleString("en-IN")],

        ["Total Withdrawal", "Rs. " + withdrawal.toLocaleString("en-IN")],

        ["Total UPI Cash", "Rs " + upi.toLocaleString("en-IN")],

        ["Total Charges", "Rs" + charges.toLocaleString("en-IN")],

        ["Remaining Cash", "Rs. " + closing.toLocaleString("en-IN")],

        ["Total Transactions", filteredTransactions.length]

    ]

});
    // doc.autoTable({

        // startY:42,

        // theme:"grid",

        // head:[

            // ["Summary","Amount"]

        // ],

        // body:[

            // ["Opening Cash","Rs. "+reportOpeningCash],

            // ["Total Deposit","Rs. "+deposit],

            // ["Total Withdrawal","Rs. "+withdrawal],

            // ["Total UPI Cash","Rs. "+upi],

            // ["Total Charges","Rs. "+charges],

            // ["Closing Cash","Rs. "+closing],

            // ["Total Transactions",filteredTransactions.length]

        // ]

    // });

    // ==========================
    // TRANSACTIONS
    // ==========================

    const rows=[];

    filteredTransactions.forEach((item,index)=>{

        rows.push([

            index+1,

            formatReportDate(item.date),

            marathiToEnglishNumber(item.time),

            item.bank==="FINO"
            ? "Fino"
            : "BOM",

            getTypeName(item.type),

            item.customer,

            item.amount,

            item.charge

        ]);

    });

    // doc.autoTable({

        // startY:doc.lastAutoTable.finalY+10,

        // theme:"striped",

        // head:[[

            // "Sr",

            // "Date",

            // "Time",

            // "Bank",

            // "Type",

            // "Customer",

            // "Amount",

            // "Charge"

        // ]],

        // body:rows

    // });
	
	doc.autoTable({

    startY: doc.lastAutoTable.finalY + 8,

    theme: "striped",

    styles: {

        fontSize: 9,

        cellPadding: 3,

        valign: "middle"

    },

    headStyles: {

        fillColor: [0, 91, 170],

        textColor: [255, 255, 255],

        fontStyle: "bold"

    },

    alternateRowStyles: {

        fillColor: [245, 248, 255]

    },

    head: [[

        "Sr",

        "Date",

        "Time",

        "Bank",

        "Type",

        "Customer",

        "Amount",

        "Charge"

    ]],

    body: rows

});

    // ==========================
    // FOOTER
    // ==========================

    // const pageHeight =
        // doc.internal.pageSize.height;

    // doc.setFontSize(9);

    // doc.text(

        // "Generated by Fino Payment bank Cash Manager System",

        // 105,

        // pageHeight-10,

        // {

            // align:"center"

        // }

    // );
const pageHeight = doc.internal.pageSize.height;

doc.setDrawColor(180);
doc.line(14, pageHeight - 22, 196, pageHeight - 22);

doc.setFontSize(9);
doc.setTextColor(100);

doc.text(
    "Generated by FINO PAYMENT BANK CASH Management System",
    105,
    pageHeight - 14,
    { align: "center" }
);

doc.text(
    "Date & Time : " +
    new Date().toLocaleString("en-IN"),
    105,
    pageHeight - 8,
    { align: "center" }
);
    doc.save(

         "FinoPaymentBank_Report_"

         +

         reportDate

        +

        ".pdf"

    );

}
function marathiToEnglishNumber(value) {

    if (!value) return "";

    const map = {
        "०":"0",
        "१":"1",
        "२":"2",
        "३":"3",
        "४":"4",
        "५":"5",
        "६":"6",
        "७":"7",
        "८":"8",
        "९":"9"
    };

    return value.replace(/[०-९]/g, m => map[m]);

}

function formatTime(timeValue) {

    if (!timeValue) return "";

    // Already formatted (09:15 AM)
    if (typeof timeValue === "string" &&
        (timeValue.includes("AM") || timeValue.includes("PM"))) {
        return timeValue;
    }

    // ISO Date/Time
    const date = new Date(timeValue);

    if (!isNaN(date.getTime())) {

        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    }

    return timeValue;
}
function downloadExcel(){


let csv =
"Date,Time,Bank,Transaction Type,Customer Name,Mobile,Aadhaar,Amount,Charges,Remarks\n";
//let csv="Time,Bank,Type,Customer,Amount,Charges\n";




// let rows=

// document.querySelectorAll(
// "#reportTable tr"
// );



// rows.forEach(

// function(row){


// let cols=

// row.querySelectorAll(
// "td"
// );



// let data=[];



// cols.forEach(

// function(col){


// data.push(
// col.innerText
// );


// }

// );



// csv +=

// data.join(",")
// +

// "\n";



// }

// );




// let blob=

// new Blob(

// [csv],

// {

// type:
// "text/csv"

// }

// );

// reportTransactions.filter(

// function(item){


csv +=
`${formatReportDate(item.date)},` +
`${item.time},` +
`${getBankName(item.bank)},` +
`${getTypeName(item.type)},` +
`${item.customer},` +
`${item.mobile},` +
`${item.aadhaar},` +
`${item.amount},` +
`${item.charge},` +
`${item.remarks}\n`;

let totalWithdrawal = 0;
let totalDeposit = 0;
let totalCharges = 0;

reportTransactions.forEach(item => {

    totalCharges += Number(item.charge || 0);

    if(item.type==="withdrawal" ||
       item.type==="cashout" ||
       item.type==="upi"){

        totalWithdrawal += Number(item.amount);

    }

    if(item.type==="deposit" ||
       item.type==="cashin"){

        totalDeposit += Number(item.amount);

    }

});

let remainingCash =
openingCash
-
totalWithdrawal
+
totalDeposit;
csv += "\n";
csv += "==============================\n";
csv += "DAILY SUMMARY\n";
csv += "==============================\n";

csv += `Opening Cash,${openingCash}\n`;
csv += `Total Deposit,${totalDeposit}\n`;
csv += `Total Withdrawal,${totalWithdrawal}\n`;
csv += `Total Charges,${totalCharges}\n`;
csv += `Remaining Cash,${remainingCash}\n`;
csv += `Total Transactions,${filteredTransactions.length}\n`;

// let url=

// URL.createObjectURL(blob);

const reportDate =
document.getElementById("reportDate").value;

link.download =
`CSP_Report_${reportDate}.csv`;

let link=

document.createElement(
"a"
);



// link.href=url;

// const reportDate =
// document.getElementById("reportDate").value;

// link.download=`CSP_Report_${reportDate}.xlsx`;

//"Daily_CSP_Report.csv";



link.click();



//URL.revokeObjectURL(url);



}
function formatReportDate(dateString) {

    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

}


// =========================================================
// END OF REPORT.JS
// =========================================================