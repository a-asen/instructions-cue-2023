////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// CHANGE THESE BEFORE EXPERIMENT!
const debug = false                  // Show debug information?
const skip_instructions = false     // Skip intro? 
const skip_practice = false         // Skip practice? 
const save_local_data = false        // Save local file? 

const study_name = "exp2" // add to filename 
const redirect_link = "https://app.prolific.com/submissions/complete?cc=C4S441ES" // (CUE TASK)


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
const inducer_colours      = ["red", "yellow", "blue"]      // Inducer colour randomize between participants (if more than 1)
const inducer_colour_name  = ["red", "yellow", "blue"]
    // This is also what is DISPLAYED (i.e., text) to participants. Should therefore be a readable name. 

const number_of_inducers = 24       // Number of inducers 


////    Diagnostic parameters   ////
const max_diagnostic_trials = 240     // Overall max run length

// pre-cue: 
const diagnostic_min_length = 4         // Min run length
const diagnostic_max_length = 12        // Max run length

const pre_cue_force_equal_italic = true    // should the pre-cue runs be force to show an equal amount of 
const pre_cue_force_equal_stimuli = true   // show an equal amout of "left&right" stimuli
    // both of these need to be true IF an equal amount of congruency should be presented in the experiment. 
// post-cue:
const cue_min_length = 0
const cue_max_length = 4
const post_diagnostic_prop = .3 
    // The proportion of the overall trials that should be "post-cue".
const tot_post_cue_len = max_diagnostic_trials * post_diagnostic_prop

const post_cue_force_equal_italic = true
const post_cue_force_equal_stimuli = true


////    Inducer CUE      ////
const cue_size = 70                     // appearance of the cue (in px)
const cue_duration = 1250               // How long is the pre-cue present for? 


////    Practice parameters     ////
const prac_diagnostic_rounds = 16                    // Number of diagnostic practice rounds
    // Set to 0 if no practice rounds should occur.
const prac_inducer_rounds = 6
    // NB: Max 64 rounds of new stimuli (prac_inducer_rounds + number_of_inducer > 64)
const prac_cue_rounds = 16
const prac_post_cue_num = 3         // Should equal predictable length if true. 


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
        jsPsych.data.displayData() 
    }
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
function inducer_instruction_FNC(run_stimuli, exp_block, trial_info){
    /**
     * @param {list} run_stimuli    List of current run stimuli
     * @param {integer} exp_block   Current block number
     * @param {string} trial_info   Trial description 
     */

    let inducer_instruction = { 
        type: jsPsychHtmlKeyboardResponse,
        stimulus: () => {   
            return  `<p style="font-size: ${general_font_size}"> If <span style="color: ${rnd_inducer_colour}">${run_stimuli[0]}</span> press ${rnd_response_sides[0]}`+
                    `<p style="font-size: ${general_font_size}"> If <span style="color: ${rnd_inducer_colour}">${run_stimuli[1]}</span> press ${rnd_response_sides[1]}`; 
        }, 
        prompt: "Put your left index fingers on the F and your right index finger on the J key. <br> When you are ready, press SPACE to continue.",
        choices: " ", 
        data: {
            inducer_run: exp_block,         // Inducer run number
            stimulus: `If ${run_stimuli[0]} press ${rnd_response_sides[0]} | If ${run_stimuli[1]} press ${rnd_response_sides[1]}`,
            trial_info: trial_info
        },
        trial_duration: instruction_delay, 
        on_finish: (data) => { 
            if(debug){ console.log(data) } 
        }
    }
    // Timeline 
    timeline.push(inducer_instruction)
    timeline.push(short_fixation)
}

