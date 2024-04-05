# Read data for experiment 1
list.files("data/raw/experiment2/task", pattern = "*.csv", full.names = T) -> fnames

map_df(fnames, \(x){
  read_csv(x)
}) -> exp2_data

# Add new congruency to data
exp2_excluded <- exp2_d <-
  exp2_data |>
  dplyr::select(id, trial_info, inducer_run, diagnostic_run, post_cue, congruent, rt, correct_response) |>
  filter( trial_info == "Diagnostic trial" | trial_info == "Inducer trial" ) |>
  mutate(rt = as.integer(ifelse(rt=="null", NA,rt)),
         inducer_run = as.integer(inducer_run))

loss <- list()
loss$raw_data_trials <-
  exp2_excluded |>
  filter(diagnostic_run >= 0) |>
  nrow()

### participants excluding - accuracy      ====
exp2_excluded |>
  filter( trial_info == "Diagnostic trial" | trial_info == "Inducer trial" ) |>
  group_by( id ) |>
  mutate( correct_response = ifelse( trial_info=="Inducer trial" & is.na(rt), 0, correct_response) ) |>
  #' !  Non-responses count as a wrong response & are subject to the exclusion criteria.  !
  summarise( acc = 1 - mean(correct_response, na.rm = TRUE) ) |>
  filter( acc > .3 ) |>
  pull( id ) -> loss$exclude_par

# Count
loss$exclude_par_trials <- exp2_excluded |>
  filter(id %in% loss$exclude_par) |>
  filter(diagnostic_run >= 0) |>
  nrow()

# Exclude:
exp2_excluded <- exp2_excluded |>
  filter(!(id %in% loss$exclude_par))

# RELEVANT DATA START HERE
loss$data_trials <-
  exp2_excluded |>
  filter(diagnostic_run >= 0) |>
  nrow()

# Inducer practice
loss$inducer_practice_trials <-
  exp2_excluded |>
  filter(diagnostic_run >= 0) |>
  filter(inducer_run == 0) |>
  nrow()

loss$inducer_practice_prop <-
  loss$inducer_practice_trials / loss$data_trials * 100

# Exclude:
exp2_excluded <- exp2_excluded |>
  filter(inducer_run > 0)

exp2_excluded <- exp2_excluded |>
  left_join(
    by = c("id","inducer_run","diagnostic_run"),
    exp2_excluded |>
      filter(trial_info == "Diagnostic trial") |>
      mutate(
        .by = id,
        rt_crit_low   = mean(rt, na.rm=T) - sd(rt, na.rm=T) * 2.5,
        rt_crit_high  = mean(rt, na.rm=T) + sd(rt, na.rm=T) * 2.5,
        rt_crit = ifelse( ( (rt >= rt_crit_high) | (rt <= rt_crit_low) ), 1, NA ),
        rt_na = ifelse(is.na(rt), 1, NA)
      ) |>
      dplyr::select(id,inducer_run, diagnostic_run, rt_crit, rt_na)
  )

# lost trials
loss$rt_sd_trials <- exp2_excluded |>
  filter(diagnostic_run >= 0) |>
  filter(rt_crit == 1 | rt_na==1) |>
  nrow()

loss$rt_sd_prop <-
  loss$rt_sd_trials / loss$data_trials * 100

# Exclude
exp2_excluded <- exp2_excluded |>
  filter( is.na(rt_crit) & is.na(rt_na) ) |>
  dplyr::select(-rt_crit, -rt_na)


exp2_excluded <- exp2_excluded |>
  mutate( valid_trials = case_when(
    trial_info=="Inducer trial" & correct_response==1 ~ 1,
    trial_info=="Inducer trial" & correct_response==0 ~ 0,
    trial_info=="Inducer trial" & is.na(correct_response) ~ 0,
    T ~ NA ) ) |>
  fill(valid_trials, .direction = "up")

loss$inducer_fail_trials <- exp2_excluded |>
  filter(diagnostic_run >= 0) |>
  filter(valid_trials == 0) |>
  nrow()

loss$inducer_fail_prop <-
  loss$inducer_fail_trials / loss$data_trials * 100

loss$total_lost_trials <- loss$inducer_practice_trials + loss$rt_sd_trials + loss$inducer_fail_trials
loss$total_lost_prop <- loss$inducer_practice_prop + loss$rt_sd_prop + loss$inducer_fail_prop

exp2_excluded <-
  exp2_excluded |>
  filter( valid_trials == 1 ) |>
  dplyr::select(-valid_trials)

cat("\n\U00023E9 'exp2_excluded' \U00023EA is the data from experiment 2 with exclusions applied for the diagnostic and inducer trials.")
