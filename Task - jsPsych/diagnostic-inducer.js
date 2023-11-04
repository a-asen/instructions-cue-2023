////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// CHANGE THESE BEFORE EXPERIMENT!
const debug = true              // Show some console information
const skip_instructions = false  // Skip intro? (to test trials)
const save_local_data = true    // Save a local file (test analysis)


////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////


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


////        Trials          ////
// Fixations
const short_fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: () => { return `<div style='font-size: ${fixation_size}'> + </div>` },
    choices: "NO_KEYS",
    trial_duration: short_fixation_delay, 
    data: { stimulus: "+", trial_info: "Fixation - short" },
} 
const long_fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:  () => { return `<div style='font-size: ${fixation_size}'> + </div>` },
    choices: "NO_KEYS",
    trial_duration: long_fixation_delay, 
    data: { stimulus: "+", trial_info: "Fixation - long" },
}

// Feedback trial
const wrong_response = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:  () => { return `<div style="font-size: ${general_font_size};"> Wrong! </div>` },
    choices: "NO_KEYS",
    trial_duration: wrong_response_delay,
    data: { stimulus: "Wrong", trial_info: "Feedback" }
}
const too_slow = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: () => { return `<div style="font-size: ${general_font_size};"> Slow </div>` },
    choices: "NO_KEYS",
    trial_duration: too_slow_delay, 
    data: { stimulus: "Slow", trial_info: "Feedback" }
}

// Change background
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

// Feedback block
    // Too slow
const too_slow_trial = {
    timeline: [set_background_colour_wrong_response, too_slow, set_background_colour_default],
    conditional_function: () => {
        let data = jsPsych.data.get().last(1).values()[0];
        if(data.response === null)  { return true } 
        else                        { return false }
    }
}
    // Wrong response
const wrong_response_trial = {
    timeline: [set_background_colour_wrong_response, wrong_response , set_background_colour_default],
    conditional_function: () => {
        let data = jsPsych.data.get().last(1).values()[0]
        if( data.correct == false)  { return true } 
        else                        { return false }
    }
}

timeline.push(set_background_colour_default) 
    // To ensure the background colour is correct.


// Experiment vars
var gender;
var age; 
var distraction;
var distraction_feedback;
var motivation;
var motivation_feedback;

// Technical variables
var refresh_rate;               // Can be nice to gather
var height_width_pre;           // Height-width pre fullscreen
var height_width_fullscreen;    // Height-width after fullscreen

var os_browser;     // not necessary, to debug          ???????????????????????????

// Inducer colour
let rnd_inducer_colour = jsPsych.randomization.sampleWithReplacement(inducer_colours, 1)[0]

// Unique ID
var ID = jsPsych.randomization.randomID(8);
if(debug){ console.log("ID = " + ID) }

// Shuffle stimuli list
let rnd_stimuli = jsPsych.randomization.shuffle(stimuli);  // Shuffle stimuli list
if(debug) { console.log(rnd_stimuli) }

// Generate diagnostic length range
let diagnostic_range = Array.from(Array(diagnostic_max_length-3), (x,i) => i + diagnostic_min_length) 
if(debug){ console.log("The range of diagnostic lengths: ", diagnostic_range) }

