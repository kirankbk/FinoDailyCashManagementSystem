/* =========================================================
   DHANADAYI CSP CASH MANAGER
   app.js

   PART 3A
   Core Setup + Local Storage
=========================================================*/


// =========================================================
// GLOBAL VARIABLES
// =========================================================

let openingCash = 0;

let transactions = [];


// =========================================================
// APPLICATION START
// =========================================================

document.addEventListener("DOMContentLoaded", function(){


    loadApplication();


});



// =========================================================
// LOAD APPLICATION
// =========================================================

function loadApplication(){

debugger
    showTodayDate();


    loadOpeningCash();


    loadTransactions();


    updateDashboard();


}



// =========================================================
// SHOW TODAY DATE
// =========================================================

function showTodayDate(){


    const dateElement =
        document.getElementById("todayDate");


    if(dateElement){


        let today = new Date();


        let date = today.toLocaleDateString(
            "mr-IN",
            {
                day:"2-digit",
                month:"long",
                year:"numeric"
            }
        );


        dateElement.innerHTML =
            "📅 " + date;


    }


}



// =========================================================
// LOCAL STORAGE KEYS
// =========================================================

const STORAGE_KEYS = {


    OPENING_CASH:
        "dhanadayi_opening_cash",


    TRANSACTIONS:
        "dhanadayi_transactions"


};



// =========================================================
// SAVE OPENING CASH
// =========================================================


const saveOpeningBtn =
    document.getElementById(
        "saveOpeningCash"
    );


if(saveOpeningBtn){


    saveOpeningBtn.addEventListener(
        "click",
        function(){


            let amount =
            Number(
                document.getElementById(
                    "openingCash"
                ).value
            );



            if(!amount || amount<=0){


                alert(
                    "कृपया सुरुवातीची रोकड भरा"
                );


                return;


            }



            openingCash = amount;



            localStorage.setItem(

                STORAGE_KEYS.OPENING_CASH,

                amount

            );



            updateDashboard();



            alert(
                "Opening Cash Saved Successfully"
            );



        }
    );


}

function redirectReport() {
debugger
    
        window.location.href = "reports.html";

    

}

// =========================================================
// LOAD OPENING CASH
// =========================================================

function loadOpeningCash(){



    let savedCash =

        localStorage.getItem(

            STORAGE_KEYS.OPENING_CASH

        );



    if(savedCash){


        openingCash =
            Number(savedCash);



        let input =
            document.getElementById(
                "openingCash"
            );


        if(input){

            input.value =
                openingCash;

        }


    }



}



// =========================================================
// TRANSACTION DATA LOAD
// =========================================================


function loadTransactions(){

debugger

    let data =

        localStorage.getItem(

            STORAGE_KEYS.TRANSACTIONS

        );



    if(data){


        transactions =
            JSON.parse(data);


    }

    else{


        transactions = [];


    }



}



// =========================================================
// SAVE TRANSACTIONS
// =========================================================


function saveTransactions(){



    localStorage.setItem(

        STORAGE_KEYS.TRANSACTIONS,

        JSON.stringify(
            transactions
        )

    );


}



// =========================================================
// CURRENCY FORMAT
// =========================================================


function formatMoney(amount){


    return "₹" +

    Number(amount).toLocaleString(
        "en-IN"
    );


}



// =========================================================
// GET CURRENT CASH
// =========================================================


function getCurrentCash(){


    let cash =
        openingCash;



    transactions.forEach(
        function(item){


            if(
                item.type === "withdrawal" ||
                item.type === "upi" ||
                item.type === "cashout"
            ){


                cash -=
                    Number(
                        item.amount
                    );


            }



            else if(

                item.type === "deposit" ||
                item.type === "cashin"

            ){


                cash +=
                    Number(
                        item.amount
                    );


            }



        }
    );



    return cash;



}



// =========================================================
// BASIC DASHBOARD UPDATE
// =========================================================

