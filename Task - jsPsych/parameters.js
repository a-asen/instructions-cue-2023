////    background default      ////
const default_background_colour = "#cccccc" // Light grey
const wrong_response_colour = "#d22d2d"     // Blood red-ish 

////    Delay   ////
// general
const instruction_delay = 10000     // How long is each s-r mapping displayed
const trial_duration = 2000     // How long is a trial?
// fixation
const short_fixation_delay = 2 // 750      // Main fixation delay
const long_fixation_delay = 1500    // second fixation delay (after each inducer)
// Feedback
const wrong_response_delay = 2 // 300    // How long is wrong response displayed?
const too_slow_delay = 300          // How long is too slow response displayed

////    Font size   ////
const instruction_font_size = "24px"    // about the experiment / Consent / explanation
const general_font_size = "42px"        // Diagnostic/inducer/stimulus size
const fixation_size = "48px"            // Fixation 

////    Responses    ////
const allowed_responses = ["f","j"];        // Allowed responses
const responseSides = ["LEFT","RIGHT"];     // What participants will RESPOND to (e.g., If X appears press responseSides[0])
    // these two parameters correspond in appearance 
    // i.e., f (or whatever key) should correspond to the response side (left)

////    Inducer parameters     ////
const inducer_colours = ["blue", "green", "yellow"]      // Inducer colour randomize between participants (if more than 1)

////    Diagnostic parameters   ////
let number_of_inducers = 1//24;     // Number of inducers 
let diagnostic_min_length = 4;      // Min run length
let diagnostic_max_length = 7;//16  // Max run length
let run_italic_bias = [1,1];        // Left value correspond to ITALIC probability, right correspond to UPRIGHT probability

// Diagnostic probability calcuation
/* Here we change the probability of a trials of a certain distances from the center will occur. 
For instance, we may not want trials of 16 and 4 to occur that often. These values will automatically 
calculate respective values from the center according to the "decent". The "spare" is how many valyes 
we want to be unaffected by this calculation - symmetrical from the center. */

let math = "log"   // Set to "none" if no probability calcuation should take place
    // choices: "none", "log10", "log", "log1p", "log2", "linear" // By steepness respectively
let decent = .1     // Decent per 1 distance from the mean(s)
let spare = 1       // spare - unaffected decent from the mean (e.g., 1 distance from mean is the same as the mean (i.e., 1))
    // linear, .1, 1 = [0.8, 0.9, 1, 1, 1, .9, .8]



/////       Other           /////
// Stimuli list
stimuli = ["gwn", "eug", "sht", "cjm", "svs", "orp", "scy", "rve", "wjb", "drn", 
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


// Change background function
function changeBackground(colour) {
    document.body.style.background = colour;
}



