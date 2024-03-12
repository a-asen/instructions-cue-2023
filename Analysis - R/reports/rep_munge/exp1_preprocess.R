## RETURN D AND D_EX
d_ex <-
exp1_d |>
dplyr::select(id, trial_info, inducer_run, diagnostic_run, correct_response, rt, con) |>
filter(trial_info == "Diagnostic trial" | trial_info == "Inducer trial") |>
# filter(!is.na(correct_response)) |>
mutate(rt = as.integer( ifelse(str_equal(rt, "null"), NA, rt) ) )
# Relevant trials: 7656

loss <- list()
loss$raw_data_trials <- length(d_ex$diagnostic_run>0)

# EXCLUDE ACCURACY        --------------------------
d_ex |>
filter( trial_info == "Diagnostic trial" | trial_info == "Inducer trial" ) |>
group_by( id ) |>
mutate( correct_response = ifelse( trial_info=="Inducer trial" & is.na(rt), 0, correct_response) ) |>
#' !  Non-responses count as a wrong response & are subject to the exclusion criteria.  !
summarise( acc = 1 - mean(correct_response, na.rm = TRUE) ) |>
filter( acc > .3 ) |>
pull( id ) -> loss$exclude_par

# Count
loss$exclude_par_trials <- d_ex |>
filter(id %in% loss$exclude_par) |>
filter(diagnostic_run>0) |>
nrow()

# Exclude:
d_ex <- d_ex |>
filter(!(id %in% loss$exclude_par))

# RELEVANT DATA START HERE
loss$data_trials <- length(d_ex$diagnostic_run>0)

## Inducer practice       ------------------------
loss$inducer_practice_trials <- d_ex |>
filter(diagnostic_run >= 0) |>
filter(inducer_run == 0) |>
nrow()

loss$inducer_practice_prop <-
loss$inducer_practice_trials / loss$data_trials * 100

# Exclude:
d_ex <- d_ex |>
filter(inducer_run >= 0)

# DEVIATING AND MISSING RT    -------------------------------
d_ex <- d_ex |>
group_by(id) |>
mutate(
  # Calculate: rt + SD * 2.5
  rt_crit = ifelse(
    trial_info == "Diagnostic trial",
    mean( rt, na.rm = TRUE ) + sd( rt, na.rm = TRUE ) * 2.5, NA ),
  # Trials to retain/remove:
  retain_trials = ifelse(
    # Diag trial *AND* RT above critical (rt * 2.5SD) OR is missing
    str_equal(trial_info, "Diagnostic trial") &
      ( (rt >= rt_crit) | (is.na(rt)) ),
    0, 1 )
)

loss$rt_sd_trials <- d_ex |>
filter(diagnostic_run >= 0) |>
filter(retain_trials == 0) |>
nrow()

loss$rt_sd_prop <-
  loss$rt_sd_trials / loss$data_trials * 100

# Exclude
d_ex <- d_ex |>
  filter(retain_trials == 1)


# ONLY VALID INDUCERS     --------------------
d_ex <- d_ex |>
  mutate( valid_trials = case_when( trial_info=="Inducer trial" & correct_response==1 ~ 1,
                                    trial_info=="Inducer trial" & correct_response==0 ~ 0,
                                    trial_info=="Inducer trial" & is.na(correct_response) ~ 0,
                                    # non-responses count as a wrong response
                                    T ~ NA ) ) |>
  fill(valid_trials, .direction = "up")

loss$inducer_fail_trials <- d_ex |>
  filter(diagnostic_run >= 0) |>
  filter(valid_trials == 0) |>
  nrow()

loss$inducer_fail_prop <-
  loss$inducer_fail_trials / loss$data_trials * 100

d_ex <- d_ex |> filter( valid_trials == 1 )
# trials: 5053
