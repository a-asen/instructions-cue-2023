## returns exp1_d and d_ex1
raw_d <-
  exp1_d |>
  dplyr::select(id, trial_info, diagnostic_run, italic, inducer_run, stimulus, congruent, correct_diag_response_side, response, correct_response,rt) |>
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

# join new
exp1_d <-
  exp1_d |>
  mutate(inducer_run = as.numeric(inducer_run)) |>
  left_join(raw_d, by=c("id","inducer_run", "diagnostic_run"))

d_ex1 <-
  exp1_d |>
  dplyr::select(id, trial_info, inducer_run, diagnostic_run, correct_response, rt, con) |>
  filter(trial_info == "Diagnostic trial" | trial_info == "Inducer trial") |>
  # filter(!is.na(correct_response)) |>
  mutate(rt = as.integer( ifelse(str_equal(rt, "null"), NA, rt) ) )
  # Relevant trials: 7656

loss1 <- list()
loss1$raw_data_trials <- length(d_ex1$diagnostic_run>0)

# EXCLUDE ACCURACY        --------------------------
d_ex1 |>
  group_by( id ) |>
  mutate( correct_response = ifelse( trial_info=="Inducer trial" & is.na(rt), 0, correct_response) ) |>
  #' !  Non-responses count as a wrong response & are subject to the exclusion criteria.  !
  summarise( acc = 1 - mean(correct_response, na.rm = TRUE) ) |>
  filter( acc > .3 ) |>
  pull( id ) -> loss1$exclude_par

# Count
loss1$exclude_par_trials <- d_ex1 |>
  filter(id %in% loss1$exclude_par) |>
  filter(diagnostic_run>0) |>
  nrow()

# Exclude:
d_ex1 <- d_ex1 |>
  filter(!(id %in% loss1$exclude_par))

# RELEVANT DATA START HERE
loss1$data_trials <- length(d_ex1$diagnostic_run>0)

## Inducer practice       ------------------------
loss1$inducer_practice_trials <- d_ex1 |>
  filter(diagnostic_run >= 0) |>
  filter(inducer_run == 0) |>
  nrow()

loss1$inducer_practice_prop <-
  loss1$inducer_practice_trials / loss1$data_trials * 100

# Exclude:
d_ex1 <- d_ex1 |>
  filter(inducer_run > 0)

# DEVIATING AND MISSING RT    -------------------------------
d_ex1 <-
  d_ex1 |>
    left_join(
      by = c("id","inducer_run","diagnostic_run"),
      d_ex1 |>
        dplyr::filter(trial_info == "Diagnostic trial") |>
        mutate(
          .by = id,
          rt_crit_low   = mean(rt, na.rm=T) - sd(rt, na.rm=T) * 2.5,
          rt_crit_high  = mean(rt, na.rm=T) + sd(rt, na.rm=T) * 2.5,
          rt_crit = ifelse( ( (rt >= rt_crit_high) | (rt <= rt_crit_low) ), 1, NA ),
          rt_na = ifelse(is.na(rt), 1,NA)
        ) |>
        dplyr::select(id,inducer_run, diagnostic_run, rt_crit, rt_na)
    )

loss1$rt_sd_trials <- d_ex1 |>
  filter(diagnostic_run >= 0) |>
  filter(rt_crit == 1 | rt_na==1) |>
  nrow()

loss1$rt_sd_prop <-
  loss1$rt_sd_trials / loss1$data_trials * 100

# Exclude
d_ex1 <-
  d_ex1 |>
  filter( is.na(rt_crit) & is.na(rt_na) ) |>
  dplyr::select(-rt_crit, -rt_na)


# ONLY VALID INDUCERS     --------------------
d_ex1 <- d_ex1 |>
  mutate( valid_trials = case_when(
    trial_info=="Inducer trial" & correct_response==1 ~ 1,
    trial_info=="Inducer trial" & correct_response==0 ~ 0,
    trial_info=="Inducer trial" & is.na(correct_response) ~ 0,
    # non-responses count as a wrong response
    T ~ NA ) ) |>
  fill(valid_trials, .direction = "up")

loss1$inducer_fail_trials <- d_ex1 |>
  dplyr::filter(diagnostic_run >= 0) |>
  dplyr::filter(valid_trials == 0) |>
  nrow()

loss1$inducer_fail_prop <-
  loss1$inducer_fail_trials / loss1$data_trials * 100

d_ex1 <-
  d_ex1 |>
  filter( valid_trials == 1 ) |>
  dplyr::select(-valid_trials)

# trials: 5053
