////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// CHANGE THESE BEFORE EXPERIMENT!
const debug = false               // Show some console information
const skip_instructions = false  // Skip intro? (to test trials)
const save_local_data = false    // Save a local file (test analysis)


const study_name = "exp1" // add to filename 
const redirect_link = "https://app.prolific.com/submissions/complete?cc=COAKFO2E" 
        // https://app.prolific.com/submissions/complete?cc=COAKFO2E (REPLICATION STUDY)
        // https://app.prolific.com/submissions/complete?cc=C4S441ES (CUE TASK)


////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////


////////////////////////////
////    Parameters      ////
////////////////////////////

//    background default      ////
const default_background_colour = "#cccccc" // Light grey
const wrong_response_colour = "#d22d2d"     // Blood red-ish 

////    Delay   ////
// general
const instruction_delay = 20000     // How long is each S-R mapping displayed?
const trial_duration = 2000         // How long is each response trial?

// Fixation
const short_fixation_delay = 750      // Main fixation delay
const long_fixation_delay = 1500    // second fixation delay (after each inducer)

// Feedback
const wrong_response_delay = 300    // How long is wrong response displayed?
const too_slow_delay = 300          // How long is too slow response displayed

////    Font size   ////
const instruction_font_size = "24px"    // about the experiment / Consent / explanation
const general_font_size = "42px"        // Diagnostic/inducer/stimulus size
const fixation_size = "48px"            // Fixation 

////    Responses    ////
const allowed_responses = ["f","j"];        // Allowed responses
const response_sides = ["LEFT","RIGHT"];     // What participants will RESPOND to (e.g., If X appears press responseSides[0])
    // these two parameters correspond in appearance 
    // i.e., f (or whatever key) should correspond to the response side (left)

////    Inducer parameters     ////
const inducer_colours = ["red", "yellow", "blue"]      // Inducer colour randomize between participants (if more than 1)
    // ["darkred", "yellow", "purple"] 
    // This is also what is DISPLAYED to participants. Should therefore be a readable name. 

////    Diagnostic parameters   ////
const number_of_inducers = 24;       // Number of inducers 
    // !!! CHANGE max trials !!! 
const diagnostic_min_length = 4         // Min run length
const diagnostic_max_length = 16        // Max run length
const max_diagnostic_trials = 240     // Total max diagnostic trials
    // max/2 * number_of_inducers

////    Practice parameters     ////
const prac_diagnostic_rounds = 16                    // Number of diagnostic practice rounds
    // Set to 0 if no practice rounds should occur.
const prac_inducer_rounds = 6
    // NB: Max 64 rounds of new stimuli (prac_inducer_rounds + number_of_inducer > 64)


// Not used 
const run_italic_bias = [1,1]           // Left value correspond to ITALIC probability, right correspond to UPRIGHT probability

////    Stimuli list    ////
const stimuli = [
    "hhd", "rrd", "wrz", "sdw", "mmo", "pxv", "chy", "saj", "flh",
    "fuc", "vrm", "ila", "bms", "xet", "iei", "epy", "snx", "uus", "dul",
    "anz", "hfs", "ebe", "gso", "afp", "guf", "lct", "cnl", "jsf", "tgf",
    "mik", "upf", "efg", "cta", "lff", "dij", "slu", "xlv", "hrc", "ois",
    "swr", "cmj", "dof", "cpt", "prg", "yna", "idy", "pcm", "uen", "adj",
    "vpu", "dpa", "quy", "vnn", "ccx", "cer", "nga", "jft", "jil", "frn",
    "dnc", "faq", "ecl", "asn", "gdn", "vib", "glp", "ofa", "yoy", "amb",
    "rif", "ori", "bwe", "tkb", "oez", "kue", "jup", "yrp", "kho", "vbt",
    "wwt", "csp", "eeu", "eht", "pph", "rpw", "ume", "psl", "pbz", "vle",
    "drk", "aor", "kmh", "bsh", "gfm", "goj", "ufc", "sjn", "ivr", "mts",
    "dlg", "pte", "crf", "edc", "ndm", "mvv", "bgi", "rbc", "wab", "mda",
    "ttm", "jcr", "hlb", "cui", "jey", "fja", "jlm", "otr", "dgv", "imm",
    "lpn", "zpl", "feg", "ydi", "vsc", "pmf", "ibg", "geb", "byy"];
    // Enough stimuli for 64 rounds. 
    
////         Functions          ////
// Date functions 
Date.prototype.today = function () { 
    return this.getFullYear() + "-" + (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"-"+ ((this.getDate() < 10)?"0":"") + this.getDate();
}
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +"-"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +"-"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}
var start_dateTime = new Date().today() + "_" + new Date().timeNow();
if( debug ) { console.log(start_dateTime) }

