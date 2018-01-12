var num1 = 0, num2 = 0, ans = 0;
var neg1 = false, neg2 = false, hasDecimal = false;
var onOperand2 = false, resetDisp = false;
var optn = "";


$("button").click(function() {
    var pressed = $(this).attr("value");
    var dispText = $("#display").text();
    console.log(typeof pressed);
    
    if($(this).hasClass("optr")) {
        if(onOperand2) {
            eval();
            num1 = ans;
            optn = $(this).attr("value");
            nextOperand();
        } else if(num1 !== 0 || ans !== 0) {
            if(ans !== 0) {
                num1 = ans;
            }
            
            if(pressed == "neg") {
                neg1 = !neg1;
                console.log("neg1")
                
            } else {
                console.log("Insert Operation Logic Here");
                optn = $(this).attr("value");
                nextOperand();
            }
            
        } else {
            console.log("Operation on empty input");
        }
        
    } else if($(this).hasClass("clear")) {
        $("#display").text("0");
        if(pressed == "ce") {
            if(num1 !== 0) {
                num2 = 0;
            } else {
                num1 = 0;
            }
        } else {
            num2 = 0;
            num1 = 0;
            ans = 0;
        }
        
    } else if ($(this).hasClass("decimal")) {
        
        
    } else if ($(this).hasClass("eval")) {
        eval();
        
    } else {
        if(resetDisp || dispText === "0") {
            dispText = "";
            $("#display").text("");
        }
        dispText += pressed;
        $("#display").text(dispText);
        
        if(onOperand2) {
            num2 = Number(dispText);
        } else {
            num1 = Number(dispText);
        }
        
        resetDisp = false;
    }
})

function nextOperand() {
    onOperand2 = true;
    hasDecimal = false;
    resetDisp = true;
}

function eval() {
    switch(optn) {
        case '+':
            ans = num1 + num2;
        case '-':
            ans = num1 - num2;
        case '*':
            ans = num1 * num2;
        case "/":
            ans = num1 / num2;
        default:
            ans = num1 + num2;
    }
    num1 = 0;
    num2 = 0;
    $("#display").text(ans);
    onOperand2 = false;
    resetDisp = false;
}