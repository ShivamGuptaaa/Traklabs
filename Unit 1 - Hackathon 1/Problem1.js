function sumMaxMin(val1,val2,val3,val4,val5){
let numbers = [val1,val2,val3,val4,val5];
let minValue = Math.min(...numbers);
let maxValue = Math.max(...numbers);
return(minValue+maxValue);
}


console. log(sumMaxMin(100, 100, -200, 300, 0)) // prints 100 because 300+(-200) = 300-200
console. log(sumMaxMin(1, 3, 2, 4, 5)) // prints 6 because 1+5
console. log(sumMaxMin(-1000, -2000, -10, -120, -60)) // prints -2010 because -2000 min and -10 max sums to -2010
