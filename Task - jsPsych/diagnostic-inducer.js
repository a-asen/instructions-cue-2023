const exp_debugging="Y" // 

//// Trials ////
// Fixation
let fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: () => {return `<div style='font-size: ${fixation_size}'> + </div>`},
    choices: "NO_KEYS",
    trial_duration: fixation_delay, 
}
let fixation2 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:  () => {return `<div style='font-size: ${fixation_size}'> + </div>`},
    choices: "NO_KEYS",
    trial_duration: fixation2_delay, 
}
// Feedback
let wrong_response = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:  () => {return `<div style="font-size: ${general_font_size};"> Wrong response </div>`},
    choices: "NO_KEYS",
    trial_duration: wrong_response_delay,
}
let too_slow = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: () => {return `<div style="font-size: ${general_font_size};"> Too slow </div>`},
    choices: "NO_KEYS",
    trial_duration: too_slow_delay, 
}
// change background
const set_background_colour_default = {
    type: jsPsychCallFunction,
    func: () => { changeBackground(default_background_colour) }
} 
const set_background_colour_wrong_response = {
    type: jsPsychCallFunction,
    func: () => { changeBackground(wrong_response_colour) }
} 
  // https://github.com/jspsych/jsPsych/discussions/936
  // https://github.com/psychbruce/jspsych/blob/master/exp_demo/experiment/experiment.js




const jsPsych = initJsPsych({
    // experiment_width : 1280, 
        // w/e add later if necessary
    on_finish: function() {
    jsPsych.data.displayData();
}});

// Timeline start
const timeline = [];
timeline.push(set_background_colour_default)

// timeline.push(set_background_colour_default) /7

// About the experiment 
const about_the_experiment = {
    type: jsPsychInstructions,
    pages: [

    ],
}

// Concent !!!
const concent = {
    type: jsPsychInstructions,
    pages: [
    ],
}

// Instructions  // initialize fullscreen
// timeline.push({
//     type: jsPsychFullscreen,
//     fullscreen_mode: true
// });
    // For this experiment we will keep you in fullscreen.


// Unique ID
let ID = jsPsych.randomization.randomID(8);
if(exp_debugging=="Y"){console.log("ID = " +ID)}

///////////////////////////////////////////////////////
////////////            TASK               ////////////
// Shuffle stimuli list
let rnd_stimuli = jsPsych.randomization.shuffle(stimuli);  // Shuffle stimuli list
if(exp_debugging=="Y"){console.log(rnd_stimuli)}

// Generate diagnostic length ranges
let diagnostic_range = Array.from(Array(diagnostic_max_length-3), (x,i) => i + diagnostic_min_length) 
if(exp_debugging=="Y"){console.log("The range of diagnostic lengths: ", diagnostic_range)}

// Generate probability distribution of the diagnostic run (if relevant)
if(math.toLowerCase()=="none"){
    final_probability_list = Array(diagnostic_max_length-(diagnostic_min_length-1)).fill(1)
} else {
    let halfway = (diagnostic_min_length+diagnostic_max_length)/2 //Diag halfway value
    if(exp_debugging=="Y"){console.log(halfway)}
    
    let probability_list = [];
    for(let i = 0; i < spare; i++){
        probability_list.push(1)
        if(exp_debugging=="Y"){console.log(probability_list)}
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
                console.log(Math.log10(i))
                break;
            case "linear":
                probability_list.push(Number((1-(i * decent)).toFixed(2)))
                break;
        }
        console.log(probability_list)
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
if(exp_debugging=="Y"){console.log("Final probabilities are: ", final_probability_list)}

// Randomize diagnostic length across the experiment & distribute according to probability distribution
let rnd_diagnostic_length = [];
for(let i = 0; i < number_of_inducers; i++){
    rnd_diagnostic_length.push(jsPsych.randomization.sampleWithReplacement(diagnostic_range, 1,  final_probability_list)[0]);
    // We randomize the length from "min" to "max" with the probabilities in "final_probability_list"
}
if(exp_debugging=="Y"){console.log("With these parameters we end up with an average length of: ",  (diagnostic_min_length+diagnostic_max_length)/2*number_of_inducers)}
if(exp_debugging=="Y"){console.log("Diag lengths: ", rnd_diagnostic_length)}
if(exp_debugging=="Y"){console.log("Experiment length: ", rnd_diagnostic_length.reduce((val, a) => val + a))} // sum the list



////////        Experiment run creation         ////////
////    DIAGNOSTIC TASK    ////
let diagnostic_task_instruction_description = {
    type: jsPsychHtmlKeyboardResponse,
    pages: [
        `In the next screen you will see the instructions you are to execute when the target appears in black color `,,
        "You will have 20 seconds to remember the instructions. These instructions do not change over the experiment",
    ]
}

let rnd_diagnostic_responseSides = jsPsych.randomization.shuffle(responseSides);    // randomize response side 
        // Could/would probably be a good idea to randomize italic/upright appearance as well, but w/e
// Only displayed once, instruction remains the same throughout the experiment
let diagnostic_task_instruction = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function(){   
        let a = 
        `<p style="font-size: ${general_font_size};"> If a target appears <i> italic </i> press ${rnd_diagnostic_responseSides[0]}`+
        `<p style="font-size: ${general_font_size};"> If a target appeas upright press ${rnd_diagnostic_responseSides[1]}`; 
        if(exp_debugging=="Y"){console.log(a)}
        return a;
    }, 
    choices: [" "], 
    trial_duration: instruction_delay,
    //post_trial_gap: 1500,
}
timeline.push(diagnostic_task_instruction)


