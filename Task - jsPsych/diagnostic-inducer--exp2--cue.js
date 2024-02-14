////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// CHANGE THESE BEFORE EXPERIMENT!
const debug = true               // Show some console information
const skip_instructions = false  // Skip intro? (to test trials)
const save_local_data = false    // Save a local file (test analysis)


// const study_name = "exp1" // add to filename 
// const redirect_link = "https://app.prolific.com/submissions/complete?cc=COAKFO2E" 
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
const allowed_responses = ["f","j"];      // Allowed responses
const response_sides = ["LEFT","RIGHT"];  // What participants will RESPOND to (e.g., If X appears press responseSides[0])
    // these two parameters correspond in appearance 
    // i.e., f (or whatever key) should correspond to the response side (left)

////    Inducer parameters     ////
const inducer_colours = ["red", "yellow", "blue", "green", "purple"]      // Inducer colour randomize between participants (if more than 1)
    // ["darkred", "yellow", "purple"] 
    // This is also what is DISPLAYED (i.e., text) to participants. Should therefore be a readable name. 

////    Diagnostic parameters   ////
const number_of_inducers = 2//24;       // Number of inducers 
    // !!! CHANGE max trials !!! 
const diagnostic_min_length = 4         // Min run length
const diagnostic_max_length = 16        // Max run length
const max_diagnostic_trials = 24//240     // Total max diagnostic trials
    // max/2 * number_of_inducers

////    Inducer CUE      ////
const cue_size = 50
const cue_min_length = 0
const cue_max_length = 5
const cue_duration = 10000000        // How long is the pre-cue present for? 

////    Practice parameters     ////
const prac_diagnostic_rounds = 16                    // Number of diagnostic practice rounds
    // Set to 0 if no practice rounds should occur.
const prac_inducer_rounds = 6
    // NB: Max 64 rounds of new stimuli (prac_inducer_rounds + number_of_inducer > 64)
const prac_cue_rounds = 16
const prac_cue_num = 3





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

// Draw arrow
// function draw_up_arrow(c){
//     var ctx = c.getContext('2d');
//     ctx.fillStyle = rnd_cue_col

//     // Draw the arrow body
//     ctx.fillRect(130, 150, 40, 50);

//     // Draw the arrowhead
//     ctx.beginPath();
//     ctx.moveTo(150, 90);
//     ctx.lineTo(100, 150);
//     ctx.lineTo(200, 150);
//     ctx.closePath();
//     ctx.fill();
// }

//// Draw cues: 
// square
function draw_square(c){
    var ctx = c.getContext('2d');
    ctx.fillStyle = rnd_cue_col

    ctx.beginPath();
    ctx.rect(0, 0, cue_size, cue_size);
    ctx.fill();
    ctx.closePath();
}
// triangle
function draw_triangle(c){
    var ctx = c.getContext('2d');
    ctx.fillStyle = rnd_cue_col

    ctx.beginPath();
    ctx.moveTo(0, cue_size); // First vertex
    ctx.lineTo(cue_size, cue_size); // Second vertex
    ctx.lineTo((cue_size/2),0); // Third vertex
    ctx.fill();
    ctx.closePath();
}
// circle
function draw_circle(c){
    var ctx = c.getContext('2d');
    ctx.fillStyle = rnd_cue_col

    ctx.beginPath();
    ctx.arc(cue_size/2, cue_size/2, cue_size/2, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.closePath();
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

////    Cue trial           /////
// Cue trial
function cue_trial_f(inducer, diag){
    var v = {
        type: jsPsychCanvasKeyboardResponse,
        canvas_size: [cue_size, cue_size],
        stimulus: rnd_cue_stimulus,
        prompt: ``,
        choices: "NO_KEYS",
        trial_duration: cue_duration,
        data: {
            stimulus: "Cue", 
            inducer_run: inducer,                   // Inducer run number (i.e., block)
            diagnostic_run: diag,                 // Diagnostic trial number
            inducer_trial: false,                     // Not an inducer trial
            trial_info:"Cue"
        }
    }
    return v
}


////   Trial functions          /////
function diagnostic_instructions_FNC(){
    // no parameters needed
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
            if(debug){ console.log(data) }
        }
    }
    timeline.push( diagnostic_task_instruction )
    timeline.push( short_fixation )
}

function inducer_instruction_FNC(run_stimuli, exp_block, trial_info){
    // run_stimuli == Randomly selected stimuli for the current block 
    // exp_block   == Current block number
    // trial_info  == General trial info

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
            trial_info: trial_info
        },
        trial_duration: instruction_delay, 
        on_finish: (data) => { 
            if(debug){ console.log(data) } 
        }
    }
    timeline.push(inducer_instruction)
    timeline.push(short_fixation)
}