function diagnostic_FNC(run_diagnostic_length, run_stimuli, exp_block, cue_diag_num, trial_info, prac_equal=false, deadline=true, pre_cue_equal_italic=null, post_cue_equal_italic=null, pre_cue_equal_stimuli=null, post_cue_equal_stimuli=null){
    /**
     * @param {list} run_diagnostic_length  Length of the current diagnostic length
     * @param {list} run_stimuli            Run stimuli (list of two stimuli)
     * @param {string} inducer_round        Inducer block number 
     * @param {integer} cue_diag_num        Apperance of the cue relative to the *end* of the run 
     * @param {string} trial_info           General trial information 
     * @param {boolean} prac_equal         Force an equal number of right/left (combine with equal_list to specific the responses)
     * @param {boolean} deadline            Should the trials have a deadline? 
     * @param {list} pre_cue_equal_italic     Supply a predetermined list of diagnostic responses (e.g., [0,1,1,0])
     * @param {list} post_cue_equal_italic    Supply a predetermined list of diagnostic responses (e.g., [0,1,1,0])
     * @param {list} pre_cue_equal_stimuli     Supply a predetermined list of diagnostic responses (e.g., [0,1,1,0])
     * @param {list} post_cue_equal_stimuli    Supply a predetermined list of diagnostic responses (e.g., [0,1,1,0])
     * 
     * @returns {null}                      Pushes the generated trials to the "timeline"
     */
    
    
    var rnd_prac_diag;
    var pre_cue_num = 0;
    var post_cue_num = 0; 

    
    // Randomly decide whether the stimulus should appear in italic or not.
    if(prac_equal){
        // If only force equal: 
        // Generate array with equal italic/upright trials based on the supplied run_diagnostic_length 
        let prac_dia = Array(  Array(Math.floor(run_diagnostic_length/2)).fill(1) ,  Array( Math.ceil(run_diagnostic_length/2) ).fill(0)  ).flat()
        rnd_prac_diag = jsPsych.randomization.shuffle(prac_dia) // Randomize the equal italic/upright trials
        if(debug){ console.log("equal diag:", rnd_prac_diag) }
    } 
    
    ////    Generate diagnostic trials  ////
    for(let exp_diag = 0; exp_diag < run_diagnostic_length; exp_diag++){
        // For each trial...
        
        // Check if is post cue
        let is_post_cue = exp_diag >= run_diagnostic_length - cue_diag_num
        
        let rnd_diag_stimulus
        let run_rnd_italic;

        
        // SELECT the current trial STIMULUS
        // Either sample it randomly, or get it from the predetermined lists that is supplied. 
        if(!is_post_cue && pre_cue_equal_stimuli == null || is_post_cue && post_cue_equal_stimuli == null){
            rnd_diag_stimulus = jsPsych.randomization.sampleWithReplacement(run_stimuli, 1)[0]
        } else if(!is_post_cue && pre_cue_equal_stimuli != null){
            rnd_diag_stimulus = run_stimuli[pre_cue_equal_stimuli[pre_cue_num]]
        } else if(is_post_cue && post_cue_equal_stimuli != null){
            rnd_diag_stimulus = run_stimuli[post_cue_equal_stimuli[post_cue_num]]
        }

        // SELECT the current trial ITALIC
        // Either randomly generate (as in practice) or sample; OR
        // Select from the predetermined lists that is supplied.
        if(prac_equal){
            if(rnd_prac_diag[exp_diag] == 1){
                run_rnd_italic = true
            } else {
                run_rnd_italic = false
            }
        } else if(!prac_equal){ // if not practice
            if(pre_cue_equal_italic==null && post_cue_equal_italic==null){ 
                console.log("WARNING \nWARNING \nWARNING \nWARNING \nForced_equal is true, but no list of responses are supplied\nWARNING\nWARNING\nWARNING\nWARNING")
            } else if(!is_post_cue && pre_cue_equal_italic == null || is_post_cue && post_cue_equal_italic == null){
                run_rnd_italic = jsPsych.randomization.sampleWithReplacement([true,false], 1, run_italic_bias)[0]
                if(debug){ console.log("Randomly chosen") }
            } else if(!is_post_cue && pre_cue_equal_italic != null){
                run_rnd_italic = pre_cue_equal_italic[pre_cue_num]
            } else if(is_post_cue && post_cue_equal_italic != null) {
                run_rnd_italic = post_cue_equal_italic[post_cue_num]
            }
        }
        
        if(run_rnd_italic==0)       { run_rnd_italic=false } 
        else if (run_rnd_italic==1) { run_rnd_italic=true }

        // increment cue num
        is_post_cue ? post_cue_num++ : pre_cue_num++
        
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
            trial_duration: () => { 
                if(deadline){ 
                    return trial_duration
                } else {
                    return null
                }
            },
            data: {
                stimulus: rnd_diag_stimulus,            // Trial stimulus
                inducer_run: exp_block,                 // Inducer run number (i.e., block)
                diagnostic_run: exp_diag,               // Diagnostic run number 
                cue_num: run_diagnostic_length - cue_diag_num, // On which trial will the cue appear? 
                post_cue: is_post_cue,                  // Is the current trial after the cue? 
                inducer_trial: false,                       // Not an inducer trial
                italic: run_rnd_italic,                 // Is the current trial an italic type? 
                trial_info: trial_info,                 // Trial description
                forced_equal_run: () => {                    // Is the current trial force to be equal in some way? 
                    if(prac_equal){
                        return "prac equal"
                    } else if(post_cue_equal_italic != null && pre_cue_equal_italic != null){
                        return "both pre & post"
                    } else if(post_cue_equal_italic != null ){
                        return "only post"
                    } else if(pre_cue_equal_italic != null){
                        return "only pre"
                    }
                },
                correct_inducer_response_side: () => {  // GET the correct inducer response side (in relation to the select stimulus)
                    if( rnd_diag_stimulus == run_stimuli[0] ) { return rnd_response_sides[0] }
                    else                                      { return rnd_response_sides[1] }
                },
                correct_diag_response_side: () => {     // GET the correct diagnostic response side (according to the italic/upright) 
                    if (run_rnd_italic) { return rnd_response_sides[0] } 
                    else                { return rnd_response_sides[1] } 
                },
            },
            on_finish: (data) => {
                // SET the correct response key
                if(data.correct_diag_response_side == response_sides[0]) 
                        { data.correct_response_key = allowed_responses[0] }
                else    { data.correct_response_key = allowed_responses[1] }
                
                // CHECK whether the response equal the correct response ke
                if(data.response == null){  data.correct_response = NaN  } 
                else {
                    if(data.correct_response_key == data.response)    { data.correct_response = 1 }
                    else                                              { data.correct_response = 0 }
                }

                // CHECK whether the current response side is congruent
                if(data.correct_diag_response_side == data.correct_inducer_response_side){
                    data.congruent = true
                } else { 
                    data.congruent = false
                }

                if(debug){ console.log(data) } // DEBUG
            }
        }
        
        ////        Timeline         ////
        timeline.push(diagnostic_run)       // PUSH the current trial
    
        timeline.push(too_slow_trial)       // PUSH feedback: SLOW
        timeline.push(wrong_response_trial) // PUSH feedback: WRONG

        timeline.push(short_fixation)       // PUSH fixation

                                            // PUSH cue 
        
        if(exp_diag == run_diagnostic_length - cue_diag_num - 1 ){
            timeline.push( cue_trial_f(exp_block, exp_diag) ) 

            timeline.push(short_fixation)   // PUSH fixation
        }
    }
}