// Generate probability distribution of the diagnostic run (if relevant)
if(math.toLowerCase() == "none"){
    final_probability_list = Array(diagnostic_max_length-(diagnostic_min_length-1)).fill(1)
} else {
    let halfway = (diagnostic_min_length+diagnostic_max_length)/2 //Diag halfway value
    if(debug){ console.log("Halway: ", halfway) }
    
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

//// Or generate a maximum number of trials? 
    // Using randomly generated lengths will yield varying limits


if(debug){ console.log("With these parameters we end up with an average length of: ",  
                        (diagnostic_min_length+diagnostic_max_length)/2*number_of_inducers) }
if(debug){ console.log("Diag lengths: ", rnd_diagnostic_length) }
if(debug){ console.log("Experiment length: ", rnd_diagnostic_length.reduce((val, a) => val + a)) } // sum the list



////////////////////////////
////    Instructions    ////
////////////////////////////


// We want to ensure some features before task start? 
    // Perhas we  trust prolifics inclusion/exclusion check ? 
const check_browser = {
    type: jsPsychBrowserCheck,
    inclusion_function: (data) => {
        // general info about browser
        refresh_rate = data.vsync_rate
        os_browser = data.os + "_" + data.browser + "_" + data.browser_version
        height_width_pre = "H:" + data.height + "-W:" + data.width
        
        if(debug){
            console.log(screen.height) // total height
            console.log(window.innerHeight) // showecased experiment height
            
            console.log(refresh_rate)
            console.log(os_browser)
            console.log(height_width_pre)
        }

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
            return `<p>We haev detected that you use Safari which is not able to run the experiment properly. \n
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

        The study is conducted by Steffen Aasen (Master student) and \n
        Torsten Martiny-Huenger (Supervisor) at UiT – The Arctic University of Norway.
        
        If you have questions about the study, you may contact Torsten Martiny-Huenger at (torsten.martiny-huenger@uit.no). </p>

        </div>`,  
        /// New page
        `<div style="font-size:${instruction_font_size}"> 

        <h3>About the experiment</h3>                
        In this study, you will have to remember two instructions at once \n




        mbe asked to remember two instructions which are to be implemented in the experiment. \n
        The first task that you will be presented with will <b>remain the same </b> throughout the experiment. \n
        The second task will change in the experiment and will only be executed once. \n
        Each new run will start with a new instruction.  \n
        Your task is to respond as fast and accurately as possible to the current task. \n
        Only one task will be executed during any one trial. This will be indicated by its colour.<br><br> \n 
        To response to any trial, you are asked to click either ${response_sides[0]} using ${allowed_responses[0]}, or \n
        ${response_sides[1]} using ${allowed_responses[1]}
        </div>`, 

        `<div style="font-size:${instruction_font_size}">
        <h3> Consent </h3>
        
        <p>Participation in the study is voluntary. \n
        All responses are collected and stored anonymously and cannot be traced back to you. \n
        The anonymous storage means we cannot provide participants with their responses upon request. \n
        You can quit the study without giving a reason by closing the browser tab. No data will be stored in that case.
        </p>
        </div>`,
        

    ]},
    show_clickable_nav: ["Next"],
    data: { stimulus: "The experiment and consent", trial_info: "The experiment and consent" }
}
if(skip_instructions){} else { timeline.push(about_the_experiment_and_consent) }

////       Initialize fullscreen and START        ////
if(skip_instructions){} else {
    timeline.push({
        type: jsPsychFullscreen,
        message: `<div style="font-size:${instruction_font_size}">
        This experiment requires fullscreen and will be initiated when clicking the button below.
        <br><br>
        </div>`,
        button_label: "Enable fullscreen",
        fullscreen_mode: true
    });
}

//
//
// have to use "resize check" thingy
    // We could add a check after each block, ensuring that participants are in fullscreen ? 

// const check_fullscreen = {
//     type: jsPsychBrowserCheck,
//     inclusion_function: (data) => {
//         height_width_fullscreen = "H:" + data.height + "-W:" + data.width  // var
        
//         if(debug){ console.log("Height and width of fullscreen: ", height_width_fullscreen) }
//         if(screen.height - window.innerHeight <= 10 && screen.height - window.innerHeight >= -10){
//             // We accept a couple of pixel in difference, since there is apparently some small differences between these (or there can be) 
//             if(debug){ 
//                 console.log("Fullscreen detected") 
//                 console.log("Screen and window difference: ", screen.height - window.innerHeight) 
//             }
//             return true
//         }
//     },
//     exclusion_message: (data) => {
//         return `We have detected that you are not in fullscreen,`
//     }
// }
// timeline.push(check_fullscreen)
//
//


/////////////////////////////////////////
/////            TASK               /////
/////////////////////////////////////////

let rnd_diagnostic_response_sides = jsPsych.randomization.shuffle(response_sides);    // randomize response side 
        // Could/would probably be a good idea to randomize italic/upright appearance as well, but w/e


