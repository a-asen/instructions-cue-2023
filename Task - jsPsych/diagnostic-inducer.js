////////////////////////////////////////////////////////
// CHANGE THESE BEFORE EXPERIMENT!

const debug = true              // Show some console information
const skip_instructions = false  // Skip intro? (to test trials)
const save_local_data = true    // Save a local file (test analysis)

////////////////////////////////////////////////////////

// Connection to server?
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


////    Trials      ////
// Fixations
let short_fixation = {
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

// Feedback
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

// change background
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

//
//
//  Initialize 
//
//

// Experiment vars
var gender;
var age; 
var distraction;
var distraction_feedback;
var motivation;
var motivation_feedback;

// Technical variables
var refresh_rate;               // Can be nice to gather
var height_width_pre;           // 
var height_width_fullscreen;    //
var os_browser;     // not necessary, to debug ???

let rnd_inducer_colour = jsPsych.randomization.sampleWithReplacement(inducer_colours, 1)[0]

const jsPsych = initJsPsych({
    // experiment_width : 1280, 
        // w/e add later if necessary
    on_finish: function() {
        jsPsych.data.displayData() }
});
const timeline = []; // Timeline
timeline.push(set_background_colour_default) // To ensure the background colour is correct.


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
            return `We failed to parse your browser information... You may try to use a different browser`
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
        
        `<div style="font-size:${instruction_font_size}"> 

        <h3>About the experiment</h3>                
        In this study, you will have to remember two instructions at once \n




        mbe asked to remember two instructions which are to be implemented in the experiment. \n
        The first task that you will be presented with will <b>remain the same </b> throughout the experiment. \n
        The second task will change in the experiment and will only be executed once. \n
        Each new run will start with a new instruction.  \n
        Your task is to respond as fast and accurately as possible to the current task. \n
        Only one task will be executed during any one trial. This will be indicated by its colour.<br><br> \n 
        To response to any trial, you are asked to click either ${responseSides[0]} using ${allowed_responses[0]}, or \n
        ${responseSides[1]} using ${allowed_responses[1]}
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
        This experiment requires fullscreen and will be initiated when clicking the button below
        <br><br>
        </div>`,
        button_label: "Start the experiment",
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


// Unique ID
var ID = jsPsych.randomization.randomID(8);
if(debug){ console.log("ID = " + ID) }

///////////////////////////////////////////////////////
////////////            TASK               ////////////
// Shuffle stimuli list
let rnd_stimuli = jsPsych.randomization.shuffle(stimuli);  // Shuffle stimuli list
if(debug) { console.log(rnd_stimuli) }

// Generate diagnostic length ranges
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
    rnd_diagnostic_length.push(jsPsych.randomization.sampleWithReplacement(diagnostic_range, 1,  final_probability_list)[0]);
    // We randomize the length from "min" to "max" with the probabilities in "final_probability_list"
}
if(debug){ console.log("With these parameters we end up with an average length of: ",  
(diagnostic_min_length+diagnostic_max_length)/2*number_of_inducers) }
if(debug){ console.log("Diag lengths: ", rnd_diagnostic_length) }
if(debug){ console.log("Experiment length: ", rnd_diagnostic_length.reduce((val, a) => val + a)) } // sum the list


////////        Experiment run creation         ////////
////    DIAGNOSTIC TASK    ////
let diagnostic_task_instruction_description = {
    type: jsPsychHtmlKeyboardResponse,
    pages: () => {
        return [
            `<div style="font-size:${instruction_font_size}">
            Reminder: Respond to ${responseSides[0]} using ${allowed_responses[0]}, \n
            and ${responseSides[1]} using ${allowed_responses[1]}\n
            <br>
            We ask that you use one finger from each hand to the related response. 
            <br>
            <br>
            In the next screen you will see the instructions that <b> will not change </b> in the experiment. \n
            These are to be responded to when the target appears in black colour. \n 
            Thereafter, you will be presented with the other instructions. \n
            These trials are only to be answered when the target appears in ${rnd_inducer_colour}  \n 
            You will receive a maximum of 20 seconds reading each instruction (which is plenty of time) to remember the instructions.
            <br>
            <br>
            The experiment proceed quickly without any breaks, \n
            please ensure that you are in a calm environment where you are unlikely to be distracted/disrupted.      
            The experiment will take approximately 30 minutes.
            <br>
            The experiment start immediately when pressing SPACE.
            </div>
            `
        ],
    },
    choices: " ",
    post_trial_gap: 1500,
}
timeline.push(diagnostic_task_instruction_description)


let rnd_diagnostic_responseSides = jsPsych.randomization.shuffle(responseSides);    // randomize response side 
        // Could/would probably be a good idea to randomize italic/upright appearance as well, but w/e
