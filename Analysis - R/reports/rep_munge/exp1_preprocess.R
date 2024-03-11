## RETURN D AND D_EX
d <-
  exp1_d |>
  dplyr::select(id, trial_info, inducer_run, diagnostic_run, correct_response, rt, con) |>
  filter(trial_info == "Diagnostic trial" | trial_info == "Inducer trial") |>
  # filter(!is.na(correct_response)) |>
  mutate(rt = as.integer( ifelse(str_equal(rt, "null"), NA, rt) ) )
# Relevant trials: 7656

d -> d_ex
loss <- list()
loss$data_trials <- nrow(d_ex)

# EXCLUDE ACCURACY
d |>
  filter( trial_info == "Diagnostic trial" | trial_info == "Inducer trial" ) |>
  group_by( id ) |>
  mutate( correct_response = ifelse( trial_info=="Inducer trial" & is.na(rt), 0, correct_response) ) |>
  #' !  Non-responses count as a wrong response & are subject to the exclusion criteria.  !
  summarize( err = 1 - mean(correct_response, na.rm=TRUE) ) |>
  filter( err > .3 ) |>
  pull( id ) -> loss$exclude_par

loss[["exclude_par_trials"]] <- length( d_ex$rt[d_ex$id == loss$exclude_par] )
loss[["exclude_par_pct"]]    <- length( d_ex$rt[d_ex$id == loss$exclude_par] ) / loss$data_trials * 100

d_ex |> filter( !(id %in% loss$exclude_par) ) -> d_ex
# trials: 7128

# EXCLUDE FIRST BLOCK PRACTICE
loss[["inducer_practice_pct"]] <- (1 - (nrow(d |> filter(inducer_run > 0)) / nrow(d))) * 100
loss[["inducer_practice_trials"]] <- nrow(d) - nrow(d |> filter(inducer_run > 0))

d_ex <- d_ex |>  filter(inducer_run > 0)
# Trials: 6801

# DEVIATING AND MISSING RT
d_ex |>
  mutate(rt = as.integer(rt)) |>
  ungroup() |>
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
  ) -> d_ex

sum(d_ex$retain_trials == 0) -> loss[["rt_sd_trials"]]
sum(d_ex$retain_trials == 0) / loss$data_trials * 100 -> loss[["rt_sd_pct"]]

d_ex <- d_ex |> filter( retain_trials == 1 )
# trials 6650

# ONLY VALID INDUCERS
d_ex |>
  mutate( valid_trials = case_when( trial_info=="Inducer trial" & correct_response==1 ~ 1,
                                    trial_info=="Inducer trial" & correct_response==0 ~ 0,
                                    trial_info=="Inducer trial" & is.na(correct_response) ~ 0,
                                    # non-responses count as a wrong response
                                    T ~ NA ) ) |>
  fill(valid_trials, .direction = "up") -> d_ex

sum(d_ex$valid_trials==0) -> loss[["inducer_fail_trials"]]
sum(d_ex$valid_trials==0) / loss$data_trials * 100 -> loss[["inducer_fail_pct"]]

d_ex |>
  filter( valid_trials == 1 ) |>
  ungroup() -> d_ex
# trials: 5053
