////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// CHANGE THESE BEFORE EXPERIMENT!
const debug = true              // Show some console information
const skip_instructions = false  // Skip intro? (to test trials)
const save_local_data = true    // Save a local file (test analysis)


////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////


////////////////////////////
////    Parameters      ////
////////////////////////////

////    background default      ////
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
const experiment_colours = ["blue", "green", "yellow"]      // Inducer colour randomize between participants (if more than 1)
    // This is also what is DISPLAYED to participants. Should therefore be a readable name. 

// Inducer pre-cue
const pre_cue_max = 4
const pre_cue_min = 1
const pre_cue_duration = 750        // How long is the pre-cue present for? 


////    Diagnostic parameters   ////
const number_of_inducers = 1//4;       // Number of inducers 
const diagnostic_min_length = 4         // Min run length
const diagnostic_max_length = 16     // Max run length
const max_diagnostic_trials = 10     // Total max diagnostic trials
    // NOTE IS THIS VALUE IS NOT WITHIN THE BOUNDS OF NUMBER OF INDUCER*diagnostic_max/min an INFINITE LOOP IS CREATED
    // e.g.: 
    // MIN: 4*10 = 40 (max_diagnostic_trials SHOULD NOT BE LESS THAN 40)
    // MAX: 16*10 = 160 (max_diagnostic_trials SHOULD NOT EXCEED 160)

const prac = 0//10                       // Number of diagnostic practice rounds

// Not used 
const run_italic_bias = [1,1]           // Left value correspond to ITALIC probability, right correspond to UPRIGHT probability


////    Stimuli list    ////
const stimuli = ["gwn", "eug", "sht", "cjm", "svs", "orp", "scy", "rve", "wjb", "drn", 
    "emd", "nz1", "dlo", "hvp", "hmn", "auj", "cuo", "t&g", "jca", "ukt", "tne", "wue", 
    "hhu", "m3p", "qut", "gbm", "byp", "mav", "sbk", "dnc", "mda", "clr", "uga", "ibb", 
    "uau", "ozu", "lfd", "f.w", "mub", "kil", "yag", "hsm", "fef", "lbx", "kpt", "upv", 
    "ifg", "foc", "mtd", "nh3", "wng", "t53", "wtc", "re8", "jme", "a82", "dym", "eif", 
    "ctv", "tr6", "oco", "dmg", "crt", "vh1", "slp", "cea", "pwa", "eal", "f47", "ysh", 
    "xss", "me1", "m45", "enw", "gft", "doy", "hrf", "oac", "wma", "lst", "yle", "s.r",
    "hyo", "tey", "pib", "olt", "luu", "k19", "ff4", "efr", "k5u", "mhs", "pfl", "rch", 
    "yrl", "nua", "afb", "ayy", "i50", "v&t", "m16", "dpf", "ubr", "syn", "lgs", "iec", 
    "bsl", "vvm", "umf", "dba", "aip", "dts", "w&d", "avc", "dv6", "j&j", "sdc", "atr", 
    "spm", "alh", "ows", "idd", "abv", "cml", "lpo", "r22", "z28", "eyt"]
    // Randomly selected stimuli that should not overlapp by more than 1 character 












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


// Connection to server? idk
function saveData(name, data){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'write_data.php'); // 'write_data.php' is the path to the php file described above.
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({filename: name, filedata: data}));
}

////     Function     ////
// Get data function
Date.prototype.today = function () { 
    return this.getFullYear() + "-" + (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"-"+ ((this.getDate() < 10)?"0":"") + this.getDate();
}
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +"-"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +"-"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}
var start_dateTime = new Date().today() + "_" + new Date().timeNow();
if(debug) { console.log(start_dateTime) }

// Change background function
function changeBackground(colour) {
    document.body.style.background = colour;
}

