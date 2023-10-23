const debugging="Y" // 

const default_background_colour = "#cccccc" // Light grey
const set_default_background_colour = {
    type: jsPsychCallFunction,
    func: () => { document.body.style.backgroundColor = default_background_colour },
} 

const jsPsych = initJsPsych({
    // experiment_width : 1280, 
        // w/e add later if necessary
    on_finish: function() {
    jsPsych.data.displayData();
}});

// Timeline
const timeline = [];
timeline.push(set_default_background_colour)

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
if(debugging=="Y"){console.log("ID = " +ID)}

///////////////////////////////////////////////////////
////////////            TASK               ////////////


// add stimuli to a JS script and read them, draw from them?  and test similarity???

var stimuli = [
    "hga", "hda", "uxb", "p38", "gwm", "kpw", "mnd", "uhw", "jps", "tyn",
    "qlm", "vef", "pcm", "hiz", "jvl", "lhd", "xfr", "cem", "wfr", "vht",
    "kor", "srl", "erf", "tjx", "clp", "huc", "npa", "krs", "avd", "uaw",
    "fma", "hkj", "udc", "tys", "fpg", "bmu", "slu", "aec", "g50", "hpe",
    "kyu", "hyo", "rga", "mch", "frr", "brg", "ffi", "oco", "ftc", "thd",
    "adt", "ksh", "rsn", "txa", "pyt", "mfv", "eex", "ltt", "xar", "eaj",
    "dyi", "lko", "byo", "j&w", "ipd", "emc", "tgz", "dyi", "hs1", "d30",
    "lxc", "dlj", "acd", "dby", "p34", "wez", "d94", "unm", "adb", "mok",
    "iht", "uce", "a43", "ehs", "oic", "ctv", "oll", "gek", "gco", "bia",
    "idd", "hdv", "wrz", "tdt", "vsr", "npt", "yyz", "b96", "l8r", "usl",
    "jgs", "nej", "ttf", "cew", "icl", "fkk", "kof", "pgo", "bkr", "oad",
    "p5p", "c3s", "mgv", "g73", "cgb", "pcb", "gfa", "pku", "deu", "aor",
    "va3", "vgl", "t&r", "zvi", "vmo", "fct"];
    // See R script
let rnd_stimuli = jsPsych.randomization.shuffle(stimuli);  // Shuffle stimuli list
if(debugging=="Y"){console.log(rnd_stimuli)}


////////        EXPERIMENT PARAMETERS       ////////
//// Responses ////
const allowed_responses = ["f","j"];  // Allowed responses
const responseSides = ["LEFT","RIGHT"]; // What participants will RESPOND to (e.g., If X appears press responseSides[0])
    // these two parameters must correspond 

//// Inducer parameters ////
//(const default_background_colour = "#cccccc" // Light grey
const wrong_response_colour = "#d22d2d"     // Blood red-ish 
const inducer_colours = []                  // Inducer colour randomize between participants (if more than 1)



//// Diagnostic parameters ////
let number_of_inducers = 2//24;   // Number of inducers 
let diagnostic_min_length = 4;     // Min run length
let diagnostic_max_length = 16;    // Max run length
let run_stimulus_bias = [1,1];  // ??
let run_italic_bias = [1,1];    // Left value correspond to ITALIC probability, right correspond to UPRIGHT probability

// Diagnostic probability calcuation
/* Here we change the probability of a trials of a certain distances from the center will occur. 
For instance, we may not want trials of 16 and 4 to occur that often. These values will automatically 
calculate respective values from the center according to the "decent". The "spare" is how many valyes 
we want to be unaffected by this calculation - symmetrical from the center. */

let math = "log"   // Set to "none" if no probability calcuation should take place
    // choices: "none", "log10", "log", "log1p", "log2", "linear" // By steepness respectively
let decent = .1     // Decent per 1 distance from the mean(s)
let spare = 1       // spare - unaffected decent from the mean (e.g., 1 distance from mean is the same as the mean (i.e., 1))


let diagnostic_range = Array.from(Array(diagnostic_max_length-3), (x,i) => i + diagnostic_min_length) 
if(debugging=="Y"){console.log("The range of diagnostic lengths: ", diagnostic_range)}

if(math.toLowerCase()=="none"){
    final_probability_list = Array(diagnostic_max_length-(diagnostic_min_length-1)).fill(1)
} else {
    let halfway = (diagnostic_min_length+diagnostic_max_length)/2 //Diag halfway value
    if(debugging=="Y"){console.log(halfway)}
    
    let probability_list = [];
    for(let i = 0; i < spare; i++){
        probability_list.push(1)
        if(debugging=="Y"){console.log(probability_list)}
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
if(debugging=="Y"){console.log("Final probabilities are: ", final_probability_list)}

let rnd_diagnostic_length = [];
for(let i = 0; i < number_of_inducers; i++){
    rnd_diagnostic_length.push(jsPsych.randomization.sampleWithReplacement(diagnostic_range, 1,  final_probability_list)[0]);
    // We randomize the length from "min" to "max" with the probabilities in "final_probability_list"
}

if(debugging=="Y"){console.log("With these parameters we end up with an average length of: ",  (diagnostic_min_length+diagnostic_max_length)/2*number_of_inducers)}
if(debugging=="Y"){console.log("Diag lengths: ", rnd_diagnostic_length)}
if(debugging=="Y"){console.log("Experiment length: ", rnd_diagnostic_length.reduce((val, a) => val + a))} // sum the list


//// Trials ////
// Fixation
let fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<div style='font-size: 48px'> + </div>",
    choices: "NO_KEYS",
    trial_duration: 750, 
}
let fixation2 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<div style='font-size: 48px'> + </div>",
    choices: "NO_KEYS",
    trial_duration: 1500, 
}
let wrong_response_delay = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    choices: "NO_KEYS",
    trial_duration: 200, 
}

