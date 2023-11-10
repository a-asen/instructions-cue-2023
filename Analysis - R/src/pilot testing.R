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

exp_data <- \(pdata){
  # Data
  pdata$stimulus[pdata$trial_info=="Diagnostic instructions"] -> diagnostic_instruction

  pdata |>
    # Only experimental trials
    filter(!is.na(inducer_run) | trial_info == "Diagnostic instructions") |>
    # Remove empty columns
    select(where(\(x) any(!is.na(x) & x != "")))

}