function inducer_FNC(run_stimuli, exp_block, trial_info, force_resp_side = null, deadline = true){
    /**
     * @param {list} run_stimuli            List of the current run stimuli
     * @param {integer} exp_block           Current block number
     * @param {string} trial_info           Trial description
     * @param {integer} force_resp_side     List of forced response sides (e.g., [0,1,0,0,1,1])
     * @param {boolean} deadline            Will the run have a deadline? 
     */

    var rnd_inducer_stimulus;
    var force_equal;
    
    // GET inducer stimulus
    if(force_resp_side != null){
        rnd_inducer_stimulus = run_stimuli[force_resp_side]
        force_equal = true
    } else {
        // Randomly get a stimulus for the inducer trial
        rnd_inducer_stimulus = jsPsych.randomization.sampleWithReplacement(run_stimuli, 1)[0]
        force_equal = false
    }

    // Create inducer trial: 
    let inducer_task = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: () => { return `<p style="font-size: ${general_font_size}; color:${rnd_inducer_colour}">${rnd_inducer_stimulus}` },
        choices: allowed_responses,
        trial_duration: () => {
            if(deadline){
                return trial_duration
            } else {
                return null
            }
        },
        data: {
            stimulus: rnd_inducer_stimulus,         // Trial stimulus
            inducer_run: exp_block,                 // Inducer run number
            inducer_trial: true,                        // Inducer
            trial_info: trial_info,                 // General trial info 
            force_equal: force_equal,               // Is the current trial force to be equal in some way?     
            correct_indu_response_side: () => {     // Get the correct response side (according to the stimulus) 
                if (rnd_inducer_stimulus == run_stimuli[0]) { return rnd_response_sides[0] } 
                else                                        { return rnd_response_sides[1] } 
            },
            
        },
        on_finish: (data) => {
            // SET the correct response key
            if(data.correct_indu_response_side == response_sides[0]) 
                    { data.correct_response_key = allowed_responses[0] }
            else    { data.correct_response_key = allowed_responses[1] }
            
            // CHECK the response according to the correct Associate correct response from correct response key
            if(data.response == null){  data.correct_response = NaN  } 
            else {
                if(data.correct_response_key == data.response)    { data.correct_response = 1 }
                else                                              { data.correct_response = 0 }
            }
            if(debug){ console.log(data) }  // DEBUG
        }
    }
    
    timeline.push( inducer_task )           // PUSH the current trial

    timeline.push(too_slow_trial)           // PUSH feedback: SLOW
    timeline.push(wrong_response_trial)     // PUSH feedbacl: WRONG

    timeline.push( short_fixation )         // PUSH fixation 
}

// Stimuli equal: 
function force_stim_equal(array){
    let total_1 = array.filter(x => x==1).length
    let total_0 = array.filter(x => x==0).length

    let arr1 =  Array( Math.floor( array.length/2/2 ) ).fill(0)
    let arr2 =  Array( Math.ceil(  array.length/2/2 ) ).fill(1)
    let arr4 =  Array( Math.floor( array.length/2/2 ) ).fill(1)
    let arr3 =  Array( Math.ceil(  array.length/2/2 ) ).fill(0)
    let max_list = [[arr1,arr2],[arr3,arr4]]
    
    var list = []

    for(let i = 0; i < array.length; i++){
        ita_or_not = array[i] == 1 ? 1 : 0
        let cond = true
        let count = 0;
        while(cond){
            // Randomly sample left/right response to the italic/italic trial
            let left_or_right = jsPsych.randomization.randomInt(0,1)

            if(max_list[ita_or_not][left_or_right].length > 0 ){
                if(ita_or_not == 1){ total_1-- } else if (ita_or_not==0) { total_0-- }
                if(debug){  
                    // console.log("total1:",  total_1, "total0:", total_0)
                }
                list.push( max_list[ita_or_not][left_or_right][0] ) // Add stimulus response side 
                max_list[ita_or_not][left_or_right].splice(0,1) // remove from pre-determined-list
                cond = false
            }

            count++
            if(count>500){ 
                console.log("\nWARNING\nWARNING\nWARNING\nWARNING\n COUNT ABOVE 500 \nWARNING\nWARNING\nWARNING\nWARNING")
                cond = false
            }
        }
    }
    if(debug){ console.log( "Controlled random stimuli presentation:", list) }
    
    return list
}

