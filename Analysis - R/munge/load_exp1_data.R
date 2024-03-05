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
  mutate(inducer_run = as.integer(inducer_run),
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
  mutate(inducer_run = as.integer(inducer_run)) |>
  left_join(raw_d, by=c("id","inducer_run", "diagnostic_run")) |>
  ungroup()

cat("\n\U00023E9 'exp1_d' \U00023EA  is the raw data with the new congruency ('con')\n" )
#save(exp1_d, file="data/processed/exp1_data.rdata")


## Excluded data ----------

exp1_excluded <-
  exp1_d |>
  dplyr::select(id, trial_info, inducer_run, diagnostic_run, correct_response, rt, con) |>
  mutate(rt = as.numeric( ifelse(rt=="null", NA, rt)) ) |>
  filter(trial_info == "Diagnostic trial" | trial_info == "Inducer trial") |>
  filter(!is.na(correct_response))

# exc 1 inducer
exp1_excluded |>
  filter(inducer_run > 0) ->
  exp1_excluded

# exclude
loss <- list()
loss$data_trials <- nrow(exp1_excluded)

### Overall accuracy      ====
exp1_d |>
  filter( trial_info == "Diagnostic trial" | trial_info == "Inducer trial" ) |>
  group_by( id ) |>
  mutate( correct_response = ifelse( trial_info=="Inducer trial" & is.na(rt), 0, correct_response) ) |>
  summarize( acc = sum(correct_response, na.rm = TRUE) / length( !is.na(correct_response) ) ) |>
  filter( acc < .7 ) |>
  pull( id ) -> loss$exclude_par

loss[["exclude_par_trials"]] <- length( exp1_excluded$rt[exp1_excluded$id == loss$exclude_par] )
loss[["exclude_par_pct"]]    <- length( exp1_excluded$rt[exp1_excluded$id == loss$exclude_par] ) / loss$data_trials * 100

exp1_excluded |> filter( !(id %in% loss$exclude_par) ) -> exp1_excluded
#id
exp1_excluded |>
  group_by(id) |>
  mutate(
    rt_crit = ifelse(
      trial_info == "Diagnostic trial",
      mean( rt, na.rm = TRUE ) + sd( rt, na.rm = TRUE ) * 2.5,
      NA ),
    retain_trials = ifelse(
      (rt > rt_crit & trial_info == "Diagnostic trial") | # **OR**
        (is.na(rt) & trial_info == "Diagnostic trial"),
      0, 1 )
  ) -> exp1_excluded

sum(exp1_excluded$retain_trials == 0) -> loss[["rt_sd_trials"]]
sum(exp1_excluded$retain_trials == 0) / loss$data_trials * 100 -> loss[["rt_sd_pct"]]

exp1_excluded |>
  filter( retain_trials == 1 ) -> exp1_excluded
exp1_excluded |>
  mutate( valid_trials = case_when( trial_info=="Inducer trial" & correct_response==1 ~ 1,
                                    trial_info=="Inducer trial" & correct_response==0 ~ 0,
                                    trial_info=="Inducer trial" & is.na(correct_response) ~ 0,
                                    # non-responses count as a wrong response
                                    T ~ NA ) ) |>
  fill(valid_trials, .direction = "up") -> exp1_excluded

sum(exp1_excluded$valid_trials==0) -> loss[["inducer_fail_trials"]]
sum(exp1_excluded$valid_trials==0) / loss$data_trials * 100 -> loss[["inducer_fail_pct"]]

exp1_excluded |>
  filter( valid_trials == 1 ) |>
  mutate(rt = as.numeric(rt)) |>
  ungroup() -> exp1_excluded

cat("\n\U00023E9 'exp1_excluded' \U00023EA is the data from experiment 1 with exclusions applied for the diagnostic and inducer trials.")