function updateDashboard(){



    let currentCash =
        getCurrentCash();



    let openingCard =
        document.getElementById(
            "openingCashCard"
        );


    let currentCard =
        document.getElementById(
            "currentCashCard"
        );


    let liveCash =
        document.getElementById(
            "liveCash"
        );



    if(openingCard){

        openingCard.innerHTML =
            formatMoney(openingCash);

    }



    if(currentCard){

        currentCard.innerHTML =
            formatMoney(currentCash);

    }



    if(liveCash){

        liveCash.innerHTML =
            formatMoney(currentCash);

    }



    let count =
        document.getElementById(
            "transactionCount"
        );



    if(count){

        count.innerHTML =
            transactions.length;

    }



}



// =========================================================
// END OF PART 3A
// =========================================================

/* =========================================================
   PART 3B
   TRANSACTION ENGINE
=========================================================*/


// =========================================================
// ELEMENT REFERENCES
// =========================================================

const amountInput =
    document.getElementById("amount");


const chargeInput =
    document.getElementById("charge");


// =========================================================
// AUTOMATIC CHARGE CALCULATION
// RULE:
// Every ₹1000 = ₹10
// =========================================================


if(amountInput){


    amountInput.addEventListener(
        "input",
        function(){


            let amount =
                Number(
                    this.value
                );



            let charge =
                calculateCharge(amount);



            if(chargeInput){

                chargeInput.value =
                    charge;

            }


        }
    );


}



// =========================================================
// CHARGE FUNCTION
// =========================================================


function calculateCharge(amount){


    if(!amount || amount <=0){

        return 0;

    }


    return Math.floor(
        amount / 100
    );


}



// =========================================================
// SAVE TRANSACTION BUTTON
// =========================================================


const saveTransactionBtn =

     document.getElementById(
         "saveTransaction"
     );



 if(saveTransactionBtn){


saveTransactionBtn.addEventListener(

 "click",

 function(){


   addTransaction();


 }

 );


}
function validateTransaction(){
debugger

    let errors=[];


    clearErrors();


    let type =
    document.getElementById(
        "transactionType"
    );


    let customer =
    document.getElementById(
        "customerName"
    );


    let aadhaar =
    document.getElementById(
        "aadhaar"
    );


    let amount =
    document.getElementById(
        "amount"
    );



    if(type.value===""){

        errors.push(
        "कृपया व्यवहार प्रकार निवडा"
        );

        type.classList.add(
        "input-error"
        );

    }



    if(customer.value.trim()===""){


        errors.push(
        "कृपया ग्राहकाचे नाव टाका"
        );


        customer.classList.add(
        "input-error"
        );


    }



    if(aadhaar.value===""){


        errors.push(
        "कृपया आधार क्रमांक टाका"
        );


        aadhaar.classList.add(
        "input-error"
        );


    }


    else if(
        aadhaar.value.length!==12
    ){


        errors.push(
        "आधार क्रमांक 12 अंकी असणे आवश्यक आहे"
        );


        aadhaar.classList.add(
        "input-error"
        );


    }




    if(!amount.value || amount.value<=0){


        errors.push(
        "कृपया व्यवहाराची रक्कम टाका"
        );


        amount.classList.add(
        "input-error"
        );


    }




    showErrors(errors);



    return errors.length===0;



}



// Show Error

function showErrors(errors){


let box =
document.getElementById(
"errorBox"
);


if(errors.length>0){


box.style.display="block";


box.innerHTML =

"<ul>" +

errors.map(
e=>`<li>${e}</li>`
)
.join("")
+

"</ul>";



}

else{


box.style.display="none";


}


}



// Clear Error

function clearErrors(){


document
.querySelectorAll(
".input-error"
)
.forEach(

el=>{

el.classList.remove(
"input-error"
);

}

);


}


// Clear Error

function clearErrors(){


document
.querySelectorAll(
".input-error"
)
.forEach(

el=>{

el.classList.remove(
"input-error"
);

}

);


}
//close for today