////    GENERAL DIAGNOSTIC INSTRUCTIONS   ////
let diagnostic_task_instruction_description = {
    type: jsPsychInstructions,
    pages: () => { 
        return [`<div style="font-size:${instruction_font_size}">
        The experiment will proceed quickly without any breaks, \n
        please ensure that you are in a quite environment where you are unlikely to be distracted/disrupted.      
        The experiment will take approximately 30 minutes.
        </div>`, //New page

        `<div style="font-size:${instruction_font_size}">
        We ask that you put your left index finger on the <b> ${allowed_responses[0].toUpperCase()} </b> key and your right index finger on the <b> ${allowed_responses[1].toUpperCase()} </b> key. \n
        This will be the only valid (and functional) responses in this experiment, unless otherwise noted. 
        <br><br>

        In the next screen you will see the instructions that <b> will not change </b> in the experiment. \n 
        This task must be responded to when the target (stimulus) appears in <b> black </b> colour. \n
        After that screen, the other task will be shown. \n
        This task will be changed in the experiment, and will be clearly indicated. \n
        You are asked to respond to this task when the target appears in <span style="color:${rnd_inducer_colour}"> ${rnd_inducer_colour}</span>. \n
        <br><br>

        You will receive a maximum of 20 seconds reading each of the instructions (which is plenty of time). <br><br>
        The experiment starts immediately when you click NEXT.
        </div>`]
    },
    allow_keys: false, 
    show_clickable_nav: true,
    post_trial_gap: 1500,
    data: { stimulus: "Instructions", trial_info: "Experiment description" }
}
timeline.push(diagnostic_task_instruction_description)


// Only displayed once, instruction remains the same throughout the experiment
let diagnostic_task_instruction = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function(){   
        return [ 
        `<p style="font-size: ${general_font_size};"> If a target appears <i> italic </i> press ${rnd_diagnostic_response_sides[0]}`+
        `<p style="font-size: ${general_font_size};"> If a target appeas upright press ${rnd_diagnostic_response_sides[1]}`]
    }, 
    prompt: "Press any SPACE to continue",
    choices: " ", 
    trial_duration: instruction_delay,
    data: {
        stimulus: `If italic press ${rnd_diagnostic_response_sides[0]} | If upright press ${rnd_diagnostic_response_sides[1]}`,
        trial_info: "Diagnostic instructions",
    },
    on_finish: () => { console.log(jsPsych.data.getLastTrialData()) }
}
timeline.push(diagnostic_task_instruction)


