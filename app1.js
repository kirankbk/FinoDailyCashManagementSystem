/* ==========================================================
   FINO PAYMENT BANK CASH MANAGER
   Phase 2B JavaScript
   Part 3A
==========================================================*/


// =====================================
// STORAGE KEYS
// =====================================


const STORAGE = {

    TRANSACTIONS : "transactions",

    DAILY_OPENING : "dailyOpening",

    DAILY_HISTORY : "dailyHistory",

    CASH_ADJUSTMENT : "cashAdjustment"

};



// =====================================
// GET DATA FROM LOCAL STORAGE
// =====================================


function getStorage(key){

    let data = localStorage.getItem(key);

    return data ? JSON.parse(data) : [];

}



// =====================================
// SAVE DATA
// =====================================


function saveStorage(key,data){

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}



// =====================================
// CURRENT DATE
// =====================================


function getCurrentDate(){


    let today = new Date();


    let year = today.getFullYear();


    let month = String(
        today.getMonth()+1
    ).padStart(2,"0");


    let day = String(
        today.getDate()
    ).padStart(2,"0");


    return `${year}-${month}-${day}`;


}




// =====================================
// DISPLAY DATE TIME
// =====================================


function loadDateTime(){


    let now = new Date();


    document.getElementById("currentDate")
    .innerHTML =
    now.toLocaleDateString("en-IN");


    document.getElementById("currentTime")
    .innerHTML =
    now.toLocaleTimeString("en-IN");


}



setInterval(
    loadDateTime,
    1000
);


loadDateTime();




// =====================================
// LOAD PREVIOUS DAY CHARGES
// =====================================


function getPreviousDayCharges(){


    let history =
    getStorage(
        STORAGE.DAILY_HISTORY
    );


    if(history.length === 0){

        return 0;

    }



    let lastDay =
    history[
        history.length - 1
    ];



    return Number(
        lastDay.carryForwardCharges || 0
    );


}





// =====================================
// INITIAL DAY OPENING LOAD
// =====================================


function loadOpeningData(){



    let today =
    getCurrentDate();



    let opening =
    localStorage.getItem(
        STORAGE.DAILY_OPENING
    );



    if(opening){


        opening =
        JSON.parse(opening);



        if(opening.date === today){


            fillOpeningForm(opening);


            updateDashboard();


            return;


        }


    }



    // NEW DAY


    document.getElementById(
        "openingDate"
    ).value = today;



    let previousCharges =
    getPreviousDayCharges();



    document.getElementById(
        "previousCharges"
    ).value =
    previousCharges;



    document.getElementById(
        "previousChargesCard"
    ).innerHTML =
    "₹ " +
    previousCharges.toLocaleString("en-IN");


}





// =====================================
// FILL OPENING DATA
// =====================================


function fillOpeningForm(data){



    openingDate.value =
    data.date;


    openingCash.value =
    data.openingCash;


    cashAdded.value =
    data.cashAdded;


    previousCharges.value =
    data.previousCharges;


}




// =====================================
// SAVE DAY OPENING
// =====================================


document
.getElementById("saveOpeningBtn")
.addEventListener(
"click",
function(){



    let openingData = {


        date:getCurrentDate(),


        openingCash:
        Number(
            document.getElementById(
            "openingCash"
            ).value || 0
        ),


        previousCharges:
        Number(
            document.getElementById(
            "previousCharges"
            ).value || 0
        ),


        cashAdded:
        Number(
            document.getElementById(
            "cashAdded"
            ).value || 0
        ),


        cashRemoved:0,


        todayCharges:0,


        remarks:
        document.getElementById(
        "openingRemarks"
        ).value


    };



    localStorage.setItem(

        STORAGE.DAILY_OPENING,

        JSON.stringify(openingData)

    );



    alert(
        "Day Opening Saved Successfully"
    );



    updateDashboard();



});


/* ==========================================================
   PHASE 2B - PART 3B
   Dashboard & Cash Calculation Engine
==========================================================*/



// =====================================
// GET TODAY OPENING DATA
// =====================================

function getTodayOpening(){


    let data =
    localStorage.getItem(
        STORAGE.DAILY_OPENING
    );


    if(data){

        return JSON.parse(data);

    }


    return {

        openingCash:0,

        cashAdded:0,

        cashRemoved:0,

        previousCharges:0,

        todayCharges:0

    };

}



// =====================================
// GET TODAY TRANSACTIONS
// =====================================


function getTodayTransactions(){


    let transactions =
    getStorage(
        STORAGE.TRANSACTIONS
    );


    let today =
    getCurrentDate();



    return transactions.filter(
        item =>
        item.date === today
    );


}




// =====================================
// CALCULATE CASH FLOW
// =====================================


