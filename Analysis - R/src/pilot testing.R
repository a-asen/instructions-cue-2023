library(ProjectTemplate)
load.project()

# pilot analysis
read.csv("data/raw/pilot/mydata (2).csv") -> pdata

demo_data <- \(pdata){
  # Demographics / static info
  pdata |>
    # Not experimental trials
    filter(!(trial_info %in% c("Diagnostic trial", "Diagnostic instructions",
                               "Inducer instructions", "Inducer trial",
                               "Fixation - short", "Fixation - long"))) |>
    # Remove empty columns
    select(where(\(x) any(!is.na(x) & x != ""))) |> select(!response)

}

d -> pdata

exp_data <- \(pdata, rm_instr = F ){
  # Data
  pdata$stimulus[pdata$trial_info=="Diagnostic instructions"] -> diagnostic_instruction

    # to logical
  #italic, indcer_trial, correct_response, congruent, inducer_correct_response

  # Demo feedback
  which(colnames(pdata)=="gender") -> start_demo_feed
  which(colnames(pdata)=="post_screen") -> end_demo_feed
  pdata[nrow(pdata), start_demo_feed:end_demo_feed]

  # technicals
  which(colnames(pdata)=="width") -> start_tech
  which(colnames(pdata)=="microphone") -> end_tech
  pdata[which(pdata$trial_type=="browser-check"),start_tech:end_tech]



  pdata |>
    filter(!is.na(inducer_run) | trial_info == "Diagnostic instructions" |
             trial_type == "survey"| trial_type == "browser-check") -> test


  test |> fill(browser) |> View()
  fill(test$browser)
  mutate(across(if_any(is.double, fill)))
    #

    # Only experimental trials
    filter(!is.na(inducer_run) | trial_info == "Diagnostic instructions") |>
    # Remove empty columns
    select(where( \(x) any(!is.na(x) & x != "")) ) -> r_dat

  if(rm_instr == T){
    r_dat[!str_detect(r_dat$trial_info, "instruction"),]
  }
}

list.files("data/raw/pilot", full.names = T) -> fnames

map(fnames, \(fname){
  # map iterates over an element, hence we do something with each element of the vector
  # in this case I have a vector of files
  read.csv(fname) -> d

  d |> mutate(across(c(italic,inducer_trial, correct_response, congruent,
                      inducer_correct_response), as.logical)
              ) -> d

  exp_data(d, rm_instr = T)
}) |> list_to_dataframe -> data

data |> list_c() |> View()