// Here we create the experiment blocks
for(let exp_block = 0; exp_block < number_of_inducers; exp_block++){ // less than, since we start at 0

    ////////////////////////////////////////
    ////    Diagnostic instructions     ////
    ////////////////////////////////////////

    // This first get the number of different inducers
    let run_stimuli = [rnd_stimuli[0], rnd_stimuli[1]] // Get new stimuli
    rnd_stimuli.splice(0,2) // Remove those stimuli from the list

    let run_diagnostic_length = rnd_diagnostic_length[exp_block] 
        // Get the curret diagnostic length from the pre-generated list
    let rnd_inducer_response_sides = jsPsych.randomization.shuffle(response_sides)
        // randomize left/right response for the inducer 
    
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
                inducer_run: exp_block+1,                   // Inducer run number (i.e., block)
                diagnostic_run: exp_diag+1,                 // Diagnostic trial number //start with 1
                inducer_trial: false,                   // Not an inducer trial
                italic: run_rnd_italic,             // Whether the run is ITALIC or not
                trial_info: "Diagnostic trial",         // This is a diagnostic trial
                required_inducer_response_side: () => { // Required response side for the inducer task
                    if(rnd_diag_stimulus == run_stimuli[0])  { return rnd_inducer_response_sides[0] }
                    else                            { return rnd_inducer_response_sides[1] }
                },
                required_diag_response_side: () => {     // Required response side for the diagnostic task
                    if (run_rnd_italic) { return rnd_diagnostic_response_sides[0] } 
                    else                { return rnd_diagnostic_response_sides[1] } 
                },
            },
            on_finish: (data) => {
                // Require diagnostic response key 
                if(data.required_diag_response_side == response_sides[0]) 
                        { data.required_diag_response_key = allowed_responses[0] }
                else    { data.required_diag_response_key = allowed_responses[1] }
                
                // Correct response
                if(data.response == null){  data.correct = null  } 
                else {
                    // If response equals correct_response_key
                    if(data.required_diag_response_key == data.response)    { data.correct_response = true }
                    else                                                    { data.correct_response = false }
                }

                ////    GONGUENCEY      ////
                // If the response side match, then congruent
                if(required_diag_response_side == required_inducer_response_side){
                    data.congruency = true
                } else { 
                    data.congruency = false
                }
            }
        }
        timeline.push(diagnostic_run)

        ////     Feedback   ////
        timeline.push(too_slow_trial)
        timeline.push(wrong_response_trial)

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
            inducer_run: exp_block+1,                     // Inducer run number // +1 b/c
            inducer_trial: true,                    // This is an inducer trial
            trial_info: "Inducer trial",            // General trial info 
            required_inducer_response_side: () => { // Required inducer response side
                if(rnd_inducer_stimulus == run_stimuli[0])  { return rnd_inducer_response_sides[0] }
                else                                        { return rnd_inducer_response_sides[1] }
            },
        },
        on_finish: (data) => {
            // Find correct response key 
            if(data.required_inducer_response_side == response_sides[0]){
                data.required_inducer_response_key = allowed_responses[0] 
            } else { 
                data.required_inducer_response_key = allowed_responses[1] }

            // Correct response (according to the active trial)
            if(data.response == data.required_inducer_response_key) { data.correct_response = true }
            else                                                    { data.correct_response = false }

            console.log(jsPsych.data.getLastTrialData())
        }
    }
    timeline.push(inducer_task)


    ////     Feedback   ////
    // If participants responded to slow, give feedback
    timeline.push(too_slow_trial)
    timeline.push(wrong_response_trial)
        
    // Fixation IF another inducer round
    if( exp_block < number_of_inducers){
        timeline.push(long_fixation)
    }
}


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
                    type: 'html',
                    prompt: `You have now completed the central part of the experiment.<br>\n
                    To complete the study, please answer the following questions:`,
                },
                {
                    type: 'multi-choice',
                    prompt: `Gender`, 
                    name: 'gender', 
                    options: ['Female', 'Male', 'Other', 'I would rather not tell.'], 
                    required: true
                }, 
                {
                    type: 'text',
                    prompt: `What is you age? (enter answer into text box below)`, 
                    name: 'age', 
                    input_type: "number",   // Only allow number input
                    textbox_columns: 5,
                    required: true,
                },
            ],
            [
                {
                    type:"html",
                    prompt: `People are motivated to various degrees for various reasons. \n 
                    There is nothing wrong with being distracted and we kindly ask that you answer truthfully.` 
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
                    prompt: "Is there anything you want to add in relation to the distraction question above?",
                    name: 'distraction_feedback', 
                    textbox_columns: 50,
                    textbox_rows: 3,
                },
            ],
            [
                {
                    type:"html",
                    prompt: `Similarly to being distracted, people are motivated to different degrees for various reasons. \n
                    There is nothing wrong with low motivation and we kindly ask that you answer truthfully.` 
                },
                {
                    type: "likert",
                    prompt: `Click the number (it will turn gray) you believe reflect the degree of motivation you had during the experiment.`,
                    name: "motivation",
                    likert_scale_max: 7,
                    likert_scale_min_label: "Not at all motivated  -  ",
                    likert_scale_max_label: "  -  Very motivated",
                    required: true, 
                },
                {
                    type: "text",
                    prompt: "Is there anything you want to add in relation to the MOTIVATION question (above)?",
                    name: 'motivation_feedback',
                    textbox_columns: 50,
                    textbox_rows: 3,
                }
            ],
            [
                {
                    type: "text",
                    prompt: `Do you have any other comments, thoughts, or remarks in relation to the experiment? \n
                    (We appreciate your feedback!)`,
                    name: 'open_feedback',
                    textbox_columns: 100,
                    textbox_rows: 5,
                } 
            ]
        ]
    },
    data: { stimulus: "gender-age-distraction-motivation-feedback", trial_info: "Demographics, motivation, distraction and feedback " },
    on_finish: () => {
        data = jsPsych.data.getLastTrialData().values()[0]
        
        if(debug){console.log("Adding variables to data...")}

        ///////////// idk why we need this? // the only thing we need is ID, right=?
        jsPsych.data.get().addToAll({ id:                   ID });
        // jsPsych.data.get().addToAll({ age:                  age });
        // jsPsych.data.get().addToAll({ gender:               gender });

        // jsPsych.data.get().addToAll({ distraction:          data.response.distraction });
        // jsPsych.data.get().addToAll({ distraction_feedback: data.response.distraction_feedback });
        // jsPsych.data.get().addToAll({ motivation:           data.response.motivation });
        // jsPsych.data.get().addToAll({ motivation_feedback:  data.response.motivation_feedback });
        // jsPsych.data.get().addToAll({ open_feedback:        data.open_feedback });

        data.gender = data.response.gender
        data.age = data.response.age

        data.distraction = data.response.distraction
        data.distraction_feedback = data.response.distraction_feedback
        data.motivation = data.response.motivation
        data.motivation_feedback = data.response.motivation_feedback
        data.open_feedback = data.response.open_feedback
        // Add available as its own column
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