function calculateCash(){


    let opening =
    getTodayOpening();



    let transactions =
    getTodayTransactions();



    let cash =
    Number(opening.openingCash || 0);



    // Add Cash Added

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
        Number(item.amount || 0);



        let type =
        item.type;



        let charge =
        Number(item.charge || 0);



        todayCharges += charge;



        /*
            Cash Flow Logic

            Deposit:
            Customer gives cash
            Cash increases

            Withdrawal:
            Give cash
            Cash decreases

            UPI:
            Money received digitally
            Give cash
            Cash decreases

        */


        if(type === "deposit"){

            cash += amount;

        }



        else if(type === "withdrawal"){

            cash -= amount;

        }



        else if(type === "upi"){

            cash -= amount;

        }



        else if(type === "cashin"){

            cash += amount;

        }



        else if(type === "cashout"){

            cash -= amount;

        }


    });



    return {


        cash:cash,


        todayCharges:todayCharges


    };


}




// =====================================
// UPDATE DASHBOARD
// =====================================


function updateDashboard(){

  

    let opening =
    getTodayOpening();



    let calculation =
    calculateCash();



    let totalCharges =

        Number(
            opening.previousCharges || 0
        )

        +

        Number(
            calculation.todayCharges || 0
        );




    // Opening Cash

    document
    .getElementById(
    "openingCashCard"
    )
    .innerHTML =
    "₹ " +
    Number(
        opening.openingCash || 0
    )
    .toLocaleString("en-IN");




    // Previous Charges


    document
    .getElementById(
    "previousChargesCard"
    )
    .innerHTML =
    "₹ " +
    Number(
        opening.previousCharges || 0
    )
    .toLocaleString("en-IN");





    // Today's Charges


    document
    .getElementById(
    "todayChargesCard"
    )
    .innerHTML =
    "₹ " +
    calculation.todayCharges
    .toLocaleString("en-IN");





    // Total Charges


    document
    .getElementById(
    "totalChargesCard"
    )
    .innerHTML =
    "₹ " +
    totalCharges
    .toLocaleString("en-IN");





    // Current Cash


    document
    .getElementById(
    "currentCashCard"
    )
    .innerHTML =
    "₹ " +
    calculation.cash
    .toLocaleString("en-IN");





    // Summary Section


    if(document.getElementById(
        "availableCashSummary"
    )){


        document
        .getElementById(
        "availableCashSummary"
        )
        .innerHTML =
        "₹ " +
        calculation.cash
        .toLocaleString("en-IN");


    }



    if(document.getElementById(
        "todayChargesSummary"
    )){


        document
        .getElementById(
        "todayChargesSummary"
        )
        .innerHTML =
        "₹ " +
        calculation.todayCharges
        .toLocaleString("en-IN");


    }




}





// =====================================
// UPDATE AFTER PAGE LOAD
// =====================================


document.addEventListener(
"DOMContentLoaded",
function(){


    loadOpeningData();


    updateDashboard();
  updateCashAdjustmentSummary();

});

/* ==========================================================
   PHASE 2B - PART 3C
   Cash Adjustment Engine
==========================================================*/


// =====================================
// SAVE CASH ADJUSTMENT
// =====================================


document
.getElementById("saveAdjustmentBtn")
.addEventListener(
"click",
function(){


    let type =
    document.getElementById(
        "adjustmentType"
    ).value;



    let amount =
    Number(
        document.getElementById(
            "adjustmentAmount"
        ).value || 0
    );



    let source =
    document.getElementById(
        "cashSource"
    ).value;



    let remarks =
    document.getElementById(
        "adjustmentRemarks"
    ).value;



    if(amount <= 0){

        alert(
            "कृपया योग्य रक्कम टाका"
        );

        return;

    }




    let adjustment = {


        id:Date.now(),


        date:getCurrentDate(),


        time:
        new Date()
        .toLocaleTimeString(
            "en-IN",
            {
                hour:"2-digit",
                minute:"2-digit",
                second:"2-digit",
                hour12:true
            }
        ),


        type:type,


        amount:amount,


        source:source,


        remarks:remarks


    };




    let adjustments =
    getStorage(
        STORAGE.CASH_ADJUSTMENT
    );



    adjustments.push(
        adjustment
    );



    saveStorage(
        STORAGE.CASH_ADJUSTMENT,
        adjustments
    );



    updateOpeningCashAdjustment(
        type,
        amount
    );



    clearAdjustmentForm();



    updateDashboard();



    alert(
        "Cash Adjustment Saved Successfully"
    );



});

// =====================================
// UPDATE OPENING CASH ADJUSTMENT
// =====================================


function updateOpeningCashAdjustment(
    type,
    amount
){


    let opening =
    getTodayOpening();



    if(type === "add"){


        opening.cashAdded =
        Number(
            opening.cashAdded || 0
        )
        +
        amount;


    }



    else if(type === "remove"){


        opening.cashRemoved =
        Number(
            opening.cashRemoved || 0
        )
        +
        amount;


    }




    localStorage.setItem(

        STORAGE.DAILY_OPENING,

        JSON.stringify(opening)

    );


}

// =====================================
// CLEAR ADJUSTMENT FORM
// =====================================