////////////////////////////////////////////////////////////////////////////////////////////
////                        General experiment things                                   ////
////////////////////////////////////////////////////////////////////////////////////////////


//// General ////
// Unique ID
var ID = jsPsych.randomization.randomID(8);
if(debug){ console.log("ID = " + ID) }

// Shuffle left/right for each participants (remains the same throughout)
let rnd_response_sides = jsPsych.randomization.shuffle(response_sides); 


// Shuffle stimuli list
let rnd_stimuli = jsPsych.randomization.shuffle(stimuli);  // Shuffle stimuli list
if(debug) { console.log("Randomized stimuli list:", rnd_stimuli) }

// Inducer colour
let rnd_indu_col = jsPsych.randomization.sampleWithReplacement([0,1,2],1)[0]
let rnd_inducer_colour = inducer_colours[rnd_indu_col]
let rnd_inducer_colour_name = inducer_colour_name[rnd_indu_col]
if(debug){ console.log("Inducer colour: ", rnd_inducer_colour) }


////         Diagnostic stuff    ////
// Generate diagnostic length range
let diagnostic_range = Array.from(Array(diagnostic_max_length-diagnostic_min_length+1), (x, i) => i + diagnostic_min_length) 
if(debug){ console.log("The range of diagnostic lengths: ", diagnostic_range) }

let rnd_diagnostic_length = [];
// We randomy sample "number_of_inducer" times from the "diagnostic_range"
for(let i = 0; i < number_of_inducers; i++){
    rnd_diagnostic_length.push(jsPsych.randomization.sampleWithReplacement(diagnostic_range, 1)[0]);
}
if(debug){ console.log("Random diagnostic lengths list:", rnd_diagnostic_length) }

var adj_max_diagnostic_trials = max_diagnostic_trials - tot_post_cue_len
if(debug){
    console.log("Post-cue length of:", tot_post_cue_len, "Pre-cue lenght of:", adj_max_diagnostic_trials)
}

// Sum total diagnostic trials
const sum_diags = rnd_diagnostic_length.reduce((list, i) => list + i, 0);
if(debug){ console.log("Total diagnostic trials:", sum_diags) }

// If the sum is more or less than the specified value, adjust accordingly
if(sum_diags != adj_max_diagnostic_trials){
    let operation = (sum_diags < adj_max_diagnostic_trials) ? "+" : (sum_diags > adj_max_diagnostic_trials) ? "-" : "";
    let diff = Math.abs(sum_diags - adj_max_diagnostic_trials)
    var cond;
    var break_count = 0;

    if(debug){ console.log("Current operation", operation, "with a differences of", diff) }

    while(diff > 0 & break_count < 1000){
        if(debug){ console.log("Pre-cue diff: ", diff) }
        // Randomly sample a location
        let loc = Math.floor(Math.random() * rnd_diagnostic_length.length)
        switch(operation){ // Test that the location value does not equal min/max values
            case "+":
                var cond = rnd_diagnostic_length[loc] != diagnostic_max_length
                var calc_oper = 1
                break;
            case "-":
                var cond = rnd_diagnostic_length[loc] != diagnostic_min_length 
                var calc_oper = -1
                break;
        }

        if(cond){ //IF NOT EQUAL: Add one to the location and remove one to diff
            if(debug){ console.log("At location", loc, " -> Adjusting:",  rnd_diagnostic_length[loc], "to", rnd_diagnostic_length[loc] + calc_oper) }
            rnd_diagnostic_length[loc] += calc_oper
            diff--;
        } else { break_count++ }

        if(break_count >= 1000){
            console.log("WARNING\nWARNING\nWARNING\nCOULD NOT EQUALIZE DIAGNOSTIC LENGTHS, CHECK PARAMETERS\nWARNING\nWARNING\nWARNING") 
            console.log("@ pre-cue array")
        }
    }

    if(debug){ 
        console.log("Fixed pre-cue diagnostic lengths:", rnd_diagnostic_length,
        ". A total of:", rnd_diagnostic_length.reduce((list, l) => list + l) ) }
}

////        CUE          ///
// Filter colours not used for the inducer:
let r_col = inducer_colours.filter(item => item !== rnd_inducer_colour);
let r_col_name = inducer_colour_name.filter(item => item !== rnd_inducer_colour_name);
// Sample a colour from the remaining colours:
let rnd_cue_n = jsPsych.randomization.sampleWithReplacement([0,1], 1)[0]
let rnd_cue_col = r_col[rnd_cue_n]
let rnd_cue_col_n = r_col_name[rnd_cue_n]

if(debug) { console.log("Inducer colour: ", rnd_inducer_colour, " |  Cue colour: ", rnd_cue_col)}

// Cue stimulus
// Randomly sample a number between 0 and 2.
const rnd_cue_picker = jsPsych.randomization.sampleWithReplacement([0,1,2], 1)[0]
// Then select the cue & the respective name:
const rnd_cue_stimulus = [draw_circle,draw_square,draw_triangle][rnd_cue_picker]
const cue_stimulus_name = ["Circle", "Square", "Triangle"][rnd_cue_picker]

if(debug){ console.log("Random cue stimulus:", cue_stimulus_name) }
    
