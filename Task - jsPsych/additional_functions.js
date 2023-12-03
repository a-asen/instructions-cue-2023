
////    Diagnostic probability calcuation     ////
/* 
Calculate a probability list that any trials away from the center will appear.
That is, for every one increase/decrease in diagnostic length, we reduce the probability by "math" and "decent".
Set "spare" if some trials around the center should have the same probability. 

For instance, the paramteres "math = linear", "decent = .1", "spare = 1" will generate the list:
[.5, .6, .7, .8, .9, 1,  1,  1, .9, .8, .7, .6, .5]
[ 4,  5,  6,  7,  8, 9, 10, 11, 12, 13, 14,  15, 16] (Diagnostic lengths)

Thus, there is a higher likelihood that lengths of 9, 10 and 11 happen than those further away 
(e.g., 4, 5 at the start and 15, 16 at the end). 
"Spare" saves the first cases around the center.
"Decent" decrease each case away from the spared cases by .1. 
"Math" attenuates the decent by a its function.


The idea is to make the total amount of diagnostic length more similar between participants.
    - See R script for a distribution graph
*/

const math = "log" 
    // Choices: "none", "log10", "log", "log1p", "log2", "linear"
const decent = .1     
    // Decent per 1 distance from the center
const spare = 1       
    // Number (from the center) that are spared from decent modification. 

    

// Generate probability distribution of the diagnostic run (if relevant)
if(math.toLowerCase() == "none"){
    final_probability_list = Array(diagnostic_max_length-(diagnostic_min_length-1)).fill(1)
} else {
    let halfway = (diagnostic_min_length+diagnostic_max_length)/2 //Diag halfway value
    if(debug){ console.log("Halfway: ", halfway) }
    
    let probability_list = [];
    for(let i = 0; i < spare; i++){
        probability_list.push(1)
        if(debug){ console.log("Probability list: ", probability_list) }
    }
    
    for(let i = 1; i < Math.floor(halfway - diagnostic_min_length - spare) + 1; i++){
        // Start at 1 (cause it is the first distance)
        switch(math.toLowerCase()){
            case "log":
                probability_list.push(Number((1-(Math.log(1+i) * decent)).toFixed(2)))
                break;
            case "log2":
                probability_list.push(Number((1-(Math.log2(1+i) * decent)).toFixed(2)))
                break;
            case "log1p":
                probability_list.push(Number((1-(Math.log1p(1+i) * decent)).toFixed(2)))
                break;
            case "log10":
                probability_list.push(Number((1-(Math.log10(1+i) * decent)).toFixed(2)))
                break;
            case "linear":
                probability_list.push(Number((1-(i * decent)).toFixed(2)))
                break;
        }
    }
    if(diagnostic_range.length % 2 == 0){
        probability_list.unshift(1) 
        var final_probability_list = Object.assign([],probability_list).reverse().concat(probability_list); 
        // If it is even, then add 1 at the start
    } else {
        var final_probability_list = Object.assign([],probability_list).reverse().concat(1, probability_list); 
        // If odd add one in the middle
    }
}
if(debug){ console.log("Final probabilities are: ", final_probability_list) }

// Randomize diagnostic length across the experiment & distribute according to probability distribution
let rnd_diagnostic_length = [];
for(let i = 0; i < number_of_inducers; i++){
    rnd_diagnostic_length.push(jsPsych.randomization.sampleWithReplacement(diagnostic_range, 1, final_probability_list)[0]);
    // We randomize the length from "min" to "max" with the probabilities in "final_probability_list"
}

// // Randomize diagnostic length across the experiment & distribute according to probability distribution
// let rnd_diagnostic_length = [];
// for(let i = 0; i < number_of_inducers; i++){
//     rnd_diagnostic_length.push(jsPsych.randomization.sampleWithReplacement(diagnostic_range, 1, final_probability_list)[0]);
//     // We randomize the length from "min" to "max" with the probabilities in "final_probability_list"
// }


// if(debug){ console.log("With these parameters we end up with an average length of: ",  
//                         (diagnostic_min_length+diagnostic_max_length)/2*number_of_inducers) }
// if(debug){ console.log("Diag lengths: ", rnd_diagnostic_length) }
// if(debug){ console.log("Experiment length: ", rnd_diagnostic_length.reduce((val, a) => val + a)) } // sum the list