library(tidyverse)

# Read data for experiment 1
list.files("data/raw/experiment1/task", pattern = "*.csv", full.names = T) -> fnames

map_df(fnames, \(x){
  read_csv(x)
}) -> exp1_d

# Fix congrunecy:
raw_d <-
  exp1_d |>
  dplyr::select(id, trial_info, diagnostic_run, italic, inducer_run, stimulus,
                congruent, correct_diag_response_side, response, correct_response,rt) |>
  filter(trial_info=="Diagnostic trial" | trial_info=="Inducer instructions" | trial_info =="Diagnostic instructions") |>
  mutate(inducer_run = as.numeric(inducer_run),
         italic = ifelse(italic=="true", TRUE, FALSE)) |>
  fill(inducer_run, .direction = "up") |>
  group_by(id) |>
  mutate(
    diag_ins = stimulus[trial_info=="Diagnostic instructions"],
    if_italic = str_split(diag_ins, " ") |> map_chr(4) ) |>
  ungroup() |>
  group_by(id, inducer_run) |>
  # reframe(ins = stimulus[trial_info=="Inducer instructions"] )
  mutate(
    response_side = ifelse(response=="j", "RIGHT", "LEFT"),
    #
    indu_ins = stimulus[trial_info=="Inducer instructions"],
    ins_left = str_split(indu_ins, " | ") |> map_chr(2),
    ins_right = str_split(indu_ins, " | ") |> map_chr(7),
    ins_resp = str_split(indu_ins, " | ") |> map_chr(4),
    #
    inducer_tap  = ifelse(stimulus==ins_left, ins_resp, ifelse(ins_resp=="LEFT", "RIGHT", "LEFT")),
    diag_tap     = ifelse(italic, if_italic, ifelse(if_italic=="LEFT", "RIGHT","LEFT") ) ) |>
  filter(trial_info=="Diagnostic trial") |>
  ungroup() |>
  mutate(con = ifelse(inducer_tap==diag_tap, T,F)) |>
  dplyr::select(id, inducer_run, diagnostic_run, con)

# Add new congruency to data
exp1_d <-
  exp1_d |>
  mutate(inducer_run = as.numeric(inducer_run)) |>
  left_join(raw_d, by=c("id","inducer_run", "diagnostic_run"))

#save(exp1_d, file="data/trans/exp1_data.rdata")
