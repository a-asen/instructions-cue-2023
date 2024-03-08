d <-
  exp1_d |>
  dplyr::select(id, trial_info, inducer_run, diagnostic_run, correct_response, rt, con) |>
  filter(trial_info == "Diagnostic trial" | trial_info == "Inducer trial") |>
  filter(!is.na(correct_response)) |>
  mutate(rt = as.integer(rt))

d -> d_ex
loss <- list()
loss$data_trials <- nrow(d_ex)

# accur
d_ex |>
  filter( trial_info == "Diagnostic trial" | trial_info == "Inducer trial" ) |>
  group_by( id ) |>
  mutate( correct_response = ifelse( trial_info=="Inducer trial" & is.na(rt), 0, correct_response) ) |>
  #' !  Non-responses count as a wrong response & are subject to the exclusion criteria.  !
  summarise( acc = sum(correct_response, na.rm = TRUE) / length( !is.na(correct_response) ) ) |>
  filter( acc < .7 ) |>
  pull( id ) -> loss$exclude_par

loss[["exclude_par_trials"]] <- length( d_ex$rt[d_ex$id == loss$exclude_par] )
loss[["exclude_par_pct"]]    <- length( d_ex$rt[d_ex$id == loss$exclude_par] ) / loss$data_trials * 100

d_ex |> filter( !(id %in% loss$exclude_par) ) -> d_ex
# rt dev+miss
d_ex |>
  mutate(rt = as.integer(rt)) |>
  ungroup() |>
  group_by(id) |>
  mutate(
    rt_crit = ifelse(
      trial_info == "Diagnostic trial",
      mean( rt ) + sd( rt ) * 2.5,
      NA ),
    retain_trials = ifelse(
      (rt > rt_crit & trial_info == "Diagnostic trial") | # **OR**
        (is.na(rt) & trial_info == "Diagnostic trial"),
      0, 1 )
  ) -> d_ex

sum(d_ex$retain_trials == 0) -> loss[["rt_sd_trials"]]
sum(d_ex$retain_trials == 0) / loss$data_trials * 100 -> loss[["rt_sd_pct"]]

d_ex |>
  filter( retain_trials == 1 ) -> d_ex
# inducers:
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
  filter( inducer_run > 0) |>
  ungroup() -> d_ex