document
.getElementById("closeDayBtn")
.addEventListener(
"click",
function(){
 localStorage.getItem(

            STORAGE_KEYS.TRANSACTIONS

        );
debugger
    let calculation = calculateCash();


    let opening = getTodayOpening();


    let totalCharges =
        Number(opening.previousCharges || 0)
        +
        Number(calculation.todayCharges || 0);



    let dailyHistory =
    JSON.parse(
        localStorage.getItem("dailyHistory")
    ) || [];



    let eodData = {


        date:getCurrentDate(),


        openingCash:
        opening.openingCash,


        closingCash:
        calculation.cash,


        todayCharges:
        calculation.todayCharges,


        totalCharges:
        totalCharges,


        carryForwardCharges:
        totalCharges


    };



    dailyHistory.push(eodData);



    localStorage.setItem(
        "dailyHistory",
        JSON.stringify(dailyHistory)
    );



    alert(
        "EOD Completed Successfully"
    );


});

// =====================================
// GET TODAY OPENING DATA
// =====================================

function getTodayOpening(){


    let opening =
    localStorage.getItem(
        "dailyOpening"
    );



    if(opening){


        return JSON.parse(opening);


    }



    // Default if no opening saved

    return {


        date:getCurrentDate(),


        openingCash:0,


        cashAdded:0,


        cashRemoved:0,


        previousCharges:0,


        todayCharges:0


    };


}

// =====================================
// CALCULATE AVAILABLE CASH
// =====================================

function calculateCash(){



    let opening =
    getTodayOpening();



    let transactions =
    getTodayTransactions();



    let cash =
    Number(
        opening.openingCash || 0
    );



    // Add Cash Adjustment

    cash += Number(
        opening.cashAdded || 0
    );



    // Remove Cash Adjustment

    cash -= Number(
        opening.cashRemoved || 0
    );



    let todayCharges = 0;



    transactions.forEach(
    function(item){



        let amount =
        Number(
            item.amount || 0
        );



        let charge =
        Number(
            item.charge || 0
        );



        todayCharges += charge;



        switch(item.type){



            // Customer deposits money
            // Cash increases

            case "deposit":


                cash += amount;


                break;




            // AEPS Withdrawal
            // You give cash

            case "withdrawal":


                cash -= amount;


                break;




            // PhonePe / UPI received
            // You give cash

            case "upi":


                cash -= amount;


                break;




            // Cash added manually

            case "cashin":


                cash += amount;


                break;




            // Cash removed manually

            case "cashout":


                cash -= amount;


                break;


        }



    });



    return {


        cash:cash,


        todayCharges:todayCharges,


        transactionCount:
        transactions.length


    };



}
function getPreviousCharges(){


    let dailyHistory =
    JSON.parse(
        localStorage.getItem("dailyHistory")
    ) || [];



    if(dailyHistory.length === 0){

        return 0;

    }



    let lastRecord =
    dailyHistory[
        dailyHistory.length - 1
    ];



    return Number(
        lastRecord.carryForwardCharges || 0
    );


}

// =====================================
// GET TODAY TRANSACTIONS
// =====================================


function getTodayTransactions(){
debugger


    let transactions =
    JSON.parse(
        localStorage.getItem(
             STORAGE_KEYS.TRANSACTIONS
        )
    ) || [];



    let today =
    getCurrentDate();



    return transactions.filter(
        function(item){


            return item.date === today;


        }
    );


}
// =======================================
// DAILY CASH MANAGEMENT
// =======================================