// Pre-inducer cue trial length
var cue_array = Array.from(Array(cue_max_length - cue_min_length+1), (x, i) => i + cue_min_length) 
if(debug){ console.log("Cue num array:", cue_array) }

var rnd_cue_array=[];
for(let i = 0; i < number_of_inducers; i++){
    rnd_cue_array.push(jsPsych.randomization.sampleWithReplacement(cue_array, 1)[0]);
}
if(debug){ console.log("Random post-cue run list:", rnd_cue_array) }

// Sum total diagnostic trials
const sum_rnd_cue_array = rnd_cue_array.reduce((list, i) => list + i, 0);
if(debug){ console.log("Total post-cue diag trials:", sum_rnd_cue_array) }

// If different than max length, adjust and test for fit:
if(sum_rnd_cue_array != tot_post_cue_len){
    let operation = (sum_rnd_cue_array < tot_post_cue_len) ? "+" : "-";
    let diff = Math.abs(sum_rnd_cue_array - tot_post_cue_len)
    // Difference between the set number of trials and the calculated number

    var cond;
    let break_count=0

    if(debug){ console.log("Sufficient cue-length is missing. Cue length operation is", operation, "with a differences of", diff) }
    
    // Dont need a break here, because it will always finish. 
    while( diff > 0 & break_count < 1000 ){
        if(debug){ console.log("Post-cue diff of: ", diff) }
        // Randomly sample a location
        let loc = Math.floor( Math.random() * rnd_cue_array.length )

        // Test the sampled location length to not exceed the max length. 
        switch(operation){ 
            case "+":
                var cond = rnd_cue_array[loc] != cue_max_length
                var calc_oper = 1
                break;
            case "-":	
                var cond = rnd_cue_array[loc] != cue_min_length
                var calc_oper = -1
                break;
        }
        // if(debug){ console.log("Cue at threshold:", cond) }
        // Test whether we can increase/decrease, if not skip. 
        if(cond){ 
            rnd_cue_array[loc] += calc_oper 
            if(debug){ 
                console.log( 
                    "At location:", loc,"-> ", "Adjusting:", rnd_cue_array[loc], "to", rnd_cue_array[loc], 
                    "Pre-cue length:",   rnd_diagnostic_length[loc],
                    "Post-cue length:", rnd_cue_array[loc] ) 
            }
            diff--;
        } else { break_count++ }

        if(break_count>=1000){
            console.log("WARNING\nWARNING\nWARNING\nCOULD NOT EQUALIZE DIAGNOSTIC LENGTHS, CHECK PARAMETERS\nWARNING\nWARNING\nWARNING") 
            console.log("@ cue array")
        }
    } 

    if(debug){ console.log("Fixed post-cue diagnostic lengths:", rnd_cue_array) }
}

////    Force equal ?           ////
// Pre-cue trials 
if(pre_cue_force_equal_italic){
    let force_cue_resp_side = Array(  Array(Math.floor((adj_max_diagnostic_trials)/2)).fill(1) ,  
    Array( Math.ceil((adj_max_diagnostic_trials)/2) ).fill(0)  ).flat()
    // Generate equal left/right inducer response trials
    var rnd_pre_cue_resp_side_italic = jsPsych.randomization.shuffle(force_cue_resp_side)
    if(debug){ 
        console.log("Pre-Cue force resp side:", rnd_pre_cue_resp_side_italic)
    }
}

// Post-cue trials
if(post_cue_force_equal_italic){
    let force_cue_resp_side = Array(  Array(Math.floor(tot_post_cue_len/2)).fill(1) ,  Array( Math.ceil(tot_post_cue_len/2) ).fill(0)  ).flat()
    // Generate equal left/right inducer response trials
    var rnd_post_cue_resp_side_italic = jsPsych.randomization.shuffle(force_cue_resp_side)
    if(debug){ console.log("Post-cue force resp side:", rnd_post_cue_resp_side_italic)}
}

var total_diag_in_each_run =[];
for(let i = 0; i<number_of_inducers; i++){
    total_diag_in_each_run.push(rnd_diagnostic_length[i] + rnd_cue_array[i])
}
if(debug){ console.log("Diagnostic summary:", total_diag_in_each_run)}


if(pre_cue_force_equal_stimuli){
    var pre_cue_stimuli_force_resp = force_stim_equal(rnd_pre_cue_resp_side_italic)
}

if(post_cue_force_equal_stimuli){
    var post_cue_stimuli_force_resp = force_stim_equal(rnd_post_cue_resp_side_italic)
}

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

