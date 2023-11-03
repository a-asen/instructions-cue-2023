////    background default      ////
const default_background_colour = "#cccccc" // Light grey
const wrong_response_colour = "#d22d2d"     // Blood red-ish 

////    Delay   ////
// general
const instruction_delay = 20000     // How long is each S-R mapping displayed?
const trial_duration = 2000         // How long is each response trial?

// Fixation
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
const response_sides = ["LEFT","RIGHT"];     // What participants will RESPOND to (e.g., If X appears press responseSides[0])
    // these two parameters correspond in appearance 
    // i.e., f (or whatever key) should correspond to the response side (left)

////    Inducer parameters     ////
const inducer_colours = ["blue", "green", "yellow"]      // Inducer colour randomize between participants (if more than 1)
    // This is also what is DISPLAYED to participants. Should therefore be a readable name. 

////    Diagnostic parameters   ////
const number_of_inducers = 1//24;       // Number of inducers 
const diagnostic_min_length = 4         // Min run length
const diagnostic_max_length = 7//16     // Max run length
const run_italic_bias = [1,1]           // Left value correspond to ITALIC probability, right correspond to UPRIGHT probability

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


/////       Other           /////
// Stimuli list
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
    // retrieved from R script

