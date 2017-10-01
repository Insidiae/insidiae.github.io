function printReverse(arr) {
    for (var i = arr.length - 1; i >= 0; i--) {
        console.log(arr[i]);
    }
}

function isUniform(arr) {
    var uni = arr[0];
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] !== uni) {
            return false;
        }
    }
    return true;
}

function sumArray(arr) {
    sum = 0;
    arr.forEach(function (num) {
        sum += num;
    });
    return sum;
}

function max(arr) {
    imum = arr[0];
    arr.forEach(function (num) {
        if (num > imum) {
            imum = num;
        }
    });
    return imum;
}

console.log("Write a function printReverse() that takes an array as an argument and prints out the elements in the array in reverse order (don't actually reverse the array itself)");
console.log("printReverse([1,2,3,4]):");
printReverse([1, 2, 3, 4]);
console.log('printReverse(["a", "b", "c"]):');
printReverse(["a", "b", "c"]);
console.log("Write a function isUniform() that takes an array as an argument and returns true if all elements in the array are identical");
console.log("isUniform([1,1,1,1]): " + isUniform([1, 1, 1, 1]));
console.log("isUniform([2,1,1,1]): " + isUniform([2, 1, 1, 1]));
console.log('isUniform(["a","b","p"]): ' + isUniform(["a", "b", "p"]));
console.log('isUniform(["b","b","b"]): ' + isUniform(["b", "b", "b"]));
console.log("Write a function sumArray() that accepts an array of numbers and returns the sum of all the numbers in the array")
console.log("sumArray([1,2,3]): " + sumArray([1, 2, 3]));
console.log("sumArray([10,3,10,4]): " + sumArray([10, 3, 10, 4]));
console.log("sumArray([-5,100]): " + sumArray([-5, 100]));
console.log("Write a function max() that accepts an array of numbers and returns the maximum number in the array")
console.log("max([1,2,3]): " + max([1, 2, 3]));
console.log("max([10,3,10,4]): " + max([10, 3, 10, 4]));
console.log("max([-5,100]): " + max([-5, 100]));