let run_stimuli;

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
    },  
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

        In this (experimental) study, we will ask you to complete two categorization tasks in parallel.
        <br>
        One of these tasks will vary as the study progresses, while the other will remain constant.
        <br>
        Your role is to respond appropriately to the task that is currently relevant, as determined by the given situation.
        <br><br>

        We acknowledge that the task may present some challenges initially, <br>
        but please be assured that feedback will be provided to aid your progress. <br>
        The entire task will take approximately 20 minutes to complete. <br>
        If you're ready for a challenge and willing to test your limits, we encourage you to participate. <br>
        Give it your best effort!
        <br><br>

        The study is conducted by Steffen Aasen (Master student) and \n
        Torsten Martiny-Huenger (Supervisor) from the UiT – The Arctic University of Norway.
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
        All responses to this experiment are collected and stored anonymously. <br>
        That means they cannot be traced back to you. <br>
        The anonymous storage means we cannot provide participants with their responses upon request. <br>
        You can quit the experiment without giving a reason by closing the browser tab. <br>
        No data will be stored in that case.
        <br><br> 
        The data will be used for scientific purposes. <br> 
        If you agree to these terms and conditions and want to participate, click NEXT. <br>
        </div>`,

        ]
    },
    show_clickable_nav: ["Next"],
    data: { 
        stimulus: "The experiment and consent", 
        trial_info: "The experiment and consent",
    },
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
        <br><br>
        This experiment requires full screen, click the button below to enable full screen.
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
            In this task, you will be shown 3-letter non-words. <br>
            Each non-word requires a response: either left or right.
            <br><br>
            A left response should be made by pressing the F key.
            <br>
            A right response should be made by pressing the J key.
            <br><br>
            The task includes two types of instructions:
            <br>    
            One instruction remains constant throughout the task and applies to non-words presented in black.
            <br>
            The other instruction changes throughout the task and applies to non-words presented in 
            <b><span style="color:${rnd_inducer_colour}"> ${rnd_inducer_colour_name.toLowerCase()}</span></b>.
            
            <br><br>
            </div> `,

            // About the first task
            `<div style="font-size:${instruction_font_size}">

            <h3> Consistent Instruction Screen </h3>

            The instruction that remains the same throughout the task (connected to non-words in black) <br>
            will be presented on the next screen.
            <br><br>

            These instructions, along with the relationship to the 3-letter non-words, <br>
            will be displayed for up to 20 seconds.
            <br><br>

            A few practice trials will follow.
            <br><br>

            Begin the practice by clicking NEXT.
            <br>
            </div>`,
        ]
    },
    allow_keys: false, 
    show_clickable_nav: true,
    post_trial_gap: 1500,
    data: { 
        stimulus: "Instructions", 
        trial_info: "Basic overview explanation",
    },
    on_finish: (data) => {
        if(debug){  console.log(data) }
    }
}
if(!skip_instructions){ timeline.push(diagnostic_task_instruction_description) }

// Diagnostic instructions
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
        exp_parameters: {       // save experiment params 
            // general 
            debug: debug,
            skip_instructions: skip_instructions,
            skip_practice: skip_practice,
            save_local_data: save_local_data,
            studu_name: study_name,
            default_background_colour: default_background_colour,
            wrong_response_colour: wrong_response_colour,
            instruction_delay: instruction_delay,
            trial_duration: trial_duration,
            short_fixation: short_fixation_delay,
            long_fixation: long_fixation_delay,
            wrong_response_delay: wrong_response_delay,
            too_slow_delay: too_slow_delay,
            instruction_font_size: instruction_font_size,
            general_font_size: general_font_size,
            fixation_size: fixation_size,
            allowed_responses: allowed_responses,
            // cue
            cue_min_length: cue_min_length,
            cue_max_length: cue_max_length,
            tot_post_cue_len: tot_post_cue_len,
            cue_colour: rnd_cue_col,
            cue_shape: cue_stimulus_name,
            cue_size: cue_size,
            cue_duration: cue_duration, 
            avg_number_of_cues: tot_post_cue_len/number_of_inducers,

            // inducer & diag
            inducer_colour: rnd_inducer_colour, 
            number_of_inducers: number_of_inducers,
            pre_cue_italic_forced_equal: pre_cue_force_equal_italic,
            post_cue_italic_forced_equal: post_cue_force_equal_italic,

            // practice
            prac_diagnostic_rounds: prac_diagnostic_rounds,
            prac_inducer_rounds: prac_inducer_rounds,
            prac_cue_rounds: prac_cue_rounds,
            prac_post_cue_num: prac_post_cue_num
        } 
    },
    on_finish: (data) => { 
        if(debug){ console.log(data) }
        
    }
}
timeline.push( diagnostic_task_instruction )
timeline.push( short_fixation )