// Save data (to server)
var saveData = function(name, data) {
    // Create data JSON 
    var data2 = JSON.stringify( { filename: name, filedata: data } )

    // Establish connection
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'upload.php');
    xhr.setRequestHeader('Content-Type', 'application/json');
 
    // Send data
    xhr.send( data2 );

    // Print response
    if(debug){ console.log(xhr.responseText) }
}

// Change background function
function changeBackground(colour) {
    document.body.style.background = colour;
}


////////////////////////////
////                    ////
////    Initialize      ////
////                    ////
////////////////////////////


const jsPsych = initJsPsych({
    // experiment_width : 1280, 
        // w/e add later if necessary
    on_finish: function() {
        jsPsych.data.displayData() }
});
const timeline = []; // Timeline

//// %% Set %% background to a light gray
timeline.push( { type: jsPsychCallFunction,  func: () => { changeBackground(default_background_colour) } } ) 
    // To ensure the background colour is correct.


////////////////////////////////
////        Trials          ////
////////////////////////////////

// Change background trials
const set_background_colour_default = {
    type: jsPsychCallFunction,
    func: () => { changeBackground(default_background_colour) }
} 
const set_background_colour_wrong_response = {
    type: jsPsychCallFunction,
    func: () => { changeBackground(wrong_response_colour) },
}
  // https://github.com/jspsych/jsPsych/discussions/936
  // https://github.com/psychbruce/jspsych/blob/master/exp_demo/experiment/experiment.js


// Fixations
const short_fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: () => { return `<div style='font-size: ${fixation_size}'> + </div>` },
    choices: "NO_KEYS",
    trial_duration: short_fixation_delay, 
    data: { stimulus: "+", trial_info: "Fixation - short" },
    on_finish: (data) => {
        // Current window size
        data.width = window.innerWidth
        data.height = window.innerHeight
    }
} 
const long_fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:  () => { return `<div style='font-size: ${fixation_size}'> + </div>` },
    choices: "NO_KEYS",
    trial_duration: long_fixation_delay, 
    data: { stimulus: "+", trial_info: "Fixation - long" },
    on_finish: (data) => {
        // Current window size
        data.width = window.innerWidth
        data.height = window.innerHeight
    }
}

////        FEEDBACK        ////
// Wrong response trial
const wrong_response = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:  () => { return `<div style="font-size: ${general_font_size};"> Wrong! </div>` },
    choices: "NO_KEYS",
    trial_duration: wrong_response_delay,
    data: { stimulus: "Wrong", trial_info: "Feedback" },
    on_finish: (data) => {
        // Current window size
        data.width = window.innerWidth
        data.height = window.innerHeight
    }
}
// Too slow trial
const too_slow = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: () => { return `<div style="font-size: ${general_font_size};"> Slow </div>` },
    choices: "NO_KEYS",
    trial_duration: too_slow_delay, 
    data: { stimulus: "Slow", trial_info: "Feedback" },
    on_finish: (data) => {
        // Current window size
        data.width = window.innerWidth
        data.height = window.innerHeight
    }
}

////     Feedback block trial       //// 
// Relates to changing the background and then showing trial 

// Wrong response trial (background change + info)
const wrong_response_trial = {
    timeline: [set_background_colour_wrong_response, wrong_response , set_background_colour_default],
    conditional_function: () => {
        let data = jsPsych.data.get().last(1).values()[0]

        if( data.correct_response == false)  { return true } 
        else                                 { return false }
    }
}
// To slow trial (background change + info)
const too_slow_trial = {
    timeline: [set_background_colour_wrong_response, too_slow, set_background_colour_default],
    conditional_function: () => {
        let data = jsPsych.data.get().last(1).values()[0];

        if(data.response === null)  { return true } 
        else                        { return false }
    }
}


////////////////////////////////////////////////////////////////////////////////////////////
////                        General experiment things                                   ////
////////////////////////////////////////////////////////////////////////////////////////////


// Inducer colour
let rnd_inducer_colour = jsPsych.randomization.sampleWithReplacement(inducer_colours, 1)[0]
if(debug){ console.log("Inducer colour: ", rnd_inducer_colour) }

// Unique ID
var ID = jsPsych.randomization.randomID(8);
if(debug){ console.log("ID = " + ID) }

// Shuffle stimuli list
let rnd_stimuli = jsPsych.randomization.shuffle(stimuli);  // Shuffle stimuli list
if(debug) { console.log("Randomized stimuli list:", rnd_stimuli) }

//// Diagnostic stuff ////
// Generate diagnostic length range
let diagnostic_range = Array.from(Array(diagnostic_max_length-diagnostic_min_length+1), (x, i) => i + diagnostic_min_length) 
if(debug){ console.log("The range of diagnostic lengths: ", diagnostic_range) }