// Feedback
const wrong_resp_bk_colour = {
    type: jsPsychCallFunction,
    func: () => { document.body.style.backgroundColor = wrong_response_colour },
} 

    // https://github.com/jspsych/jsPsych/discussions/936
    // https://github.com/psychbruce/jspsych/blob/master/exp_demo/experiment/experiment.js



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
        `<p style="font-size: 42px;"> If a target appears <i> italic </i> press ${rnd_diagnostic_responseSides[0]}`+
        `<p style="font-size: 42px;"> If a target appeas upright press ${rnd_diagnostic_responseSides[1]}`; 
        if(debugging=="Y"){console.log(a)}
        return a;
    }, 
    choices: [" "], 
    trial_duration: 10000, // max 20 sec
}
timeline.push(diagnostic_task_instruction)



timeline.push(fixation2) // fixation

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
            return  `<p style="font-size: 42px;"> If ${run_stimuli[0]} press ${rnd_inducer_responseSides[0]}`+
                    `<p style="font-size: 42px;"> If ${run_stimuli[1]} press ${rnd_inducer_responseSides[1]}`; 
        }, 
        choices: " ", 
        trial_duration: 10000, // removed or max 20 sec
    }
    timeline.push(inducer_instruction)


    // Then we generate the diagnostic trials 
        // Should perhaps be a color? Or randomize a color? 
    for(let ii = 0; ii < run_diagnostic_length; ii++){
        let run_rnd_stimulus = jsPsych.randomization.sampleWithReplacement(run_stimuli, 1, run_stimulus_bias)[0]
        let run_rnd_italic = jsPsych.randomization.sampleWithReplacement([true,false], 1, run_italic_bias)[0]

        let diagnostic_run = { 
            type: jsPsychHtmlKeyboardResponse,
            stimulus: () => {   
                if(run_rnd_italic==true) {
                    return `<p style="font-size: 42px;"><i>${run_rnd_stimulus}</i>`
                } else {
                    return `<p style="font-size: 42px;">${run_rnd_stimulus}`
                }
            }, 
            choices: allowed_responses,
            trial_duration: 2000,
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
                if(debugging==true){console.log(jsPsych.data.getLastTrialData())}

                // Set the "correct_response_key"
                if(data.correct_response_side == responseSides[0]){
                    data.correct_response_key = allowed_responses[0]
                    console.log(" YEA IT MATCHES ")
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

        // If participants responded to slow, we indicate to them
        let too_slow_trial = {
            timeline: [wrong_response_delay, fixation],
            conditional_function: () => {
                let data = jsPsych.data.get().last(1).values()[0];
                if(data.response === null)  { return true } 
                else                        { return false }
            }
        }
        timeline.push(too_slow_trial)
        
        let wrong_response_trial = {
            timeline: [wrong_resp_bk_colour, fixation],
            conditional_function: () => {
                let data = jsPsych.data.get().last(2).values()[0];
                if( data.response === null) { return true } 
                else                        { return false }
            }
        }
        timeline.push(wrong_response_trial)

            // conditional on a certain run? e.g., first inducer has feedback?
                // check against doc 
            // if this is the case, we could also do ii-1 to add another diagnostic trial?
            
            // what if participants are wrong? Do we indicatae to them as well?

        // Always end with a fixation // longer iti
        timeline.push(fixation)
    }

    /// INDUCERN TASK HERE
    let rnd_inducer_stimulus = jsPsych.randomization.sampleWithReplacement(run_stimuli, 1, run_stimulus_bias)[0]
    let inducer_task = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: () => {return `<p style="font-size: 32px;">${rnd_inducer_stimulus}`},
        choices: allowed_responses,
        trial_duration: 2000,
        data: {
            stimulus: rnd_inducer_stimulus,  // stimulus
            inducer_run: i,       // Inducer run 
            inducer_trial: true,           
            correct_response: () => {},
            correct_response_side: diagnostic_max_length,
            // fix the above
            ///
            ///
            ///
        },
        on_finish: (data) => {
            console.log(run_stimuli)
            if(data.stimulus == run_stimuli[0] & data.response == rnd_inducer_responseSides[0]){
                data.correct = true;
            } else if(data.stimulus == run_stimuli[1] & data.response == rnd_inducer_responseSides[1]){
                data.correct = true;
            } else { data.correct = false }
        }
    }
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