// Pre-cue arrow
function draw_up_arrow(c){
    var ctx = c.getContext('2d');
    ctx.fillStyle = rnd_pre_cue_col

    // Draw the arrow body
    ctx.fillRect(130, 150, 40, 50);

    // Draw the arrowhead
    ctx.beginPath();
    ctx.moveTo(150, 90);
    ctx.lineTo(100, 150);s
    ctx.lineTo(200, 150);
    ctx.closePath();
    ctx.fill();
}
function draw_circle_arrow(c){
    var ctx = c.getContext('2d');
    ctx.fillStyle = rnd_pre_cue_col
    // Set the center and radius of the circle
    const centerX = 300 / 2;
    const centerY = 300 / 2;
    const radius = 100;

    // Draw the circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -2.8, .8* Math.PI);
    ctx.stroke();

    // Draw the arrow inside the circle
    const arrowAngle = -Math.PI / 4; // Angle at which the arrow points
    const arrowLength = 30;

    const arrowX = centerX + Math.cos(arrowAngle) * (radius - arrowLength);
    const arrowY = centerY + Math.sin(arrowAngle) * (radius - arrowLength);

    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(arrowX, arrowY+60);
    ctx.lineTo(centerX + Math.cos(arrowAngle + Math.PI / 8) * arrowLength, centerY + Math.sin(arrowAngle + Math.PI / 8) * arrowLength);
    ctx.stroke();
}

var pre_cue_trial = {
    type: jsPsychCanvasKeyboardResponse,
    canvas_size: [300, 300],
    stimulus: draw_circle_arrow,
    prompt: ``,
    choices: "NO_KEYS",
    trial_duration: 100000,
    data: {
        stimulus: "pre-cue", 
        trial_info:"Pre cue"},
}
timeline.push(pre_cue_trial)



////        Trials          ////
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

//// FEEDBACK ////
// Wrong response info
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
// Too slow info
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

//// Feedback block
// Wrong response trial (background change + info)
const wrong_response_trial = {
    timeline: [set_background_colour_wrong_response, wrong_response , set_background_colour_default],
    conditional_function: () => {
        let data = jsPsych.data.get().last(1).values()[0]
        
        if(debug){ console.log(data) }
        
        if( data.correct_response == false)  { return true } 
        else                        { return false }
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


///////////////////////////////////////////////////////////////////////////////////////
// Set background to a light gray
timeline.push(set_background_colour_default)    
    // To ensure the background colour is correct.


// Inducer colour
let rnd_inducer_colour = jsPsych.randomization.sampleWithReplacement(experiment_colours, 1)[0]
let r_col = experiment_colours.filter(item => item !== rnd_inducer_colour);
let rnd_pre_cue_col = jsPsych.randomization.sampleWithReplacement(r_col, 1)[0]
if(debug) { console.log("Inducer colour: ", rnd_inducer_colour, " |  Pre-cue colour: ", rnd_pre_cue_col)}

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
    } while( diff > 0)
    if(debug){ console.log("Fixed diagnostic lengths:", rnd_diagnostic_length) }
}