let rnd_diagnostic_length = [];
// We randomy sample "number_of_inducer" times from the "diagnostic_range"
for(let i = 0; i < number_of_inducers; i++){
    rnd_diagnostic_length.push(jsPsych.randomization.sampleWithReplacement(diagnostic_range, 1)[0]);
}
if(debug){ console.log("Random diagnostic lengths list:", rnd_diagnostic_length) }
// Sum total diagnostic trials
const sum_diags = rnd_diagnostic_length.reduce((list, i) => list + i, 0);
if(debug){ console.log("Total diagnostic trials:", sum_diags) }


// If the sum is more or less than the specified value, adjust accordingly
if(sum_diags != max_diagnostic_trials){
    let operation = (sum_diags < max_diagnostic_trials) ? "+" : (sum_diags > max_diagnostic_trials) ? "-" : "";
    let diff = Math.abs(sum_diags-max_diagnostic_trials)
    var cond;
    if(debug){ console.log("Current operation", operation, "with a differences of", diff) }
    var break_count = 0;
    do{
        if(debug){ console.log("Diff: ", diff) }
        // Randomly sample a location
        let loc = Math.floor(Math.random() * rnd_diagnostic_length.length)
        switch(operation){ // Test that the location value does not equal min/max values
            case "+":
                var cond = rnd_diagnostic_length[loc] != diagnostic_max_length
                break;
            case "-":	
                var cond = rnd_diagnostic_length[loc] != diagnostic_min_length
                break;
        }
        if(cond){ //IF NOT EQUAL: Add one to the location and remove one to diff
            if(debug){ console.log("Adjusting:",  rnd_diagnostic_length[loc], "at location", loc) }
            operation=="+" ? rnd_diagnostic_length[loc]++ : operation=="-" ? rnd_diagnostic_length[loc]-- : "";
            diff--;
        } else { // else skip
            if(debug){ console.log("Value: ", rnd_diagnostic_length[loc], "at location", loc, "is at threshold, skipping...") } }
        break_count+=1 // in case 
        if(debug){ console.log( break_count ) }
    } while( diff > 0 & break_count < 500)
    if(debug){ console.log("Fixed diagnostic lengths:", rnd_diagnostic_length) }
    if(break_count >= 500){ "WARNING: COULD NOT EQUALIZE DIAGNOSTIC LENGTHS, CHECK PARAMETERS" }
}

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////
////    Instructions    ////
////////////////////////////

// We want to ensure some features before task start? 
    // Perhas we  trust prolifics inclusion/exclusion check ? 
const check_browser = {
    type: jsPsychBrowserCheck,
    inclusion_function: (data) => {
        data.trial_info = "technicals"
        // Current window size
        data.height = window.innerHeight
        data.width = window.innerWidth
            // should correspond (closely) to "max_screen_size"

        // max size
        data.max_screen_size = screen.width + "x" + screen.height

        if(debug){ console.log(data) }

        // Conditional check
        return data.fullscreen === true && data.mobile === false && data.browser.toLowerCase != "safari"
            // safari does not support keyboard input in fullscreen
    },
    exclusion_message: (data) => {
        if(data.mobile){
            return '<p>You must use a desktop/laptop computer to participate in this experiment.</p>';
        } else if(data.fullscreen){
            return `<p>We have detected that your browser cannot use full screen. \n
            Try to use a different browser that supports full screen.`
        } else if(data.browser) {
            return `<p>We have detected that you are using Safari, which is not properly able to run the experiment. \n
            Please run the experiment in a different browser.</p>`
        } else {
            return `We failed to parse your browser information... Try using a different browser.`
        }
    }
}
timeline.push(check_browser)


// About the experiment 
const about_the_experiment_and_consent = {
    type: jsPsychInstructions,
    pages: () => {
        return [
        //// About us
       `<div style="font-size:${instruction_font_size}"> 
        
        <h3>Welcome to this cognitive psychology study!</h3>
        We are investigating concentration and memory. \n
        <br><br>

        The study is conducted by Steffen Aasen (Master student) and \n
        Torsten Martiny-Huenger (Supervisor) at UiT – The Arctic University of Norway.
        <br><br>
        If you have questions about the study, you may contact Torsten Martiny-Huenger at (torsten.martiny-huenger@uit.no). </p>

        </div>`,    
        
        ////  General about the task
        `<div style="font-size:${instruction_font_size}"> 
        
        <h3>About the experiment</h3>                
        In this experiment, you will be presented with 3-letter non-words.  <br> 
        The experiment will only use a left (<b>F</b> key) or right (<b>J</b> key) response (unless otherwise noted).  <br>
        Instructions will be provided, describing the relationship between the 3-letter non-words and the responses.  <br>
        <br><br>
        At the end of the experiment, you will receive the opportunity to provide feedback. 
        </div>`,
        
        ////  New page
        `<div style="font-size:${instruction_font_size}">
        
        <h3> Consent </h3>
        
        Participation in the study is voluntary. <br> 
        All responses to this experiment are collected and stored anonymously. \n
        That means they cannot be traced back to you. <br>
        The anonymous storage means we cannot provide participants with their responses upon request. <br>
        You can quit the experiment without giving a reason by closing the browser tab. No data will be stored in that case.
        <br><br> 
        The data will be used for scientific purposes. <br> 
        If you agree to these terms and conditions and want to participate click NEXT. <br>
        </div>`,

        ]
    },
    show_clickable_nav: ["Next"],
    data: { stimulus: "The experiment and consent", trial_info: "The experiment and consent" },
    on_finish: (data) => {
        if(debug){ console.log(data) }
    }
}
if( !skip_instructions ){ timeline.push(about_the_experiment_and_consent) }

