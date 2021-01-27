function isEven(num) {
    return num % 2 === 0;
}

function factorial(num) {
    var fact = 1;
    for (var i = 2; i <= num; i++) {
        fact *= i;
    }
    return fact;
}

function kebabToSnake(kebab) {
    return kebab.replace(/-/g, "_");
}

console.log("Write a function isEven() which takes a single numeric argument and returns true if the number is even, and false otherwise.")
console.log("isEven(4): " + isEven(4));
console.log("isEven(21): " + isEven(21));
console.log("isEven(68): " + isEven(68));
console.log("isEven(333): " + isEven(333));
console.log("Write a function factorial() which takes a single numeric argument and returns the factorial of that number.")
console.log("factorial(5): " + factorial(5));
console.log("factorial(2): " + factorial(2));
console.log("factorial(10): " + factorial(10));
console.log("factorial(0): " + factorial(0));
console.log("Write a function kebabToSnake() which takes a single kebab-cased string argument and returns the snake_cased version.")
console.log('kebabToSnake("hello-world"): ' + kebabToSnake("hello-world"));
console.log('kebabToSnake("dogs-are-awesome"): ' + kebabToSnake("dogs-are-awesome"));
console.log('kebabToSnake("blah"): ' + kebabToSnake("blah"));