// Generate inducer pre-cue
let pre_cue_arr = Array.from(Array(pre_cue_max-pre_cue_min+1), (x, i) => i + pre_cue_min) 
if(debug){ console.log("Pre-cue array:", pre_cue_arr) }


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
            return `<p>We have detected that your browser cannot use fullscreen. \n
            Try to use a different browser that supports fullscreen.`
        } else if(data.browser) {
            return `<p>We have detected that you are using Safari, which is not able to run the experiment properly. \n
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
       `<div style="font-size:${instruction_font_size}"> 
        
        <h3>Welcome to this cognitive psychology study!</h3>
        We are investigating cognitive flexibility in humans.
        <br><br>

        The study is conducted by Steffen Aasen (Master student) and \n
        Torsten Martiny-Huenger (Supervisor) at UiT – The Arctic University of Norway.
        <br><br>
        If you have questions about the study, you may contact Torsten Martiny-Huenger at (torsten.martiny-huenger@uit.no). </p>

        </div>`,    ////  New page
        `<div style="font-size:${instruction_font_size}"> 

        <h3>About the experiment</h3>                
        In this study, you will have to remember two tasks. \n
        You will switch between these tasks based on the targets that appear on the screen. \n
        The first task that you will be presented with, will <b>remain the same </b> throughout the experiment. \n
        The second task will change throughout experiment and will only be executed once. \n
        When the task changes, a new instruction will appear, indicating the new relationships. \n
        Your task is to respond as <b>fast and accurately</b> as possible to the current task. \n
        Only one task will be executed during any one trial. This will be indicated by its colour.<br><br> \n 

        In the experiment you will only respond using a the ${allowed_responses[0]} and ${response_sides[1]} key (unless otherwise noted).\n
        These will be indicated with a ${response_sides[0]} or ${response_sides[1]} side.\n
        That is, when the task asks you to respond with a ${response_sides[0]} response, you need to press the ${allowed_responses[0]} key. \n
        If it asks for a ${response_sides[1]} response, you must respond with the ${allowed_responses[1]} key.<br>

        These keys will remain the same throughout the experiment. <br><br>
                
        At the end of the experiment you will have an opportunity to proviod feedback related to the experiment. 
        </div>`,    ////  New page
        `<div style="font-size:${instruction_font_size}">
        
        <h3> Consent </h3>
        
        Participation in the study is voluntary. \n
        All responses to this experiment are collected and stored anonymously. That means they cannot be traced back to you. \n
        The anonymous storage means we cannot provide participants with their responses upon request. \n
        You can quit the study without giving a reason by closing the browser tab. No data will be stored in that case.\n
        <br><br> 
        For scientific rigour, we will follow a practice known as "open science". \n
        In that spirit, we will make the data publicly available for anyone to download. \n
        By clicking NEXT, you agree to have your data used in this manner.\n
        <i>Importantly, your data is anaymous and cannot be traced back to you</i>.\n
        
        </div>`,

        ]
    },
    show_clickable_nav: ["Next"],
    data: { stimulus: "The experiment and consent", trial_info: "The experiment and consent" },
    on_finish: (data) => {
        data.page_index1 = data.view_history[0].viewing_time
        data.page_index2 = data.view_history[1].viewing_time
        data.page_index3 = data.view_history[2].viewing_time
        
        if(debug){ console.log(data) }
    }
}
if(skip_instructions){} else { timeline.push(about_the_experiment_and_consent) }

////       Initialize fullscreen and START        ////
if(skip_instructions==false){
    timeline.push({
        type: jsPsychFullscreen,
        message: `<div style="font-size:${instruction_font_size}">
        This experiment requires you to enter fullscreen. This will be initiated by clicking the button below.
        <br><br>
        </div>`,
        button_label: "Enable fullscreen",
        fullscreen_mode: true, 
        data: {trial_info: "technicals" },
        on_finish: (data) => { 
            // Current window size
            data.width = window.innerWidth
            data.height = window.innerHeight
            if(debug){  console.log(data)  }
        }
    });
}

/////////////////////////////////////////
/////            TASK               /////
/////////////////////////////////////////

let rnd_diagnostic_response_sides = jsPsych.randomization.shuffle(response_sides);    // randomize response side 
        // Could/would probably be a good idea to randomize italic/upright appearance as well, but w/e

var short_prac = ""
if(prac>0){
    var short_prac = `You will receive a short practice round following the task on the next screen.<br>`
}

////    GENERAL DIAGNOSTIC INSTRUCTIONS   ////
let diagnostic_task_instruction_description = {
    type: jsPsychInstructions,
    pages: () => { 
        return [`<div style="font-size:${instruction_font_size}">
        The experiment will proceed quickly without any breaks, \n
        please ensure that you are in a quite environment where you are unlikely to be distracted/disrupted.      
        The experiment takes approximately 20 minutes.
        </div>`, 

        `<div style="font-size:${instruction_font_size}">
        We ask that you put your left index finger on the <b> ${allowed_responses[0].toUpperCase()} </b> key \n
        and your right index finger on the <b> ${allowed_responses[1].toUpperCase()} </b> key. \n
        These will be the only valid (and functional) responses in this experiment (unless otherwise noted).
        <br><br>

        In the next screen you will see the first task, that <b> will not change </b> in the experiment. \n 
        This task must be responded to when the target (stimulus) appears in <b> black </b> colour.
        <br><br>

        ${short_prac}
        <br> 
        After that, the second task will be shown. \n
        This task will change throughout the the experiment, and will be clearly indicated with a new description.<br> \n
        You must respond to this task when the target appears in \n
         <span style="color:${rnd_inducer_colour}"> ${rnd_inducer_colour.toUpperCase()}</span>. \n
        <br><br>

        You will receive a maximum of 20 seconds reading each of the tasks (which is plenty of time). <br><br>

        The experiment starts immediately when you click NEXT.
        </div>`]
    },
    allow_keys: false, 
    show_clickable_nav: true,
    post_trial_gap: 1500,
    data: { stimulus: "Instructions", trial_info: "Final experiment explanation" },
    on_finish: (data) => {
        data.page_index1 = data.view_history[0].viewing_time
        data.page_index2 = data.view_history[1].viewing_time

        // Current window size
        data.width = window.innerWidth
        data.height = window.innerHeight

        if(debug){ console.log(data) }
    }
}
timeline.push(diagnostic_task_instruction_description)

// Only displayed once, instruction remains the same throughout the experiment
let diagnostic_task_instruction = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function(){   
        return [ 
        `<p style="font-size: ${general_font_size};"> If a target appears <i> italic </i> press ${rnd_diagnostic_response_sides[0]}`+
        `<p style="font-size: ${general_font_size};"> If a target appears upright press ${rnd_diagnostic_response_sides[1]}`]
    }, 
    prompt: "Press any SPACE to continue",
    choices: " ", 
    trial_duration: instruction_delay,
    data: {
        stimulus: `If italic press ${rnd_diagnostic_response_sides[0]} | If upright press ${rnd_diagnostic_response_sides[1]}`,
        trial_info: "Diagnostic instructions",
    },
    on_finish: (data) => { 
        // Current window size
        data.width = window.innerWidth
        data.height = window.innerHeight

        if(debug){ console.log(data) }
    }
}
timeline.push(diagnostic_task_instruction)

/////////  PRAC DIAG    ////// 
if(prac > 0){
    for(let pi = 0; pi < prac; pi++){
        let rnd_diag_stim = jsPsych.randomization.sampleWithReplacement(["cat", "dog"], 1)[0]
        let run_rnd_italic = jsPsych.randomization.sampleWithReplacement([true,false], 1, run_italic_bias)[0]
    
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
            trial_duration: trial_duration,
            data: {
                stimulus: rnd_diag_stim,         // Stimulus
                inducer_run: 0,                   // Inducer run number (i.e., block)
                diagnostic_run: pi,                 // Diagnostic trial number //start with 1
                inducer_trial: false,                   // Not an inducer trial
                italic: run_rnd_italic,             // Whether the run is ITALIC or not
                trial_info: "practice",         // This is a diagnostic trial
                correct_diag_response_side: () => {     // Required response side for the diagnostic task
                    if (run_rnd_italic) { return rnd_diagnostic_response_sides[0] } 
                    else                { return rnd_diagnostic_response_sides[1] } 
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
                    else                                               { data.correct_response = 0 }
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
}

// Here we create the experiment blocks
for(let exp_block = 0; exp_block < number_of_inducers; exp_block++){ // less than, since we start at 0

    ////////////////////////////////////////
    ////    Inducer instructions        ////
    ////////////////////////////////////////

    // This first get the number of different inducers
    let run_stimuli = [rnd_stimuli[0], rnd_stimuli[1]] // Get new stimuli
    rnd_stimuli.splice(0,2) // Remove those stimuli from the list

    // Get the curret diagnostic length from the pre-generated list
    let run_diagnostic_length = rnd_diagnostic_length[exp_block] 
    // randomize left/right response for the inducer 
    let rnd_inducer_response_sides = jsPsych.randomization.shuffle(response_sides)

    // Generate pre-cue num, 
    let pre_cue_num = jsPsych.randomization.sampleWithReplacement(pre_cue_arr, 1)[0];
    // Get the diag length - pre_cue (for trial appearance)
    let cue_trial_num = rnd_diagnostic_length[exp_block] - pre_cue_num;
    
    ////        Inducer instruction         ////
    let inducer_instruction = { 
        type: jsPsychHtmlKeyboardResponse,
        stimulus: () => {   
            return  `<p style="font-size: ${general_font_size};"> If ${run_stimuli[0]} press ${rnd_inducer_response_sides[0]}`+
                    `<p style="font-size: ${general_font_size};"> If ${run_stimuli[1]} press ${rnd_inducer_response_sides[1]}`; 
        }, 
        prompt: "Press any SPACE to continue",
        choices: " ", 
        data: {
            inducer_run: exp_block,     // Inducer run number
            stimulus: `If ${run_stimuli[0]} press ${rnd_inducer_response_sides[0]} | If ${run_stimuli[1]} press ${rnd_inducer_response_sides[1]}`,
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
                    return `<p style="font-size: ${general_font_size};"><i>${rnd_diag_stimulus}</i>`
                } else {
                    return `<p style="font-size: ${general_font_size};">${rnd_diag_stimulus}`
                }
            }, 
            choices: allowed_responses,
            trial_duration: trial_duration,
            data: {
                stimulus: rnd_diag_stimulus,         // Stimulus
                inducer_run: exp_block,                   // Inducer run number (i.e., block)
                diagnostic_run: exp_diag,                 // Diagnostic trial number //start with 1
                inducer_trial: false,                   // Not an inducer trial
                italic: run_rnd_italic,             // Whether the run is ITALIC or not
                trial_info: "Diagnostic trial",         // This is a diagnostic trial
                pre_cue: () => {return exp_diag-cue_trial_num},
                correct_inducer_response_side: () => { // Required response side for the inducer task
                    if(rnd_diag_stimulus == run_stimuli[0]) { return rnd_inducer_response_sides[0] }
                    else                                    { return rnd_inducer_response_sides[1] }
                },
                correct_diag_response_side: () => {     // Required response side for the diagnostic task
                    if (run_rnd_italic) { return rnd_diagnostic_response_sides[0] } 
                    else                { return rnd_diagnostic_response_sides[1] } 
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
                    else                                                    { data.correct_response = 0 }
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

        if(exp_diag==cue_trial_num){
            // Pre cue trial
            var pre_cue_trial = {
                type: jsPsychCanvasKeyboardResponse,
                canvas_size: [300, 300],
                stimulus: draw_up_arrow,
                prompt: ``,
                choices: "NO_KEYS",
                trial_duration: pre_cue_duration,
                data: {
                    stimulus: "pre-cue", 
                    inducer_run: exp_block,                   // Inducer run number (i.e., block)
                    diagnostic_run: exp_diag,                 // Diagnostic trial number
                    inducer_trial: false,                     // Not an inducer trial
                    trial_info:"Pre cue"},
                on_finish: (data) => {
                    // Current window size
                    data.width = window.innerWidth
                    data.height = window.innerHeight
                }
            }
            timeline.push(pre_cue_trial)
            
            // Fixation,
            timeline.push(short_fixation)
        }
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
            correct_inducer_response_side: () => { // Required inducer response side
                if(rnd_inducer_stimulus == run_stimuli[0])  { return rnd_inducer_response_sides[0] }
                else                                        { return rnd_inducer_response_sides[1] }
            },
        },
        on_finish: (data) => {
            // Current window size
            data.width = window.innerWidth
            data.height = window.innerHeight
            
            // Find correct response key 
            if(data.correct_inducer_response_side == response_sides[0]){
                data.correct_response_key = allowed_responses[0] 
            } else { 
                data.correct_response_key = allowed_responses[1] }
                // Correct response (according to the active trial)
                if(data.response == data.correct_response_key) { data.correct_response = 1 }
                else                                           { data.correct_response = 0 }
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
    button_label_finish: "Next",
    required_error: `Please check whether you responded to (all) the question(s)`,
    required_question_label: "*",
    pages:() => {
        return [
            [
                {
                    type:"html",
                    prompt: `You have now completed the central part of the experiment.<br>\n
                    To complete the study, please respond to the preceding question.`
                }
            ],
            [  /// Distracted ? (Likert scale may be weird)
                {
                    type:"html",
                    prompt: `Similar to motivation, people are distracted to various degrees for various reasons. \n 
                    There is nothing wrong with being distracted and we kindly ask that you answer truthfully.<br><br>
                    (The number will be highlighted when you click it)` 
                },
                {
                    type: "likert",
                    prompt: `Click the number that you believe reflect the degree to which you were distracted during the task.`,
                    name: "distraction", 
                    likert_scale_max: 7,
                    likert_scale_min_label: "Not at all distracted  -  ",
                    likert_scale_max_label: "  -  Very distracted",
                    required: true, 
                },
                {
                    type: "text",
                    prompt: "Is there anything you want to add in relation to the motivation question (above)?",
                    name: 'motivation_feedback',
                    textbox_columns: 50,
                    textbox_rows: 3,
                }
            ], 
            [ /// General feedback
                {
                    type: "text",
                    prompt: `Do you have any other comments, thoughts, or remarks in relation to the experiment? \n
                    (Your feedback is highly appreciated!)`,
                    name: 'open_feedback',
                    textbox_columns: 100,
                    textbox_rows: 5,
                } 
            ]
        ]
    },
    data: { stimulus: "gender-age-distraction-motivation-feedback", trial_info: "Demographics, motivation, distraction and feedback" },
    on_finish: (data) => {
        // Add ID to all entries: 
        jsPsych.data.get().addToAll({ id:                   ID });
        // jsPsych.data.get().addToAll({ age:                  age });
        // jsPsych.data.get().addToAll({ gender:               gender });
        // jsPsych.data.get().addToAll({ distraction:          data.response.distraction });
        // jsPsych.data.get().addToAll({ distraction_feedback: data.response.distraction_feedback });
        // jsPsych.data.get().addToAll({ motivation:           data.response.motivation });
        // jsPsych.data.get().addToAll({ motivation_feedback:  data.response.motivation_feedback });
        // jsPsych.data.get().addToAll({ open_feedback:        data.open_feedback });

        // Add all the other information in a separate column (easy to filter out), but is strictly not necessary
        // Current window size
        data.height = window.innerHeight
        data.width = window.innerWidth

        // Demograpghics
        data.gender = data.response.gender
        data.age = data.response.age
        
        // feedback
        data.motivation_feedback = data.response.motivation_feedback
        data.distraction = data.response.distraction
        data.distraction_feedback = data.response.distraction_feedback
        data.open_feedback = data.response.open_feedback

        // Save the data
        if(save_local_data){ jsPsych.data.get().localSave('csv','mydata.csv') }

        // Return data to server
        saveData("data_" + start_dateTime + "_" + ID, jsPsych.data.get().csv());
    }
}
timeline.push(experiment_feedback)


// Exit fullscreen and end experiment. 
timeline.push({
    type: jsPsychFullscreen,
    message: "Thank you for participating in this study! <br><br>", 
    button_label: "End experiment", 
    fullscreen_mode: false,
}); 

jsPsych.run(timeline)