////       Initialize fullscreen and START        ////
if( !skip_instructions ){
    timeline.push({
        type: jsPsychFullscreen,
        message: `<div style="font-size:${instruction_font_size}">
        
        The experiment will proceed quickly, without any breaks, <br>
        please ensure that you are in a quiet environment where you are unlikely to be distracted/disrupted. <br>
        The experiment lasts for approximately 20 minutes. 
        <br><br>
        This experiment requires full screen. If you are ready, enable full screen to proceed.
        <br><br>
        </div>`,
        button_label: "Enable full screen",
        fullscreen_mode: true, 
        data: {trial_info: "Full screen" },
        on_finish: (data) => { 
            // Current window size
            data.width = window.innerWidth
            data.height = window.innerHeight
            if(debug){  console.log(data)  }
        }
    });
}


// Shuffle left/right for each participants (remains the same throughout)
let rnd_response_sides = jsPsych.randomization.shuffle(response_sides); 


////    GENERAL DIAGNOSTIC INSTRUCTIONS   ////
let diagnostic_task_instruction_description = {
    type: jsPsychInstructions,
    pages: () => { 
        return [
            // FIRST, what keys will be used in this experiment? 
            `<div style="font-size:${instruction_font_size}">
            <h3> The task </h3><br>
            The task will present 3-letter non-words that require either a left or right response. <br>
            A left response corresponds to the <b>F</b> key, and a right response corresponds to the <b>J</b> key.
            <br><br>
            The task consists of two instructions: <br>
            One instruction remains the same throughout the task, and is connected to non-words presented in <b>black colour</b>. <br>
            One instruction changes throughout the task, and is connected to non-words presented in <b> \n
            <span style="color:${rnd_inducer_colour}"> ${rnd_inducer_colour.toLowerCase() + " colour"}</span></b>.
            <br><br>
            You will receive a maximum of 20 seconds to read the instructions. <br>
            The task will be difficult, but feedback will be provided. 
            
            </div> `,

            // About the first task
            `<div style="font-size:${instruction_font_size}">

            On the next screen, the instruction that remains the same throughout the task, will be presented. <br>
            (Connected to non-words in <b> black colour</b>.)  
            <br><br>
            A couple of practice rounds will be presented. <br>
            <br><br>
            The practice starts by clicking NEXT.

            </div>`,
        ]
    },
    allow_keys: false, 
    show_clickable_nav: true,
    post_trial_gap: 1500,
    data: { stimulus: "Instructions", trial_info: "Basic overview explanation" },
    on_finish: (data) => {
        // Current window size
        data.width = window.innerWidth
        data.height = window.innerHeight

        if(debug){  console.log(data) }
    }
}
if( !skip_instructions ){ timeline.push(diagnostic_task_instruction_description) }


// Only displayed once, instruction remains the same throughout the experiment
let diagnostic_task_instruction = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function(){   
        return [ 
        `<p style="font-size: ${general_font_size};"> If <i> italic </i> press ${rnd_response_sides[0]}`+
        `<p style="font-size: ${general_font_size};"> If upright press ${rnd_response_sides[1]}`]
    }, 
    prompt: "Put your left index fingers on the F and your right index finger on the J key. <br> When you are ready, press SPACE to continue.",
    choices: " ", 
    trial_duration: instruction_delay,
    data: {
        stimulus: `If italic press ${rnd_response_sides[0]} | If upright press ${rnd_response_sides[1]}`,
        trial_info: "Diagnostic instructions",
    },
    on_finish: (data) => { 
        // Current window size
        data.width = window.innerWidth
        data.height = window.innerHeight

        if(debug){ console.log(data) }
    }
}
timeline.push( diagnostic_task_instruction )
timeline.push( short_fixation )


//////////////////////////////////////////////////
/////            TASK PRACTICE               /////
//////////////////////////////////////////////////


