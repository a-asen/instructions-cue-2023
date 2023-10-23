////    background default      ////
const default_background_colour = "#cccccc" // Light grey
const wrong_response_colour = "#d22d2d"     // Blood red-ish 

// Delay 
const fixation_delay = 750
const fixation2_delay = 1500
const wrong_response_delay = 300
const too_slow_delay = 300
const instruction_delay = 10000
const trial_duration = 2000

// Font size
const instruction_font_size = "36px"
const general_font_size = "42px"
const fixation_size = "48px"

////    Responses    ////
const allowed_responses = ["f","j"];  // Allowed responses
const responseSides = ["LEFT","RIGHT"]; // What participants will RESPOND to (e.g., If X appears press responseSides[0])
    // these two parameters must correspond 

////    Inducer parameters     ////
const inducer_colours = []                  // Inducer colour randomize between participants (if more than 1)

////    Diagnostic parameters   ////
let number_of_inducers = 2//24;   // Number of inducers 
let diagnostic_min_length = 4;     // Min run length
let diagnostic_max_length = 7;//16    // Max run length
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




/////       Other           /////
// Stimuli list
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

// Change background function
function changeBackground(colour) {
    document.body.style.background = colour;
}