function loadPreviousDayData(){


let history =
JSON.parse(
localStorage.getItem("dailyHistory")
) || [];



if(history.length > 0){


let lastDay =
history[history.length-1];

setValue(
        "previousDayCash",
        lastDay.closingCash
    );


// document.getElementById(
// "previousDayCash"
// ).innerHTML =
// "₹ "+
// (lastDay.closingCash || 0)
// .toLocaleString("en-IN");

setValue(
        "previousDayCharges",
        lastDay.totalCharges
    );

// document.getElementById(
// "previousDayCharges"
// ).innerHTML =
// "₹ "+
// (lastDay.totalCharges || 0)
// .toLocaleString("en-IN");

setValue(
        "oldCharges",
        lastDay.totalCharges
    );

// document.getElementById(
// "oldCharges"
// ).innerHTML =
// "₹ "+
// (lastDay.totalCharges || 0)
// .toLocaleString("en-IN");


}

}





// SAVE / UPDATE OPENING CASH


document
.getElementById("saveOpeningCash")
.addEventListener(
"click",
function(){

debugger

let openingCash =
Number(
document.getElementById(
"openingCash"
).value || 0
);



let updateCash =
Number(
document.getElementById(
"updateCash"
).value || 0
);




let finalCash =
openingCash + updateCash;



let openingData={


date:new Date()
.toISOString()
.split("T")[0],


openingCash:finalCash,


previousCharges:
getPreviousCharges(),


todayCharges:0,


totalCharges:
getPreviousCharges()


};

updateReports();


localStorage.setItem(
"dailyOpening",
JSON.stringify(openingData)
);



alert(
"Opening Cash Updated Successfully"
);



updateDashboard();


});

// =========================================================
// ADD TRANSACTION
// =========================================================
function validateTransactions() {

    let errors = [];

     const banktype = document.getElementById("bank");
    const type = document.getElementById("transactionType");
    const amount = document.getElementById("amount");
    const aadhaar = document.getElementById("aadhaar");

    clearValidation();

    if (banktype.value === "") {

        errors.push("कृपया बँक निवडा.");
        type.classList.add("input-error");

    }
	
	
    if (type.value === "") {

        errors.push("कृपया व्यवहार प्रकार निवडा.");
        type.classList.add("input-error");

    }

    if (amount.value.trim() === "" || Number(amount.value) <= 0) {

        errors.push("कृपया व्यवहाराची रक्कम भरा.");
        amount.classList.add("input-error");

    }

    if (
        aadhaar.value.trim() !== "" &&
        !/^\d{12}$/.test(aadhaar.value.trim())
    ) {

        errors.push("आधार क्रमांक 12 अंकी असावा.");
        aadhaar.classList.add("input-error");

    }

    if (errors.length > 0) {

        showError(errors);

        return false;

    }

    hideError();

    return true;

}
function showError(messages) {

    const box = document.getElementById("errorBox");

    box.style.display = "block";

    box.innerHTML = `
        <strong>कृपया खालील चुका दुरुस्त करा:</strong>
        <ul>
            ${messages.map(m => `<li>${m}</li>`).join("")}
        </ul>
    `;

}

function hideError() {

    document.getElementById("errorBox").style.display = "none";

}

function clearValidation() {

    document
        .querySelectorAll(".input-error")
        .forEach(el => el.classList.remove("input-error"));

}
function addTransaction(){




    let bank =

    document.getElementById(
        "bank"
    ).value;



    let type =

    document.getElementById(
        "transactionType"
    ).value;



    let customer =

    document.getElementById(
        "customerName"
    ).value;



    let mobile =

    document.getElementById(
        "mobile"
    ).value;



    let aadhaar =

    document.getElementById(
        "aadhaar"
    ).value;



    let amount =

    Number(

    document.getElementById(
        "amount"
    ).value

    );



    let charge =

    Number(

    document.getElementById(
        "charge"
    ).value

    );



    let remarks =

    document.getElementById(
        "remarks"
    ).value;



    // Validation


    // if(!amount || amount<=0){


        // alert(
            // "कृपया रक्कम भरा"
        // );


        // return;

    // }



    let transaction = {


        id:
        Date.now(),
		date:getCurrentDate(),

        //date:new Date().toISOString().split("T")[0],
        // new Date().toLocaleDateString(
            // "mr-IN"
        // ),


        time:
        new Date().toLocaleTimeString(
            "mr-IN"
        ),


        bank:bank,


        type:type,


        customer:customer,


        mobile:mobile,


        aadhaar:aadhaar,


        amount:amount,


        charge:charge,


        remarks:remarks


    };



    transactions.push(
        transaction
    );



    saveTransactions();



    updateDashboard();
    loadTransactionTable();

   updateReports();
    clearTransactionForm();



    alert(
        "व्यवहार यशस्वीपणे सेव्ह झाला"
    );



}