if(prac_diagnostic_rounds > 0 && !skip_instructions){ // & skip_instructions === false

    // This first get the number of different inducers
    let prac_stim = [rnd_stimuli[0], rnd_stimuli[1]] // Get new stimuli
    rnd_stimuli.splice(0, 2) // Remove those stimuli from the list
    if(debug) { console.log("Run stimuli:", prac_stim)}
    
    // Equal italic/upright 
    var prac_dia = Array(  Array(Math.floor(prac_diagnostic_rounds/2)).fill(1) ,  Array( Math.ceil(prac_diagnostic_rounds/2) ).fill(0)  ).flat()
    let rnd_prac_dia = jsPsych.randomization.shuffle(prac_dia)
    if(debug){ console.log("Practice diagnostic italic/upright:", prac_dia) }
    if(debug){ console.log("Randomized diagnostic response:", rnd_prac_dia) }

    //// PRAC: Diagnostic task ////
    for(let pi = 0; pi < prac_diagnostic_rounds; pi++){
        let rnd_diag_stim = jsPsych.randomization.sampleWithReplacement(prac_stim, 1)[0]
        let run_rnd_italic = rnd_prac_dia[0]
        rnd_prac_dia.splice(0,1)

        let diagnostic_run = { 
            type: jsPsychHtmlKeyboardResponse,
            stimulus: () => {   
                if(run_rnd_italic) {
                    return `<p style="font-size: ${general_font_size};"><i>${rnd_diag_stim}</i>`
                } else {
                    return `<p style="font-size: ${general_font_size};">${rnd_diag_stim}`
                }
            }, 
            choices: allowed_responses,
            trial_duration: null,
            data: {
                stimulus: rnd_diag_stim,         // Stimulus
                inducer_run: "practice",                   // Inducer run number (i.e., block)
                diagnostic_run: pi,                 // Diagnostic trial number //start with 1
                inducer_trial: false,                   // Not an inducer trial
                italic: run_rnd_italic,             // Whether the run is ITALIC or not
                trial_info: "Practice diganostic trial",         // This is a diagnostic trial
                correct_diag_response_side: () => {     // Required response side for the diagnostic task
                    if (run_rnd_italic) { return rnd_response_sides[0] } 
                    else                { return rnd_response_sides[1] } 
                },
            },
            on_finish: (data) => {
                // Current window size
                data.width = window.innerWidth
                data.height = window.innerHeight
    
                // Required diagnostic response key 
                if(data.correct_diag_response_side == response_sides[0]) 
                        { data.correct_response_key = allowed_responses[0] }
                else    { data.correct_response_key = allowed_responses[1] }
                
                // Correct response
                if(data.response == null){  data.correct_response = NaN  } 
                else {
                    // If response equals correct_response_key
                    if(data.correct_response_key == data.response)    { data.correct_response = 1 }
                    else                                              { data.correct_response = 0 }
                }

                if(debug){ console.log(data) } // debg
            }
        }
        timeline.push(diagnostic_run)
        ////     Feedback   ////
        timeline.push(too_slow_trial)
        timeline.push(wrong_response_trial)
    
        // Fixation
        timeline.push(short_fixation)
    }

    //// PRAC: Inducer explanation  /////
    if( prac_inducer_rounds > 0 ){
        ////    GENERAL DIAGNOSTIC INSTRUCTIONS   ////
        let inducer_task_instruction_description = {
            type: jsPsychInstructions,
            pages: () => { 
                return [
                    // FIRST, what keys will be used in this experiment? 
                    `<div style="font-size:${instruction_font_size}">
                    
                    On the next screen, the instruction that changes throughout the task, will be presented. <br>
                    (Connected to non-words in <b> \n
                    <span style="color:${rnd_inducer_colour}"> ${rnd_inducer_colour.toLowerCase() + " colour"}</span></b>.)
                    <br><br>
                    These instructions will have the same format, <br> but will describe two new 3-letter non-words.
                    <br><br>
                    A couple of practice trials will be presented.
                    <br><br>
                    The practice round starts by clicking "Start".
                    </div>`,
                ]
            },
            allow_keys: false, 
            show_clickable_nav: true,
            button_label_previous: "",
            button_label_next: "Start",
            post_trial_gap: 1500,
            data: { stimulus: "Instructions", trial_info: "Final experiment explanation" },
            on_finish: (data) => {
                // Current window size
                data.width = window.innerWidth
                data.height = window.innerHeight

                if(debug){ console.log(data) }
            }
        }
        timeline.push( inducer_task_instruction_description )
    }

    // Equalize
    var prac_inducer = Array(  Array(Math.floor(prac_inducer_rounds/2)).fill(1) ,  Array( Math.ceil(prac_inducer_rounds/2) ).fill(0)  ).flat()
    var rnd_prac_inducer = jsPsych.randomization.shuffle(prac_inducer)
    let prac_inducer_stim;
    if(debug){ console.log("Practice inducer array:", prac_inducer) }
    if(debug){ console.log("Randomized practice inducer array:", rnd_prac_inducer) }

    ///// PRAC: Inducer task /////
    for( let pi2 = 0; pi2 < prac_inducer_rounds; pi2++){
        // Stim selection & removal
        let prac_stim = [rnd_stimuli[0], rnd_stimuli[1]] // Get new stimuli
        rnd_stimuli.splice(0, 2) // Remove those stimuli from the list
    
        // Generate instruction trial
        let inducer_instruction = { 
            type: jsPsychHtmlKeyboardResponse,
            stimulus: () => { 
                return  `<p style="font-size: ${general_font_size}"> If <span style="color: ${rnd_inducer_colour}">${prac_stim[0]}</span> press ${rnd_response_sides[0]}`+
                 `<p style="font-size: ${general_font_size}"> If <span style="color: ${rnd_inducer_colour}">${prac_stim[1]}</span> press ${rnd_response_sides[1]}`; 
            }, 
            prompt: "Put your left index fingers on the F and your right index finger on the J key. <br> When you are ready, press SPACE to continue.",
            choices: " ", 
            data: {
                stimulus: `If ${prac_stim[0]} press ${rnd_response_sides[0]} | If ${prac_stim[1]} press ${rnd_response_sides[1]}`,
                trial_info: "Practice inducer instructions",
                inducer_run: "practice",
            },
            trial_duration: instruction_delay, 
            on_finish: (data) => { 
                // Current window size
                data.width = window.innerWidth
                data.height = window.innerHeight
                if(debug){ console.log(data) } 
            }
        }
        timeline.push(inducer_instruction)
        
        // Generate response trial
        let inducer_task = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: () => { 
                // Based on the randomly generated array length, create a traial that requires either a left or right response
                if(rnd_prac_inducer[0]){
                    prac_inducer_stim = prac_stim[0]
                } else {
                    prac_inducer_stim = prac_stim[1]
                }
                rnd_prac_inducer.splice(0, 1) // remove the selected side from the array
                return `<p style="font-size: ${general_font_size}; color:${rnd_inducer_colour}">${prac_inducer_stim}` },
            choices: allowed_responses,
            trial_duration: null,
            data: {
                stimulus: prac_inducer_stim,         // Stimulus
                inducer_run: "practice",                // Inducer run number
                inducer_trial: true,                    // This is an inducer trial
                trial_info: "Practice inducer trial",   // General trial info 
                correct_indu_response_side: () => {     // Required response side for the inducer task
                    if (prac_inducer_stim == prac_stim[0]) { return rnd_response_sides[0] } 
                    else                                   { return rnd_response_sides[1] } 
                }
            },
            on_finish: (data) => {
                // Current window size
                data.width = window.innerWidth
                data.height = window.innerHeight
                
                // Get correct response key from rnd response side
                if(data.correct_indu_response_side == response_sides[0]) 
                            { data.correct_response_key = allowed_responses[0] }
                   else     { data.correct_response_key = allowed_responses[1] }
                

                if(data.response == null){  data.correct_response = NaN  } 
                else {
                    // If response equals correct_response_key
                    if(data.correct_response_key == data.response)    { data.correct_response = 1 }
                    else                                              { data.correct_response = 0 }
                }

                if(debug){ console.log(data) }
            }
        }
        timeline.push(inducer_task)

        ////     Feedback   ////
        // If participants responded to slow or wrong give feedback
        timeline.push(too_slow_trial)
        timeline.push(wrong_response_trial)
        
        // Fixation
        timeline.push(short_fixation)
    }

    //// START feedback 
    let proper_task_start = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function(){   
            return `<div style="font-size:${instruction_font_size}">
            You have now completed the practice.
            
            <br><br>
            Every new round will present two new 3-letter non-words. <br>
            These relate to the non-words presented in 
            <b><span style="color:${rnd_inducer_colour}"> ${rnd_inducer_colour.toLowerCase()+ " colour"}</span></b>. 
            
            <br><br>
            Before the 
            <b><span style="color:${rnd_inducer_colour}"> ${rnd_inducer_colour.toLowerCase()+ " coloured"}</span></b> 
            non-word appears, some <b>black coloured</b> non-words will be presented. <br>
            
            <br><br>
            From now on, each presentation will have a deadline of 2 seconds. <br>
            Respond to each non-word as <b>fast and accurately</b> as possible. <br>
            The task will be difficult, but feedback will be provided. 
            
            </div>`
        }, 
        prompt: "<br>Press SPACE to start the task",
        choices: " ", 
        data: {
            stimulus: `End practice`,
            trial_info: "End of practice",
        },
        on_finish: (data) => { 
            // Current window size
            data.width = window.innerWidth
            data.height = window.innerHeight

            if( debug ){ console.log(data) }
        }
    }
    timeline.push( proper_task_start )
    timeline.push( long_fixation )
}