if(!skip_practice){
    //// Practice
    // For the practice we want to force an equal number of right and left responses to not bias the learning. 
    
    // For the diagnostic practic, we only need a single set of stimuli: 
    run_stimuli = [rnd_stimuli[0], rnd_stimuli[1]]
    rnd_stimuli.splice(0,2) 
    // To force an equal number of right/left responses, we set the last parameter to "true". 
    // The function will create an array of equal right/left responses and randomize it. 
    // Selecting the respective response (italic/upright) case based on the predetermined array, looping through it to the length of the "prac_diagnostic_rounds".
    diagnostic_FNC(prac_diagnostic_rounds, run_stimuli, "Diagnostic practice", 100, "Diagnostic practice", true, false)
        // Force the round to be equal to not bias the practice
    
    // Inducer description
    let inducer_task_instruction_description = {
        type: jsPsychInstructions,
        pages: () => { 
            return [
                // FIRST, what keys will be used in this experiment? 
                `<div style="font-size:${instruction_font_size}">
                
                <h3> Variable Instruction Screen </h3>
                <br>
                On the next screen, you'll see the instruction that changes throughout the task (connected to non-words in <span style="color:${rnd_inducer_colour}"> ${rnd_inducer_colour_name.toLowerCase()}</span></b>).
                <br><br>

                Although the format of these instructions remains the same,<br>
                they will introduce two new 3-letter non-words each time.
                <br><br>

                A few practice trials will be provided.
                <br><br>

                The practice starts by clicking "Start".
                <br>
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
    
    
    // We also want to force an equal number of left/right responses for the practice inducer.
    // In this case we have to generate the array outside of the function and supply the stimulus used in the trial ("force_stimuli_inducer").
    // To do this we create an array of the length of the practice, split it in two, and give them a 0 or 1 value. 
    // We then randomize the array, and parse through the array along the for loop. The value is then force into the inducer trial, 
    // selecting the stimulus corresponding to the value (first = 0, last = 1).
    var prac_indu = Array(  Array( Math.floor(prac_inducer_rounds/2) ).fill(1),  
                            Array( Math.ceil( prac_inducer_rounds/2) ).fill(0)  ).flat()
        // Generate equal left/right inducer response trials
    var rnd_prac_indu = jsPsych.randomization.shuffle(prac_indu) // Randomize array
    if(debug){ console.log("Rnd practice inducer:", rnd_prac_indu) }

    for(let i = 0; i < prac_inducer_rounds; i++){
        let force_stimuli_inducer = rnd_prac_indu[i]
    
        // Run stimuli
        let run_stimuli = [rnd_stimuli[0], rnd_stimuli[1]]
        rnd_stimuli.splice(0,2) 
            // Remove added inducer stimuli from the main list 
    
        inducer_instruction_FNC(run_stimuli,"Practice", "Inducer practice")
        inducer_FNC(run_stimuli, "Practice", "Inducer practice", force_stimuli_inducer, false)
    }
    
    // Cue instructions
    let cue_instructions = {
        type: jsPsychInstructions,
        pages: () => { 
            return [ `<div style="font-size:${instruction_font_size}">
            
            <h3> Additional Practice Round </h3>
            <br>
            Another practice round will be conducted, following the same structure as all subsequent rounds.
            <br><br>

            Firstly, an instruction screen will assign two new <b><span style="color:${rnd_inducer_colour}"> 3-letter non-words</span></b> 
            to a left and right response. 
            <br><br>

            Thereafter, several trials will be presented in <b>black colour</b>, which may be either <i>italicized</i> or upright.
            <br><br>

            Lastly, a single trial featuring a non-word in <b><span style="color:${rnd_inducer_colour}"> ${rnd_inducer_colour_name.toLowerCase()} colour</span></b>
            will be shown. 
            <br><br><br>

            However, before the <b><span style="color:${rnd_inducer_colour}"> ${rnd_inducer_colour_name.toLowerCase() + " coloured non-word"}</span></b> 
            appears, a <b><span style="color:${rnd_cue_col}"> ${rnd_cue_col_n} ${cue_stimulus_name.toLowerCase() }</span></b> 
            will be presented.
            <br> 
            This <b><span style="color:${rnd_cue_col}"> ${rnd_cue_col_n} ${cue_stimulus_name.toLowerCase() }</span></b> 
            signifies that the <b><span style="color:${rnd_inducer_colour}"> ${rnd_inducer_colour_name.toLowerCase() + " coloured non-word"}</span></b>
            will appear <b>within the next 0 to 4 trials</b>.
            <br><br><br>

            You do not have to response to the <b><span style="color:${rnd_cue_col}"> ${rnd_cue_col_n} ${cue_stimulus_name.toLowerCase() }</span></b>,
            it will automatically disappear after about 1 second.
            <br>
            </div>`]
        }, 
        allow_keys: false, 
        show_clickable_nav: true,
        button_label_previous: "",
        button_label_next: "Start practice",
        post_trial_gap: 1500,
        data: { stimulus: "Instructions", trial_info: "Final experiment explanation" },
        on_finish: (data) => {
            if(debug){ console.log(data) }
        }
    }
    timeline.push( cue_instructions )
    
    // Cue practice
    run_stimuli = [rnd_stimuli[0], rnd_stimuli[1]]
    // Remove added inducer stimuli from the main list 
    rnd_stimuli.splice(0,2) 
    inducer_instruction_FNC(run_stimuli, "Practice", "Cue practice")

    // equal resp after cue
    let prac_pre_cue_run = Array(   Array( Math.floor( (prac_cue_rounds-prac_post_cue_num)/2 ) ).fill(0), 
                                    Array( Math.ceil(  (prac_cue_rounds-prac_post_cue_num)/2 ) ).fill(1) ).flat()
    let prac_post_cue_run = Array(  Array( Math.floor( (prac_post_cue_num)/2 ) ).fill(0), 
                                    Array( Math.ceil(  (prac_post_cue_num)/2 ) ).fill(1) ).flat()
    let rnd_prac_pre_cue_run = jsPsych.randomization.shuffle( prac_pre_cue_run )
    let rnd_prac_post_cue_run = jsPsych.randomization.shuffle( prac_post_cue_run )
    if(debug){ console.log("Cue practice, pre-cue run:", rnd_prac_pre_cue_run, ".. Post-cue run:", rnd_prac_post_cue_run) }
    diagnostic_FNC(prac_cue_rounds, run_stimuli, "Practice", prac_post_cue_num, "Cue practice", false, false, rnd_prac_pre_cue_run, rnd_prac_post_cue_run)
    inducer_FNC(run_stimuli, "Practice", "Inducer practice", null, false)
    
    
    //// Proper task start instructions
    let proper_task_start = {
        type: jsPsychInstructions,
        pages: () => {   
            return [`<div style="font-size:${instruction_font_size}">
            You have now completed the practice.
            
            <br><br>
            From now on, each presentation of a 3-letter will have a deadline of maximum 2 seconds. <br>
            Respond to each presentation as <b>fast and accurately</b> as possible. <br>
            The task will be difficult, but feedback will be provided. 
            <br>
            </div>`]
        }, 
        allow_keys: false,
        show_clickable_nav: true,
        button_label_previous: "", 
        button_label_next: "Start experiment",
        post_trial_gap: 1500,
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
}


//// Task proper 
for(let block = 0; block < number_of_inducers; block++){
    ////    Setup: 
    // Block stimuli: 
    let run_stimuli = [rnd_stimuli[0], rnd_stimuli[1]]
    rnd_stimuli.splice(0,2) 
    
    //// Force italic response sides 
    var pre_cue_italic_resp_sides = null;
    var post_cue_italic_resp_sides = null;
    // pre cue
    if(pre_cue_force_equal_italic){ //if forced equal pre-cue:
        let pre_cue_run = Array.from( Array(rnd_diagnostic_length[block]), (x, i) => i + 0) 
        // Nums to drag from the predetermined italic/upright list
        pre_cue_italic_resp_sides = pre_cue_run.map(index => rnd_pre_cue_resp_side_italic[index])  
        // Get forced response side according to nums from the start. 
        rnd_pre_cue_resp_side_italic.splice(0,  rnd_diagnostic_length[block]) 
        // Remove these response sides for future runs.
    }
    // post cue 
    if(post_cue_force_equal_italic){ // If forced equal post-cue: 
        let post_cue_run = Array.from( Array( rnd_cue_array[block]), (x, i) => i + 0) 
        // Nums to drag from the predetermined italic/upright list
        post_cue_italic_resp_sides = post_cue_run.map(index => rnd_post_cue_resp_side_italic[index])  
        // Get forced response side according to nums from the start. 
        rnd_post_cue_resp_side_italic.splice(0,  rnd_cue_array[block]) 
        // Remove these response sides for future runs.
    }
    
    //// Force stimuli response sides 
    var pre_cue_stimuli_resp_sides = null;
    var post_cue_stimuli_resp_sides = null;
    // pre cue
    if(pre_cue_force_equal_stimuli){ //if forced equal pre-cue:
        let pre_cue_run = Array.from( Array(rnd_diagnostic_length[block]), (x, i) => i + 0) 
        // Nums to drag from the predetermined italic/upright list
        pre_cue_stimuli_resp_sides = pre_cue_run.map(index => pre_cue_stimuli_force_resp[index])  
            // Get forced response side according to nums from the start. 
        pre_cue_stimuli_force_resp.splice(0,  rnd_diagnostic_length[block]) 
            // Remove these response sides for future runs.
    }
    // post cue
    if(post_cue_force_equal_stimuli){ // If forced equal post-cue: 
        let post_cue_run = Array.from( Array( rnd_cue_array[block]), (x, i) => i + 0) 
        // Nums to drag from the predetermined italic/upright list
        post_cue_stimuli_resp_sides = post_cue_run.map(index => post_cue_stimuli_force_resp[index])  
            // Get forced response side according to nums from the start. 
        post_cue_stimuli_force_resp.splice(0,  rnd_cue_array[block]) 
            // Remove these response sides for future runs.
    }

    if(debug){
        console.log("Inducer:", block, 
        ".\nPre-cue forced response side:", pre_cue_italic_resp_sides,
        ".\nPost-cue forced response side:", post_cue_italic_resp_sides,
        ".\nPre-cue forced response side:", pre_cue_stimuli_resp_sides,
        ".\nPost-cue forced response side:", post_cue_stimuli_resp_sides)
    }

    ////    Timeline: 
    // Inducer instructions
    inducer_instruction_FNC( run_stimuli, block, "Inducer instructions")

    // Diagnostic trials 
    diagnostic_FNC( total_diag_in_each_run[block], run_stimuli, block, rnd_cue_array[block], "Diagnostic trial", false, true, pre_cue_italic_resp_sides, post_cue_italic_resp_sides, pre_cue_stimuli_resp_sides, post_cue_stimuli_resp_sides)

    // Inducer trial
    inducer_FNC( run_stimuli, block, "Inducer trial")
}


/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

// End of task: 
// Change the background colour...
const white_bk = {
    type: jsPsychCallFunction,
    func: () => { changeBackground("white") }
} 
timeline.push(white_bk)
    // such a hassle to change the background of the survey thing... Just return to white. 

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
    data: { stimulus: "Feedback", trial_info: "End of experiment feedback" },
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
    // using "on_finish" wtih window.location seem to immediately open the link. 
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