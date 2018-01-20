// Get your shorts on - this is an array workout!
// ## Array Cardio Day 1

// Some data we can work with

const inventors = [
    { first: 'Albert', last: 'Einstein', year: 1879, passed: 1955 },
    { first: 'Isaac', last: 'Newton', year: 1643, passed: 1727 },
    { first: 'Galileo', last: 'Galilei', year: 1564, passed: 1642 },
    { first: 'Marie', last: 'Curie', year: 1867, passed: 1934 },
    { first: 'Johannes', last: 'Kepler', year: 1571, passed: 1630 },
    { first: 'Nicolaus', last: 'Copernicus', year: 1473, passed: 1543 },
    { first: 'Max', last: 'Planck', year: 1858, passed: 1947 },
    { first: 'Katherine', last: 'Blodgett', year: 1898, passed: 1979 },
    { first: 'Ada', last: 'Lovelace', year: 1815, passed: 1852 },
    { first: 'Sarah E.', last: 'Goode', year: 1855, passed: 1905 },
    { first: 'Lise', last: 'Meitner', year: 1878, passed: 1968 },
    { first: 'Hanna', last: 'HammarstrÃ¶m', year: 1829, passed: 1909 }
];

const people = ['Beck, Glenn', 'Becker, Carl', 'Beckett, Samuel', 'Beddoes, Mick', 'Beecher, Henry', 'Beethoven, Ludwig', 'Begin, Menachem', 'Belloc, Hilaire', 'Bellow, Saul', 'Benchley, Robert', 'Benenson, Peter', 'Ben-Gurion, David', 'Benjamin, Walter', 'Benn, Tony', 'Bennington, Chester', 'Benson, Leana', 'Bent, Silas', 'Bentsen, Lloyd', 'Berger, Ric', 'Bergman, Ingmar', 'Berio, Luciano', 'Berle, Milton', 'Berlin, Irving', 'Berne, Eric', 'Bernhard, Sandra', 'Berra, Yogi', 'Berry, Halle', 'Berry, Wendell', 'Bethea, Erin', 'Bevan, Aneurin', 'Bevel, Ken', 'Biden, Joseph', 'Bierce, Ambrose', 'Biko, Steve', 'Billings, Josh', 'Biondo, Frank', 'Birrell, Augustine', 'Black, Elk', 'Blair, Robert', 'Blair, Tony', 'Blake, William'];

// Array.prototype.filter()
// 1. Filter the list of inventors for those who were born in the 1500's
var inventors_1500s = inventors.filter(inventor => inventor.year >= 1500 && inventor.year < 1600);
console.log("1. Filter the list of inventors for those who were born in the 1500's")
console.table(inventors_1500s);

// Array.prototype.map()
// 2. Give us an array of the inventors' first and last names
var inventors_names = inventors.map(inventor => `${inventor.first} ${inventor.last}`);
console.log("2. Give us an array of the inventors' first and last names")
console.table(inventors_names);

// Array.prototype.sort()
// 3. Sort the inventors by birthdate, oldest to youngest
//var inventors_sortBirth = inventors.sort((a,b) => a.year - b.year);
var inventors_sortBirth = inventors.slice().sort((a,b) => a.year > b.year ? 1 : -1);
console.log("3. Sort the inventors by birthdate, oldest to youngest")
console.table(inventors_sortBirth);

// Array.prototype.reduce()
// 4. How many years did all the inventors live?
var inventors_totalYearsLived = inventors.reduce((acc,nxt) => (acc + (nxt.passed - nxt.year)), 0);
console.log("4. How many years did all the inventors live?")
console.log(inventors_totalYearsLived);

// 5. Sort the inventors by years lived
var inventors_tallyYearsLived = inventors.map(inventor => ({name: inventor.first + ' ' + inventor.last, years_lived: inventor.passed - inventor.year}));
console.table(inventors_tallyYearsLived);
var inventors_sortYearsLived = inventors.slice().sort((a,b) => (b.passed - b.year) - (a.passed - a.year));
console.log("5. Sort the inventors by years lived")
console.table(inventors_sortYearsLived);

// 6. create a list of Boulevards in Paris that contain 'de' anywhere in the name
// https://en.wikipedia.org/wiki/Category:Boulevards_in_Paris
//Array.from(document.querySelectorAll(".mw-category a")).map(link => link.textContent).filter(linkText => linkText.includes("de"))


// 7. sort Exercise
// Sort the people alphabetically by last name
//var people_sorted = people.sort();
var people_sorted2 = people.sort((a,b) => {
    const [aLast, aFirst] = a.split(", ");
    const [bLast, bFirst] = b.split(", ");
    return aLast > bLast ? 1 : -1;
})
console.log("7. Sort the people alphabetically by last name")
//console.log(people_sorted);
console.log(people_sorted2);

// 8. Reduce Exercise
// Sum up the instances of each of these
const data = ['car', 'car', 'truck', 'truck', 'bike', 'walk', 'car', 'van', 'bike', 'walk', 'car', 'van', 'car', 'truck'];
var data_instances = data.reduce(function(acc,nxt) {
    if(!acc[nxt]) acc[nxt] = 0;
    acc[nxt]++;
    return acc;
},{})
console.log("8. Reduce Exercise")
console.table(data_instances);