//////////////////////////////////////////////////
/////            TASK PROPER                 /////
//////////////////////////////////////////////////


for(let exp_block = 0; exp_block < number_of_inducers; exp_block++){ // less than, since we start at 0
    
    ////////////////////////////////////////
    ////    Inducer instructions        ////
    ////////////////////////////////////////

    // This first get the number of different inducers
    let run_stimuli = [rnd_stimuli[0], rnd_stimuli[1]] // Get new stimuli
    rnd_stimuli.splice(0,2) // Remove those stimuli from the list

    let run_diagnostic_length = rnd_diagnostic_length[exp_block] 
        // Get the curret diagnostic length from the pre-generated list

    ////        Inducer instruction         ////
    let inducer_instruction = { 
        type: jsPsychHtmlKeyboardResponse,
        stimulus: () => {   
            return  `<p style="font-size: ${general_font_size}"> If <span style="color: ${rnd_inducer_colour}">${run_stimuli[0]}</span> press ${rnd_response_sides[0]}`+
                    `<p style="font-size: ${general_font_size}"> If <span style="color: ${rnd_inducer_colour}">${run_stimuli[1]}</span> press ${rnd_response_sides[1]}`; 
        }, 
        prompt: "Put your left index fingers on the F and your right index finger on the J key. <br> When you are ready, press SPACE to continue.",
        choices: " ", 
        data: {
            inducer_run: exp_block,     // Inducer run number
            stimulus: `If ${run_stimuli[0]} press ${rnd_response_sides[0]} | If ${run_stimuli[1]} press ${rnd_response_sides[1]}`,
            trial_info: "Inducer instructions"
        },
        trial_duration: instruction_delay, 
        on_finish: (data) => { 
            // Current window size
            data.width = window.innerWidth
            data.height = window.innerHeight
            if(debug){ console.log(data) } 
        }
    }
    timeline.push(inducer_instruction)
    timeline.push(short_fixation)


    /////////////////////////////////
    ////    Diagnostic run      /////
    /////////////////////////////////

    
    // Then we generate the diagnostic trials 
        // Should perhaps be a color? Or randomize a color? 
    for(let exp_diag = 0; exp_diag < run_diagnostic_length; exp_diag++){
        // Randomize diagnostic STIMULUS
        let rnd_diag_stimulus = jsPsych.randomization.sampleWithReplacement(run_stimuli, 1)[0]

        // Randomize diagnostic ITALIC 
        let run_rnd_italic = jsPsych.randomization.sampleWithReplacement([true,false], 1, run_italic_bias)[0]

        let diagnostic_run = { 
            type: jsPsychHtmlKeyboardResponse,
            stimulus: () => {   
                if(run_rnd_italic) {
                    return `<p style="font-size: ${general_font_size}"><i>${rnd_diag_stimulus}</i>`
                } else {
                    return `<p style="font-size: ${general_font_size}">${rnd_diag_stimulus}`
                }
            }, 
            choices: allowed_responses,
            trial_duration: trial_duration,
            data: {
                stimulus: rnd_diag_stimulus,         // Stimulus
                inducer_run: exp_block,                   // Inducer run number (i.e., block)
                diagnostic_run: exp_diag,                 // Diagnostic trial number //start with 1
                inducer_trial: false,                     // Not an inducer trial
                italic: run_rnd_italic,             // Whether the run is ITALIC or not
                trial_info: "Diagnostic trial",         // This is a diagnostic trial
                correct_inducer_response_side: () => { // Required response side for the inducer task
                    if( rnd_diag_stimulus == run_stimuli[0] ) { return response_sides[0] }
                    else                                      { return response_sides[1] }
                },
                correct_diag_response_side: () => {     // Required response side for the diagnostic task
                    if (run_rnd_italic) { return rnd_response_sides[0] } 
                    else                { return rnd_response_sides[1] } 
                },
            },
            on_finish: (data) => {
                // Current window size
                data.width = window.innerWidth
                data.height = window.innerHeight

                // Require diagnostic response key 
                if(data.correct_diag_response_side == response_sides[0]) 
                        { data.correct_response_key = allowed_responses[0] }
                else    { data.correct_response_key = allowed_responses[1] }
                
                // Correct response
                if(data.response == null){  data.correct_response = NaN  } 
                else {
                    // If response equals correct_response_key
                    if(data.correct_response_key == data.response)    { data.correct_response = 1 }
                    else                                              { data.correct_response = 0 }
                }

                ////    GONGUENCEY      ////
                // If the response side match, then congruent
                if(data.correct_diag_response_side == data.correct_inducer_response_side){
                    data.congruent = true
                } else { 
                    data.congruent = false
                }

                if(debug){ console.log(data) } // debg
            }
        }
        timeline.push(diagnostic_run)

        ////     Feedback   ////
        timeline.push(too_slow_trial)
        timeline.push(wrong_response_trial)

        // Fixation
        timeline.push(short_fixation)
    }


    ////////////////////////////////////
    ////        INDUCER TASK        ////
    ////////////////////////////////////
    let rnd_inducer_stimulus = jsPsych.randomization.sampleWithReplacement(run_stimuli, 1)[0]
        // Randomly select inducer stimulus

    let inducer_task = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: () => { return `<p style="font-size: ${general_font_size}; color:${rnd_inducer_colour}">${rnd_inducer_stimulus}` },
        choices: allowed_responses,
        trial_duration: trial_duration,
        data: {
            stimulus: rnd_inducer_stimulus,     // Stimulus
            inducer_run: exp_block,                     // Inducer run number
            inducer_trial: true,                    // This is an inducer trial
            trial_info: "Inducer trial",            // General trial info 
            correct_indu_response_side: () => {     // Required response side for the diagnostic task
                if (rnd_inducer_stimulus == run_stimuli[0]) { return rnd_response_sides[0] } 
                else                                     { return rnd_response_sides[1] } 
            }
        },
        on_finish: (data) => {
            // Current window size
            data.width = window.innerWidth
            data.height = window.innerHeight
            
            // Check the correct response key: 
            // Associate correct key from response sides
            if(data.correct_indu_response_side == response_sides[0]) 
                    { data.correct_response_key = allowed_responses[0] }
            else    { data.correct_response_key = allowed_responses[1] }
            
            // Associate correct response from correct response key
            if(data.response == null){  data.correct_response = NaN  } 
            else {
                // If response equals correct_response_key
                if(data.correct_response_key == data.response)    { data.correct_response = 1 }
                else                                              { data.correct_response = 0 }
            }
            
            if(debug){ console.log(data) }
        }
    }
    timeline.push(inducer_task)

    ////     Feedback   ////
    // If participants responded to slow, give feedback
    timeline.push(too_slow_trial)
    timeline.push(wrong_response_trial)
    
    // Fixation 
        //IF another inducer round
    if( exp_block < number_of_inducers){
        timeline.push(long_fixation)
    }

}