function clearAdjustmentForm(){


    document.getElementById(
        "adjustmentAmount"
    ).value="";


    document.getElementById(
        "adjustmentRemarks"
    ).value="";


}

// =====================================
// UPDATE CASH ADJUSTMENT SUMMARY
// =====================================


function updateCashAdjustmentSummary(){


    let adjustments =
    getStorage(
        STORAGE.CASH_ADJUSTMENT
    );



    let today =
    getCurrentDate();



    let todayAdjustment =
    adjustments.filter(
        item =>
        item.date === today
    );



    let added = 0;

    let removed = 0;



    todayAdjustment.forEach(
    function(item){


        if(item.type === "add"){


            added += Number(
                item.amount
            );


        }


        else{


            removed += Number(
                item.amount
            );


        }


    });




    document
    .getElementById(
        "totalCashAdded"
    )
    .innerHTML =
    "₹ " +
    added.toLocaleString("en-IN");



    document
    .getElementById(
        "totalCashRemoved"
    )
    .innerHTML =
    "₹ " +
    removed.toLocaleString("en-IN");



}

/* ==========================================================
   PHASE 2B - PART 3D
   Transaction Engine Integration
==========================================================*/


// =====================================
// AUTO SERVICE CHARGE
// =====================================


document
.getElementById("amount")
.addEventListener(
"input",
function(){


    let amount =
    Number(this.value || 0);



    let charge = 0;



    if(amount > 0){

        charge =
        Math.floor(amount / 100) * 1;

    }



    document
    .getElementById("charge")
    .value =
    charge;


});

// =====================================
// VALIDATION
// =====================================


function validateTransaction(){


    let errors=[];



    let type =
    document.getElementById(
        "transactionType"
    ).value;



    let amount =
    Number(
        document.getElementById(
        "amount"
        ).value || 0
    );



    let aadhaar =
    document.getElementById(
        "aadhaar"
    ).value;



    if(type===""){

        errors.push(
            "व्यवहार प्रकार निवडा"
        );

    }



    if(amount<=0){

        errors.push(
            "व्यवहार रक्कम टाका"
        );

    }



    if(
        aadhaar &&
        aadhaar.length !==12
    ){

        errors.push(
            "आधार क्रमांक 12 अंकी असावा"
        );

    }



    return errors;

}

// =====================================
// SHOW ERROR
// =====================================


function showError(errors){


    let box =
    document.getElementById(
        "errorBox"
    );


    box.innerHTML =
    "<ul>" +
    errors.map(
        e=>`<li>${e}</li>`
    ).join("")
    +
    "</ul>";



    box.style.display="block";



    setTimeout(
        ()=>{

            box.style.display="none";

        },
        5000
    );


}

// =====================================
// SAVE TRANSACTION
// =====================================


document
.getElementById("application-form")
.addEventListener(
"submit",
function(e){


    e.preventDefault();



    let errors =
    validateTransaction();



    if(errors.length>0){

        showError(errors);

        return;

    }




    let transaction={



        id:Date.now(),



        date:getCurrentDate(),



        time:
        new Date()
        .toLocaleTimeString(
            "en-IN",
            {
            hour:"2-digit",
            minute:"2-digit",
            second:"2-digit",
            hour12:true
            }
        ),



        bank:
        document.getElementById(
            "bank"
        ).value,



        type:
        document.getElementById(
            "transactionType"
        ).value,



        customer:
        document.getElementById(
            "customerName"
        ).value,



        mobile:
        document.getElementById(
            "mobile"
        ).value,



        aadhaar:
        document.getElementById(
            "aadhaar"
        ).value,



        amount:
        Number(
            document.getElementById(
            "amount"
            ).value
        ),



        charge:
        Number(
            document.getElementById(
            "charge"
            ).value
        ),



        remarks:
        document.getElementById(
            "remarks"
        ).value


    };




    let transactions =
    getStorage(
        STORAGE.TRANSACTIONS
    );



    transactions.push(
        transaction
    );



    saveStorage(
        STORAGE.TRANSACTIONS,
        transactions
    );



    updateTodayCharges();



    clearTransactionForm();



    updateDashboard();



    loadTransactionTable();



    alert(
        "व्यवहार यशस्वीपणे जतन झाला"
    );



});

// =====================================
// UPDATE TODAY CHARGES
// =====================================


function updateTodayCharges(){


    let opening =
    getTodayOpening();



    let transactions =
    getTodayTransactions();



    let charges=0;



    transactions.forEach(
    item=>{


        charges +=
        Number(
            item.charge || 0
        );


    });



    opening.todayCharges =
    charges;



    localStorage.setItem(

        STORAGE.DAILY_OPENING,

        JSON.stringify(opening)

    );


}

// =====================================
// CLEAR FORM
// =====================================


function clearTransactionForm(){


    document
    .getElementById(
        "application-form"
    )
    .reset();



    document
    .getElementById(
        "charge"
    )
    .value=0;


}