// Only displayed once, instruction remains the same throughout the experiment
let diagnostic_task_instruction = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function(){   
        let a = 
        `<p style="font-size: ${general_font_size};"> If a target appears <i> italic </i> press ${rnd_diagnostic_responseSides[0]}`+
        `<p style="font-size: ${general_font_size};"> If a target appeas upright press ${rnd_diagnostic_responseSides[1]}`; 
        return a;
    }, 
    prompt: "Press any key to continue",
    choices: "ALL_KEYS", 
    trial_duration: instruction_delay,
    
    data: {
        stimulus: `If italic press ${rnd_diagnostic_responseSides[0]} || If upright press ${rnd_diagnostic_responseSides[1]}`,
        trial_info: "Diagnostic instructions",
    },
    on_finish: () => {console.log(jsPsych.data.getLastTrialData())}
    //post_trial_gap: 1500,
}
timeline.push(diagnostic_task_instruction)

let inducer_prompt={
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `In the next screen you will see the other instructions.`
}

// Here we create the experiment
for(let i = 0; i < number_of_inducers; i++){ // less than, since we start at 0
    // This first get the number of different inducers
    let run_stimuli = [rnd_stimuli[0], rnd_stimuli[1]] // Get new stimuli
    rnd_stimuli.splice(0,2) // Remove those stimuli from the list
    let run_diagnostic_length = rnd_diagnostic_length[i] // Get the curret diagnostic length
    let rnd_inducer_responseSides = jsPsych.randomization.shuffle(responseSides); // randomize where left/right appears
    
    ////        Inducer instruction         ////
    let inducer_instruction = { 
        type: jsPsychHtmlKeyboardResponse,
        stimulus: () => {   
            return  `<p style="font-size: ${general_font_size};"> If ${run_stimuli[0]} press ${rnd_inducer_responseSides[0]}`+
                    `<p style="font-size: ${general_font_size};"> If ${run_stimuli[1]} press ${rnd_inducer_responseSides[1]}`; 
        }, 
        prompt: "Press any key to continue",
        choices: "ALL_KEYS", 
        data: {
            inducer_run: i,                 // Inducer run number
            stimulus: `If ${run_stimuli[0]} press ${rnd_inducer_responseSides[0]} || If ${run_stimuli[1]} press ${rnd_inducer_responseSides[1]}`,
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
    for(let ii = 0; ii < run_diagnostic_length; ii++){
        let run_rnd_stimulus = jsPsych.randomization.sampleWithReplacement(run_stimuli, 1)[0]
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
                trial_info: "Diagnostic trial", // General trial info
                correct_response_side: () => {  // The correct response side (if is italic, then resp side 0)
                    if (run_rnd_italic == true) { return rnd_diagnostic_responseSides[0] } 
                    else                        { return rnd_diagnostic_responseSides[1] } },
            },
            on_finish: (data) => {
                // Set the "correct_response_key"
                if(data.correct_response_side == responseSides[0]){
                    data.correct_response_key = allowed_responses[0]
                } else { 
                    data.correct_response_key = allowed_responses[1]}

                // Only if there is a response do we check whether it is correct. 
                if(data.response == null){
                    data.correct = null;
                } else {
                    // If response equals correct_response_key
                    if(data.correct_response_key == data.response)  { data.correct = true }
                    else                                            { data.correct = false }
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

        ////     Feedback   ////
        // If participants responded to slow, give feedback
        let too_slow_trial = {
            timeline: [set_background_colour_wrong_response, too_slow, set_background_colour_default],
            conditional_function: () => {
                let data = jsPsych.data.get().last(1).values()[0];
                if(data.response === null)  { return true } 
                else                        { return false }
            }
        }
        timeline.push(too_slow_trial)
        
        // If participants responded incorrectly, give feedback
        let wrong_response_trial = {
            timeline: [set_background_colour_wrong_response, wrong_response , set_background_colour_default],
            conditional_function: () => {
                let data = jsPsych.data.get().last(1).values()[0]
                if( data.correct == false)  { return true } 
                else                        { return false }
            }
        }
        timeline.push(wrong_response_trial)

        timeline.push(short_fixation)
    }
    ////////////////////////////////////
    ////        INDUCER TASK        ////
    ////////////////////////////////////
    let rnd_inducer_stimulus = jsPsych.randomization.sampleWithReplacement(run_stimuli, 1)[0]

    let inducer_task = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: () => { return `<p style="font-size: ${general_font_size}; color:${rnd_inducer_colour}">${rnd_inducer_stimulus}` },
        choices: allowed_responses,
        trial_duration: trial_duration,
        data: {
            stimulus: rnd_inducer_stimulus,     // stimulus
            inducer_run: i,                     // Inducer run 
            inducer_trial: true,                // Inducer trial
            trial_info: "Inducer trial",        // General trial info
            correct_response_side: () => {      // Get response side, according to run_stimuli
                if(rnd_inducer_stimulus == run_stimuli[0]){ 
                    return rnd_inducer_responseSides[0] 
                } else { 
                    return rnd_diagnostic_responseSides[1]} },
        },
        on_finish: (data) => {
            // Find correct response key 
            if(data.correct_response_side == responseSides[0]){
                data.correct_response_key = allowed_responses[0] 
            } else { 
                data.correct_response_key = allowed_responses[1] }

            // Test whether the response is correct
            if(data.response == data.correct_response_key)  { data.correct = true }
            else                                            { data.correct = false }
        }
    }
    timeline.push(inducer_task)

    ////     Feedback   ////
    // If participants responded to slow, give feedback
    let too_slow_trial = {
        timeline: [set_background_colour_wrong_response, too_slow, set_background_colour_default],
        conditional_function: () => {
            let data = jsPsych.data.get().last(1).values()[0];
            if(data.response === null)  { return true } 
            else                        { return false }
        }
    }
    timeline.push(too_slow_trial)

    // If participants responded incorrectly, give feedback
    let wrong_response_trial = {
        timeline: [set_background_colour_wrong_response, wrong_response , set_background_colour_default],
        conditional_function: () => {
            let data = jsPsych.data.get().last(1).values()[0];
            if( data.correct == false)  { return true } 
            else                        { return false }
        }
    }
    timeline.push(wrong_response_trial)
        
    let inducer_fixation = {
        timeline: [long_fixation],
        conditional_function: () => {
            if(i < number_of_inducers)  { return true } 
            else                        { return false }
        }
    }
    timeline.push(inducer_fixation)
}


// For the final question - demographics and feedback - it is too much effort (from my investigation)
// to change the background colour of the trial. Hence just change it to white...

const white_bk = {
    type: jsPsychCallFunction,
    func: () => { changeBackground("white") }
} 
timeline.push(white_bk)


////        Demographics        ////
const demographics = {
    type: jsPsychSurvey,
    button_label_finish: "Next",
    required_question_label: "*",
    required_error: "Please check whether you responded to all the questions.",
    pages: [
        [
            {
                type: 'html',
                prompt: `You have now completed the central part of the experiment.<br>` +
                `To complete the study, please answer the following questions:`,
            },
            {
                type: 'multi-choice',
                prompt: "Gender", 
                name: 'gender', 
                options: ['Female', 'Male', 'Other', 'I would rather not tell.'], 
                required: true
            }, 
            {
                type: 'text',
                prompt: "What is you age? (enter answer into text box below)", 
                name: 'age', 
                input_type: "number",
                textbox_columns: 5,
                required: true,
            },
        ]
    ],
    data: { stimulus: "Demographics", trial_info: "Demographics" }, 
    on_finish: () => {
        data = jsPsych.data.getLastTrialData().values()[0]

        gender = data.response.gender 
        age = data.response.age
    }
}
timeline.push(demographics)

const experiment_feedback  = {
    type: jsPsychSurvey,
    button_label_finish: "Next",
    required_question_label: "*",
    required_error: "Please check whether you responded to all the questions.",
    pages: 
    [
        [
            {
                type:"html",
                prompt: `People are motivated and distracted to different degrees for varying reasons. \n
                There is nothing wrong with a low motivation or being distracted and we kindly ask that you answer honestly.` 
            },
            {
                type: "likert",
                prompt: "How distracted were you during the task?",
                name: "distraction", 
                likert_scale_max: 7,
                likert_scale_min_label: "Not at all distracted   ",
                likert_scale_max_label: "   Ver| distracted",
                required: true, 
            },
            {
                type: "text",
                prompt: "Is there anything you want to add in relation to the DISTRACTION question (above)?",
                name: 'distraction_feedback', 
                textbox_columns: 50,
                textbox_rows: 3,
            },
            {
                type: "likert",
                prompt: "How motivated were you to perform well on the task?",
                name: "motivation",
                likert_scale_max: 7,
                likert_scale_min_label: "Not at all motivated   ",
                likert_scale_max_label: "   Very motivated",
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
                prompt: "Do you have any other comments in relation to the experiment? Then you can describe them here.",
                name: 'open_feedback',
                textbox_columns: 100,
                textbox_rows: 5,
            } 
        ]
    ],
    data: {stimulus: "experiment_feedback", trial_info: "experiment_feedback"},
    on_finish: () => {
        data = jsPsych.data.getLastTrialData().values()[0]
        
        if(debug){console.log("Adding variables to data...")}
        data = jsPsych.data.getLastTrialData().values()[0]

        ///////////// idk why we need this? // the only thing we need is ID, right=?
        jsPsych.data.get().addToAll({ id:                   ID });
        jsPsych.data.get().addToAll({ age:                  age });
        jsPsych.data.get().addToAll({ gender:               gender });

        jsPsych.data.get().addToAll({ distraction:          data.response.distraction });
        jsPsych.data.get().addToAll({ distraction_feedback: data.response.distraction_feedback });
        jsPsych.data.get().addToAll({ motivation:           data.response.motivation });
        jsPsych.data.get().addToAll({ motivation_feedback:  data.response.motivation_feedback });
        jsPsych.data.get().addToAll({ open_feedback:        data.open_feedback });

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