// Change background colour...
const white_bk = {
    type: jsPsychCallFunction,
    func: () => { changeBackground("white") }
} 
timeline.push(white_bk)
    // It is too much effort (from my investigation) to change the background colour for these trials. 
    // Hence just change it to white...

const experiment_feedback  = {
    type: jsPsychSurvey,
    button_label_finish: "End experiment",
    required_error: `Please check whether you responded to (all) the question(s)`,
    required_question_label: "*",
    pages:() => {
        return [
            [
                {
                    type: "text",
                    prompt: `What strategy did you use to solve the task? `,
                    name: "strategy_feedback",
                    textbox_columns: 100,
                    textbox_rows: 5,
                },
            ],
            [ /// General feedback
                {
                    type: "text",
                    prompt: `Do you have any comments, thoughts, or remarks in relation to the experiment?`,
                    name: 'open_feedback',
                    textbox_columns: 100,
                    textbox_rows: 5,
                } 
            ]
        ]
    },
    data: { stimulus: "feedback", trial_info: "Feedback" },
    on_finish: (data) => {
        // Add ID to all entries: 
        jsPsych.data.get().addToAll({ id:                   ID });

        // Add all the other information in a separate column (easy to filter out), but is strictly not necessary
        // Current window size
        data.height = window.innerHeight
        data.width = window.innerWidth

        data.open_feedback = data.response.open_feedback

        // save interactive data
        data.interactive = jsPsych.data.getInteractionData()["trials"]
    }
}
timeline.push(experiment_feedback)


timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "Thank you for participating!  You will be redirected...",
    choices: "NO_KEYS",
    trial_duration: 2000, 
    on_load: () => {
        saveData( study_name, "_data_" + start_dateTime + "_" + ID + ".csv", jsPsych.data.get().csv() )
        if(debug) { console.log("Redirecting..... ")}
        // If local save is enabled save it as a csv 
        if(save_local_data) { jsPsych.data.get().localSave('csv','mydata.csv') }
    }
})

// Exit fullscreen and end experiment. 
timeline.push({
    type: jsPsychFullscreen,
    message: "", 
    fullscreen_mode: false,    
    on_finish: () => {
        window.location = redirect_link
        if(debug){ console.log("Linking") }
    }
}); 


timeline.push( {type: jsPsychHtmlKeyboardResponse, stimulus: ""} )

jsPsych.run(timeline)