function diagnostic_FNC(run_diagnostic_length, run_stimuli, exp_block, cue_diag_num, trial_info, force_equal=false){
    // run_diagnostic_length == length of the current diagnostic length
    // run_stimuli           == Block stimuli
    // inducer_round         == Inducer block 
    // cue_diag_num          == Apperance of the cue
    // trial_info            == General trial information 
    
    let run_rnd_italic;
    var rnd_prac_dia;

    // Randomly decide whether the stimulus should appear in italic or not.
    if(force_equal){
        let prac_dia = Array(  Array(Math.floor(run_diagnostic_length/2)).fill(1) ,  Array( Math.ceil(run_diagnostic_length/2) ).fill(0)  ).flat()
        // Split half and half practice diagnostic length
        
        rnd_prac_dia = jsPsych.randomization.shuffle(prac_dia)
        // Randomize half/half split 
    }
    
    ////    Generate diagnostic trials  ////
    for(let exp_diag = 0; exp_diag < run_diagnostic_length; exp_diag++){

        // For each trial...
        // Randomly get a stimulus (from the stimuli list)
        let rnd_diag_stimulus = jsPsych.randomization.sampleWithReplacement(run_stimuli, 1)[0]
        
        // Sample or choose italic/upright
        if(force_equal){
            run_rnd_italic = rnd_prac_diag[exp_diag]
        } else {
            run_rnd_italic = jsPsych.randomization.sampleWithReplacement([true,false], 1, run_italic_bias)[0]
        }

        // Create trial:
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
                post_cue: () => {                         // Whether the trials is before or after the cue
                      if(exp_diag>cue_diag_num) { return true }
                      else                      { return false }
                },
                inducer_trial: false,                     // Not an inducer trial
                italic: run_rnd_italic,             // Whether the run is ITALIC or not
                trial_info: trial_info,         // This is a diagnostic trial
                correct_inducer_response_side: () => { // Required response side for the inducer task
                    if( rnd_diag_stimulus == run_stimuli[0] ) { return rnd_response_sides[0] }
                    else                                      { return rnd_response_sides[1] }
                },
                correct_diag_response_side: () => {     // Required response side for the diagnostic task
                    if (run_rnd_italic) { return rnd_response_sides[0] } 
                    else                { return rnd_response_sides[1] } 
                },
            },
            on_finish: (data) => {
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
        
        ////        Timeline         ////
        // Trial
        timeline.push(diagnostic_run)
    
        // Feedback
        timeline.push(too_slow_trial)
        timeline.push(wrong_response_trial)

        // Fixation
        timeline.push(short_fixation)

        // Cue 
        if(exp_diag==cue_diag_num){
            // Pre cue trial
            timeline.push( cue_trial_f(exp_block, exp_diag) )
                // Add exp_block and exp_diag to trial

            // Fixation,
            timeline.push(short_fixation)
        }
    }
}

function inducer_FNC(run_stimuli, exp_block, trial_info){
    // run_stimuli == Randomly selected stimuli for the current block 
    // exp_block == Current block number

    // Randomly get a stimulus for the inducer trial
    let rnd_inducer_stimulus = jsPsych.randomization.sampleWithReplacement(run_stimuli, 1)[0]

    // Create inducer trial: 
    let inducer_task = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: () => { return `<p style="font-size: ${general_font_size}; color:${rnd_inducer_colour}">${rnd_inducer_stimulus}` },
        choices: allowed_responses,
        trial_duration: trial_duration,
        data: {
            stimulus: rnd_inducer_stimulus,         // Stimulus
            inducer_run: exp_block,                     // Inducer run number
            inducer_trial: true,                    // This is an inducer trial
            trial_info: trial_info,            // General trial info 
            correct_indu_response_side: () => {     // Required response side for the diagnostic task
                if (rnd_inducer_stimulus == run_stimuli[0]) { return rnd_response_sides[0] } 
                else                                        { return rnd_response_sides[1] } 
            }
        },
        on_finish: (data) => {
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
    
    timeline.push( inducer_task )

    timeline.push( short_fixation )
}



////////////////////////////////////////////////////////////////////////////////////////////
////                        General experiment things                                   ////
////////////////////////////////////////////////////////////////////////////////////////////


//// General ////
// Unique ID
var ID = jsPsych.randomization.randomID(8);
if(debug){ console.log("ID = " + ID) }

// Shuffle stimuli list
let rnd_stimuli = jsPsych.randomization.shuffle(stimuli);  // Shuffle stimuli list
if(debug) { console.log("Randomized stimuli list:", rnd_stimuli) }

// Inducer colour
let rnd_inducer_colour = jsPsych.randomization.sampleWithReplacement(inducer_colours, 1)[0]
if(debug){ console.log("Inducer colour: ", rnd_inducer_colour) }


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


//// CUE  ///
// Cue colour
let r_col = inducer_colours.filter(item => item !== rnd_inducer_colour);
let rnd_cue_col = jsPsych.randomization.sampleWithReplacement(r_col, 1)[0]
if(debug) { console.log("Inducer colour: ", rnd_inducer_colour, " |  Pre-cue colour: ", rnd_cue_col)}

// Cue stimulus
const rnd_cue_stimulus = jsPsych.randomization.sampleWithReplacement([draw_circle,draw_square,draw_triangle], 1)[0]
if(debug){ console.log(rnd_cue_stimulus) }

// Pre-inducer cue trial length
let cue_array = Array.from(Array(cue_max_length-cue_min_length+1), (x, i) => i + cue_min_length) 
if(debug){ console.log("Pre-cue array:", cue_array) }

// Randomly sample cue lengths. 
let rnd_cue_diag_length = [];
// We randomy sample "number_of_inducer" times from the "diagnostic_range"
for(let i = 0; i < number_of_inducers; i++){
    while(true){
        var l = jsPsych.randomization.sampleWithReplacement(cue_array, 1)[0] 
            // sample a length
    
        // test if length exceed the diagnostic length (i.e., cue of 5 on a diagnostic of 4 would not work)
        var t = rnd_diagnostic_length[i]  - l 
        if(t >= 3){
            rnd_cue_diag_length.push(l)
            break;
        }
    }
}
if(debug){ console.log("Cue length list:", rnd_cue_diag_length) }


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
        We are investigating concentration and memory. 
        <br><br>

        In this (experimental) study, we will ask you to complete two categorization tasks in parallel,<br>
        with instructions for one categorization changing during the task. <br>
        The task is difficult (especially at the start), but feedback will be provided. <br>
        The task takes around 15-20 minutes. <br>
        If you are up for a challenge, check it out - and do your best! :)
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
            if(debug){  console.log(data)  }
        }
    });
}