function getCurrentDate() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// =========================================================
// CLEAR FORM AFTER SAVE
// =========================================================


function clearTransactionForm(){


    let fields = [

        "customerName",

        "mobile",

        "aadhaar",

        "amount",

        "charge",

        "remarks"

    ];



    fields.forEach(
        function(id){


            let element =
                document.getElementById(id);



            if(element){


                element.value="";


            }


        }
    );



}



// =========================================================
// TRANSACTION TYPE LABEL HELPER
// =========================================================


function getTransactionName(type){



    let names = {


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



    return names[type] || type;


}



// =========================================================
// BANK NAME HELPER
// =========================================================


function getBankName(bank){


    if(bank==="FINO"){


        return "Fino Payment Bank";


    }


    if(bank==="BOM"){


        return "Bank of Maharashtra";


    }


    return bank;


}

document
.getElementById("saveTransactions")
.addEventListener("click", function(e) {

    e.preventDefault();
    if (!validateTransactions()) {

        return;

    }

    addTransaction();

});

// =========================================================
// END OF PART 3B
// =========================================================

/* =========================================================
   PART 3C
   TRANSACTION DISPLAY & REPORTS
=========================================================*/


// =========================================================
// LOAD TRANSACTION TABLE
// =========================================================

function loadTransactionTable(){


    let tbody =

    document.getElementById(
        "transactionBody"
    );


    if(!tbody){

        return;

    }


    tbody.innerHTML="";



    transactions.forEach(

        function(item,index){



            let row =

            document.createElement(
                "tr"
            );



            let cash =
                calculateBalanceTill(index);



            row.innerHTML = `



<td>

${formatDisplayDate(item.date)}

</td>
<td>

${item.time}

</td>


<td>

<span class="badge ${
item.bank==="FINO"
?
"badge-fino"
:
"badge-bom"
}">

${getBankName(item.bank)}

</span>

</td>



<td>

${getTransactionName(item.type)}

</td>



<td>

${item.customer || "-"}

</td>



<td>

${item.mobile || "-"}

</td>



<td>

₹${Number(item.amount).toLocaleString("en-IN")}

</td>



<td>

₹${Number(item.charge).toLocaleString("en-IN")}

</td>



<td class="balance">

₹${Number(cash).toLocaleString("en-IN")}

</td>



<td>


<button

class="action-btn edit-btn"

onclick="editTransaction(${index})"

>

<i class="fa fa-edit"></i>

</button>



<button

class="action-btn delete-btn"

onclick="deleteTransaction(${index})"

>

<i class="fa fa-trash"></i>

</button>


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
// CALCULATE BALANCE AFTER EACH TRANSACTION
// =========================================================

function calculateBalanceTill(index){



    let cash =
        openingCash;



    for(
        let i=0;
        i<=index;
        i++
    ){


        let item =
            transactions[i];



        if(

            item.type==="withdrawal" ||

            item.type==="upi" ||

            item.type==="cashout"

        ){


            cash -=

            Number(item.amount);



        }


        else{


            cash +=

            Number(item.amount);


        }


    }



    return cash;


}



// =========================================================
// UPDATE ALL REPORTS
// =========================================================


function updateReports(){



    let withdrawal=0;

    let deposit=0;

    let upi=0;

    let charges=0;



    transactions.forEach(

        function(item){



            charges +=

            Number(item.charge);



            switch(item.type){



                case "withdrawal":

                    withdrawal +=

                    Number(item.amount);

                    break;



                case "deposit":

                    deposit +=

                    Number(item.amount);

                    break;



                case "upi":

                    upi +=

                    Number(item.amount);

                    break;



            }



        }

    );



    setValue(
        "totalWithdrawal",
        withdrawal
    );



    setValue(
        "totalDeposit",
        deposit
    );



    setValue(
        "totalUPI",
        upi
    );



    setValue(
        "totalCharges",
        charges
    );



    setValue(
        "chargesCard",
        charges
    );



    setValue(
        "eodOpening",
        openingCash
    );



    setValue(
        "eodClosing",
        getCurrentCash()
    );



    setValue(
        "eodCharges",
        charges
    );



    setValue(
        "eodTransactions",
        transactions.length
    );


}



// =========================================================
// SET VALUE HELPER
// =========================================================


function setValue(id,value){


    let element =

    document.getElementById(id);



    if(element){


        element.innerHTML =

        formatMoney(value);



    }


}



// =========================================================
// DELETE TRANSACTION
// =========================================================


function deleteTransaction(index){



    let confirmDelete =

    confirm(
        "हा व्यवहार Delete करायचा आहे का?"
    );



    if(confirmDelete){



        transactions.splice(
            index,
            1
        );



        saveTransactions();



        refreshApplication();



    }



}



// =========================================================
// EDIT TRANSACTION
// =========================================================


function editTransaction(index){



    let item =

    transactions[index];



    document.getElementById(
        "editIndex"
    ).value=index;



    document.getElementById(
        "editCustomer"
    ).value=item.customer;



    document.getElementById(
        "editMobile"
    ).value=item.mobile;



    document.getElementById(
        "editAmount"
    ).value=item.amount;



    document.getElementById(
        "editCharge"
    ).value=item.charge;



    document.getElementById(
        "editRemarks"
    ).value=item.remarks;



    document.getElementById(
        "editModal"
    ).style.display="flex";



}



// =========================================================
// UPDATE TRANSACTION
// =========================================================


let updateBtn =

document.getElementById(
    "updateTransaction"
);



if(updateBtn){



updateBtn.addEventListener(

"click",

function(){



let index =

Number(

document.getElementById(
"editIndex"
).value

);



transactions[index].customer =

document.getElementById(
"editCustomer"
).value;



transactions[index].mobile =

document.getElementById(
"editMobile"
).value;



transactions[index].amount =

Number(

document.getElementById(
"editAmount"
).value

);



transactions[index].charge =

Number(

document.getElementById(
"editCharge"
).value

);



transactions[index].remarks =

document.getElementById(
"editRemarks"
).value;



saveTransactions();



closeEditModal();



refreshApplication();



});


}



// =========================================================
// CLOSE MODAL
// =========================================================


function closeEditModal(){


let modal =

document.getElementById(
"editModal"
);


if(modal){

modal.style.display="none";

}


}



// =========================================================
// SEARCH TRANSACTION
// =========================================================


let searchBox =

document.getElementById(
"searchTransaction"
);



if(searchBox){



searchBox.addEventListener(

"input",

function(){



let value =

this.value.toLowerCase();



let rows =

document.querySelectorAll(
"#transactionBody tr"
);



rows.forEach(

function(row){



if(
row.innerText
.toLowerCase()
.includes(value)

){


row.style.display="";


}

else{


row.style.display="none";


}



}

);



}

);



}



// =========================================================
// REFRESH EVERYTHING
// =========================================================


function refreshApplication(){



loadTransactionTable();


updateDashboard();


updateReports();


}



// =========================================================
// INITIAL LOAD UPDATE
// =========================================================


document.addEventListener(

"DOMContentLoaded",

function(){

  loadPreviousDayData();
refreshApplication();


}

);



// =========================================================
// END OF PART 3C
// =========================================================


/* =========================================================
   PART 3D
   BACKUP + EXPORT + PRINT MODULE
=========================================================*/


// =========================================================
// EXPORT JSON BACKUP
// =========================================================


const exportBackupBtn =

document.getElementById(
    "exportBackup"
);



if(exportBackupBtn){


exportBackupBtn.addEventListener(

"click",

function(){


    let backupData = {


        application:
        "Dhanadayi CSP Cash Manager",


        date:
        new Date()
        .toISOString(),


        openingCash:
        openingCash,


        transactions:
        transactions



    };



    let data =

    JSON.stringify(
        backupData,
        null,
        4
    );



    let blob =

    new Blob(

        [data],

        {
            type:
            "application/json"
        }

    );



    let url =

    URL.createObjectURL(blob);



    let a =

    document.createElement(
        "a"
    );



    a.href=url;



    a.download=

    "CSP_Backup_"

    +

    new Date()
    .toLocaleDateString()
    +

    ".json";



    a.click();



    URL.revokeObjectURL(url);



}

);


}



// =========================================================
// IMPORT / RESTORE BACKUP
//=========================================================


const importBtn =

document.getElementById(
    "importBackupBtn"
);



const importFile =

document.getElementById(
    "importBackup"
);



if(importBtn){


importBtn.onclick=function(){


    importFile.click();


}


}



if(importFile){



importFile.addEventListener(

"change",

function(event){



let file =

event.target.files[0];



if(!file){

return;

}



let reader =

new FileReader();



reader.onload=function(e){



try{


let data =

JSON.parse(
    e.target.result
);



openingCash =

Number(
data.openingCash
);



transactions =

data.transactions || [];



localStorage.setItem(

STORAGE_KEYS.OPENING_CASH,

openingCash

);



saveTransactions();



refreshApplication();



alert(

"Backup Restore Successful"

);



}

catch(error){



alert(

"Invalid Backup File"

);



}



};



reader.readAsText(file);



}

);



}



// =========================================================
// EXPORT CSV / EXCEL
// =========================================================


const exportExcelBtn =

document.getElementById(
    "exportExcel"
);



if(exportExcelBtn){



exportExcelBtn.addEventListener(

"click",

function(){



let csv =

"Date,Time,Bank,Type,Customer,Mobile,Amount,Charge,Remarks\n";



transactions.forEach(

function(item){



csv +=

`${item.date},`

+

`${item.time},`

+

`${getBankName(item.bank)},`

+

`${getTransactionName(item.type)},`

+

`${item.customer},`

+

`${item.mobile},`

+

`${item.amount},`

+

`${item.charge},`

+

`${item.remarks}\n`;



}

);



let blob =

new Blob(

[csv],

{

type:
"text/csv"

}

);



let url =

URL.createObjectURL(blob);



let link =

document.createElement(
"a"
);



link.href=url;



link.download=

"CSP_Transaction_Report.csv";



link.click();



URL.revokeObjectURL(url);



}

);


}



// =========================================================
// PRINT DAILY REPORT
// =========================================================


const printBtn =

document.getElementById(
    "printReport"
);



if(printBtn){



printBtn.addEventListener(

"click",

function(){



window.print();



}

);



}



// =========================================================
// GENERATE DAILY SUMMARY TEXT
// =========================================================


function generateDailyReport(){



let withdrawal=0;

let deposit=0;

let charges=0;



transactions.forEach(

function(item){



charges +=

Number(
item.charge
);



if(item.type==="withdrawal"){


withdrawal +=

Number(item.amount);


}



if(item.type==="deposit"){


deposit +=

Number(item.amount);


}



}

);



return {


opening:

openingCash,


withdrawal:

withdrawal,


deposit:

deposit,


charges:

charges,


closing:

getCurrentCash(),


total:

transactions.length



};


}



// =========================================================
// END OF PART 3D
// =========================================================

function getDateReport(date){


return transactions.filter(

item=>

item.date===date

);


}