// Here we create the experiment
for(let i = 0; i < number_of_inducers; i++){ // less than, since we start at 0
    // This first get the number of different inducers
    let run_stimuli = [rnd_stimuli[0], rnd_stimuli[1]] // Get new stimuli
    rnd_stimuli.splice(0,2) // Remove those stimuli from the list
    let run_diagnostic_length = rnd_diagnostic_length[i] // Get the curret diagnostic length
    let rnd_inducer_responseSides = jsPsych.randomization.shuffle(responseSides); // randomize where left/right appears
    
    // Inducer instruction for this run
    let inducer_instruction = { 
        type: jsPsychHtmlKeyboardResponse,
        stimulus: () => {   
            return  `<p style="font-size: ${general_font_size};"> If ${run_stimuli[0]} press ${rnd_inducer_responseSides[0]}`+
                    `<p style="font-size: ${general_font_size};"> If ${run_stimuli[1]} press ${rnd_inducer_responseSides[1]}`; 
        }, 
        choices: " ", 
        trial_duration: instruction_delay, 
    }
    timeline.push(inducer_instruction)
    timeline.push(fixation)


    // Then we generate the diagnostic trials 
        // Should perhaps be a color? Or randomize a color? 
    for(let ii = 0; ii < run_diagnostic_length; ii++){
        let run_rnd_stimulus = jsPsych.randomization.sampleWithReplacement(run_stimuli, 1, run_stimulus_bias)[0]
        let run_rnd_italic = jsPsych.randomization.sampleWithReplacement([true,false], 1, run_italic_bias)[0]

        let diagnostic_run = { 
            type: jsPsychHtmlKeyboardResponse,
            stimulus: () => {   
                if(run_rnd_italic==true) {
                    return `<p style="font-size: ${general_font_size};"><i>${run_rnd_stimulus}</i>`
                } else {
                    return `<p style="font-size: ${general_font_size};">${run_rnd_stimulus}`
                }
            }, 
            choices: allowed_responses,
            trial_duration: trial_duration,
            data: {
                stimulus: run_rnd_stimulus,     // Stimulus - What is the stimulus?
                inducer_run: i,                 // Inducer run number
                diagnostic_run: ii,             // Diagnostic run number
                inducer_trial: false,           // Not an inducer trial
                italic: run_rnd_italic,         // Italic trial?
                correct_response_side: () => {  // The correct response side (if is italic, then resp side 0)
                    if (run_rnd_italic == true) { return rnd_diagnostic_responseSides[0] } 
                    else                        { return rnd_diagnostic_responseSides[1] } },
            },
            on_finish: (data) => {
                
                //if(exp_debugging=="Y"){console.log(jsPsych.data.getLastTrialData())}

                // Set the "correct_response_key"
                if(data.correct_response_side == responseSides[0]){
                    data.correct_response_key = allowed_responses[0]
                } else { data.correct_response_key = allowed_responses[1]}

                // Only if there is a response do we check whether it is correct. 
                if(data.response == null){
                    data.correct = null;
                } else {
                    // If response equals correct_response_key
                    if(data.correct_response_key == data.response){
                        data.correct = true
                    } else {data.correct = false}
                }

                // could add
                // data.inducer_required_response = 

                /// GONGUENCEY HERE
                // if they are the same in one position, then they are congruent?
                if(rnd_diagnostic_responseSides[0] == rnd_inducer_responseSides[0] & data.stimulus == run_stimuli[0]){
                        // If the diagnostic and inducer respond side overlapp, as well as the stimulus is equal to the run stimuli[0] THEN congruent 
                    data.congruency = true
                } else if (rnd_diagnostic_responseSides[1] == rnd_inducer_responseSides[1] & data.stimulus == run_stimuli[1]){
                    data.congruency = true
                } else { data.congruency = false }
            }
        }
        timeline.push(diagnostic_run)

        // If participants responded to slow, give feedback
        let too_slow_trial = {
            timeline: [set_background_colour_wrong_response, too_slow, set_background_colour_default],
            conditional_function: () => {
                let data = jsPsych.data.get().last(1).values()[0];
                if(data.response === null)  { 
                    //console.log(jsPsych.data.getLastTrialData())
                    console.log("TOO SLOW TRUE")
                    console.log(data)
                return true } 
                else                        { return false }
            }
        }
        timeline.push(too_slow_trial)
        
        // If participants responded incorrectly, give feedback
        let wrong_response_trial = {
            timeline: [set_background_colour_wrong_response, wrong_response , set_background_colour_default],
            conditional_function: () => {
                let data = jsPsych.data.get().last(1).values()[0];
                if( data.correct == false)  { 
                 return true } 
                else                        { return false }
            }
        }
        timeline.push(wrong_response_trial)

        timeline.push(fixation)
    }

    /// INDUCERN TASK HERE
    let rnd_inducer_stimulus = jsPsych.randomization.sampleWithReplacement(run_stimuli, 1, run_stimulus_bias)[0]
    let inducer_task = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: () => {return `<p style="font-size: ${general_font_size};">${rnd_inducer_stimulus}`},
        choices: allowed_responses,
        trial_duration: trial_duration,
        data: {
            stimulus: rnd_inducer_stimulus,     // stimulus
            inducer_run: i,                     // Inducer run 
            inducer_trial: true,                // Inducer trial
            correct_response_side: () => {      // Get response side, according to run_stimuli
                if(rnd_inducer_stimulus == run_stimuli[0]){return rnd_inducer_responseSides[0]}
                else { return rnd_diagnostic_responseSides[1]} },
        },
        on_finish: (data) => {
            // Find correct response key 
            if(data.correct_response_side == responseSides[0]){
                data.correct_response_key = allowed_responses[0] } 
            else { data.correct_response_key = allowed_responses[1] }

            // Test whether the response is correct
            if(data.response == data.correct_response_key){
                data.correct = true;
            } else { data.correct = false }
        }
    }
    // // If participants responded to slow, give feedback
    // let too_slow_trial = {
    //     timeline: [set_background_colour_wrong_response, too_slow, set_background_colour_default],
    //     conditional_function: () => {
    //         let data = jsPsych.data.get().last(1).values()[0];
    //         if(data.response === null)  { return true } 
    //         else                        { return false }
    //     }
    // }
    // timeline.push(too_slow_trial)
    
    // // If participants responded incorrectly, give feedback
    // let wrong_response_trial = {
    //     timeline: [set_background_colour_wrong_response, wrong_response , set_background_colour_default],
    //     conditional_function: () => {
    //         let data = jsPsych.data.get().last(1).values()[0];
    //         if( data.correct == false)  { console.log("SEND RED")
    //             return true } 
    //         else                        { return false }
    //     }
    // }
    // timeline.push(wrong_response_trial)
    
    timeline.push(inducer_task)
    timeline.push(fixation2) // longer fixation
}



// exit fullscreen mode
    // before finish exit FS
timeline.push({
    type: jsPsychFullscreen,
    fullscreen_mode: false
}); 

jsPsych.run(timeline)
