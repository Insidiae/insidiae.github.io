var num1 = 0, num2 = 0, ans = 0;
var hasDecimal = false, onOperand2 = false, resetDisp = false;
var optn = "";


$("button").click(function() {
    var pressed = $(this).attr("value");
    var dispText = $("#display").text();
    
    if($(this).hasClass("optr")) {
        if(onOperand2 && num2 != 0) {
            if(pressed == "neg") {
                num2 = -num2;
                $("#display").text(num2);
                
            } else {
                eval();
                num1 = ans;
                optn = $(this).attr("value");
                nextOperand();
            }
        } else if(num1 !== 0 || ans !== 0) {
            if(ans !== 0) {
                num1 = ans;
            }
            
            if(pressed == "neg") {
                num1 = -num1;
                $("#display").text(num1);
                
            } else {
                optn = $(this).attr("value");
                nextOperand();
            }
            
        } else {
            console.log("Operation on empty input");
        }
        
    } else if($(this).hasClass("clear")) {
        $("#display").text("0");
        hasDecimal = false;
        if(pressed == "ce" && ans == 0) {
            if(num1 !== 0) {
                num2 = 0;
            } else {
                num1 = 0;
            }
        } else {
            onOperand2 = false;
            num2 = 0;
            num1 = 0;
            ans = 0;
        }
        
    } else if ($(this).hasClass("decimal")) {
        if(!hasDecimal && !resetDisp) {
            dispText += pressed;
            $("#display").text(dispText);
            hasDecimal = true;
        }
        
    } else if ($(this).hasClass("eval")) {
        eval();
        
    } else {
        if(resetDisp || dispText === "0") {
            dispText = "";
            $("#display").text("");
        }
        
        if(dispText.length < 10) {
            dispText += pressed;
            $("#display").text(dispText);

            if(onOperand2) {
                num2 = Number(dispText);
            } else {
                num1 = Number(dispText);
            }

            resetDisp = false;
        }
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
            break;
        case '-':
            ans = num1 - num2;
            break;
        case '*':
            ans = num1 * num2;
            break;
        case "/":
            ans = num1 / num2;
            break;
        default:
            ans = num1 + num2;
            break;
    }
    num1 = 0;
    num2 = 0;
    $("#display").text(ans);
    onOperand2 = false;
    hasDecimal = false;
    resetDisp = true;
}