// Shuffle left/right for each participants (remains the same throughout)
let rnd_response_sides = jsPsych.randomization.shuffle(response_sides); 

let run_stimuli;

/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////
////        Task timeline       ////
////////////////////////////////////


// Diagnostic instructions
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
        if(debug){  console.log(data) }
    }
}
timeline.push(diagnostic_task_instruction_description)

// Diagnostic instructions
diagnostic_instructions_FNC()


//// Practice
// Diagnostic practice trials
run_stimuli = [rnd_stimuli[0], rnd_stimuli[1]]
// Remove added inducer stimuli from the main list 
rnd_stimuli.splice(0,2) 

diagnostic_FNC(prac_diagnostic_rounds, run_stimuli, "prac", 100, "diagnostic practice", true)
    // these round need a forced sequence. 

// Inducer description
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
        if(debug){ console.log(data) }
    }
}
timeline.push( inducer_task_instruction_description )

for(let i = 0; i < prac_inducer_rounds; i++){
    // Randomly decide whether the stimulus should appear in italic or not.
    if(force_equal){
        let prac_dia = Array(  Array(Math.floor(run_diagnostic_length/2)).fill(1) ,  Array( Math.ceil(run_diagnostic_length/2) ).fill(0)  ).flat()
        // Split half and half practice diagnostic length
        
        rnd_prac_dia = jsPsych.randomization.shuffle(prac_dia)
        // Randomize half/half split 
    }

    // Diagnostic practice trials
    let run_stimuli = [rnd_stimuli[0], rnd_stimuli[1]]
    // Remove added inducer stimuli from the main list 
    rnd_stimuli.splice(0,2) 

    inducer_FNC(run_stimuli, "prac", "inducer practice")
}

// Cue instructions
let cue_instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function(){   
        return `<div style="font-size:${instruction_font_size}">
        You have now completed the practice.
        


        "Q"HOEH#OHJIR"#OO"#Rrjio

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
        if( debug ){ console.log(data) }
    }
}
timeline.push( cue_instructions )

// Cue practice
run_stimuli = [rnd_stimuli[0], rnd_stimuli[1]]
// Remove added inducer stimuli from the main list 
rnd_stimuli.splice(0,2) 
inducer_instruction_FNC(run_stimuli, "prac", "cue practice")
diagnostic_FNC(prac_cue_rounds, run_stimuli, "prac", prac_cue_num, "cue practice")
inducer_FNC(run_stimuli, "prac", "inducer practice")


//// Proper task start instructions
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
        if( debug ){ console.log(data) }
    }
}
timeline.push( proper_task_start )
timeline.push( long_fixation )


//// Task proper 
for(let i = 0; i < number_of_inducers; i++){
    //// Setup
    // Get new inducer stimuli
    let run_stimuli = [rnd_stimuli[0], rnd_stimuli[1]]
    // Remove added inducer stimuli from the main list 
    rnd_stimuli.splice(0,2) 

    // Get the current diagnostic length
    let diag_len = rnd_diagnostic_length[i] 

    // Get trial when the cue will appear (diag - cue_len)
    let cue_diag_num = diag_len - rnd_cue_diag_length[i];


    //// Timeline: 
    // Inducer instructions
    timeline.push( inducer_instruction_FNC( run_stimuli, i, "inducer instructions" ) )

    // Diagnostic trials 
    timeline.push( diagnostic_FNC( diag_len, run_stimuli, i, cue_diag_num, "diagnostic trial" ) )

    // Inducer trial
    timeline.push( inducer_FNC( run_stimuli, i, "inducer trial") )
}



/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////



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

        // Save interactive data
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
        saveData( study_name + "_data_" + start_dateTime + "_" + ID + ".csv", jsPsych.data.get().csv() )
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
        if(debug){ console.log("Redirecting") }
    }
}); 

timeline.push( {type: jsPsychHtmlKeyboardResponse, stimulus: ""} )

jsPsych.run(timeline)