library(ProjectTemplate)
load.project()


# Sample existing       ======
library(lsr)

d <-
  data |>
  select(id, trial_info, inducer_run, diagnostic_run, correct_response, rt, con) |>
  mutate(rt = as.numeric( ifelse(rt=="nulL", NA, rt)) ) |>
  filter(trial_info == "Diagnostic trial" | trial_info == "Inducer trial") |>
  filter(!is.na(correct_response))
# Raw data b/c sampling

# Visualize
d |>
  filter(diagnostic_run <5) |>
  group_by(id, con) |>
  summarise(rt = mean(rt, na.rm=T),
            pct = mean(correct_response,na.rm=T)) |>
  pivot_longer(c(rt,pct)) |>
  ggplot(aes(con, value))+
  facet_wrap(~name, scales ="free")+
  stat_summary()
# Raw still congruent

# Only diagnostic trials
diag_trials <-
  d |>
  filter(diagnostic_run<17)

stat_test <- function(n, size){
  # n = counter (uesless)
  # size = how many sample of each id?

  slice_sample(diag_trials, by = id, n = size) |>
    group_by(id, con) |>
    summarise(l = length(rt),
              rt = mean(rt),
              pct = mean(correct_response)) |>
    ungroup() |>
    pivot_wider(names_from=con, values_from=c(l, rt,pct)) |>
    reframe(
      n = n,
      # l_in = mean(l_FALSE),
      # l_con = mean(l_FALSE),
      rt_con = mean(rt_TRUE, na.rm=T),
      rt_incon = mean(rt_FALSE, na.rm=T),
      rt_est  = mean(rt_FALSE-rt_TRUE, na.rm=T),
      #rt_er  = t.test(rt_FALSE, rt_TRUE, paried=T, na.rm=T)$stderr,
      rt_t  = t.test(rt_FALSE, rt_TRUE, paried=T, na.rm=T)$statistic,
      rt_p  = t.test(rt_FALSE, rt_TRUE, paried=T, na.rm=T)$p.value,
      rt_d = cohensD(rt_FALSE, rt_TRUE, method="corrected"),
      pct_con = mean(pct_TRUE, na.rm=T),
      pct_incon = mean(pct_FALSE, na.rm=T),
      pct_est  = mean(pct_FALSE-pct_TRUE, na.rm=T),
      #pct_err  = t.test(pct_FALSE, pct_TRUE, paried=T)$stderr,
      pct_t  = t.test(pct_FALSE, pct_TRUE, paried=T, na.rm=T)$statistic,
      pct_p  = t.test(pct_FALSE, pct_TRUE, paried=T, na.rm=T)$p.value,
      pct_d = cohensD(pct_FALSE, pct_TRUE, method="corrected")
    )
}

rep_test <- function(ndiag, rep){
  # ndiag = number of diagnostics
  # rep = how many times we repeat the same sampling

  map_df(seq_along(1:rep), \(x)( stat_test(x, size)))  |>
      summarise(across(starts_with(c("rt_", "pct_")), ~ mean(.x, na.rm=T)), reps = n()) |>
      mutate(ndiag = ndiag)
}

avg_sample_vals <-
  map_df(30:100, \(x) rep_test(x, 100))
  # (1) for every person, sample ith (e.g., 30:100) *total* diagnostic trials
  # (2) repeat that sampling 100 times

avg_sample_vals |>
  ggplot(aes(ndiag, pct_est))+
  geom_line()









# rnd sample  =========
d |>
  group_by(con) |>
  filter(!is.na(con)) -> dia_h

dia_h |>
  summarise(rt = mean(rt, na.rm=T),
            rt_sd = sd(rt, na.rm=T),
            pct = mean(correct_response, na.rm=T),
            pct_sd = mean(correct_response, na.rm=T)) ->
  dia_means<
  dia_means$rt_sd[1] <- sd(dia_h$rt)
dia_means$rt_sd[2] <- sd(dia_h$correct_response)

dia_means |> pivot_wider(names_from=con, values_From=contains("_"))

gen_sample <- function(N, OBS){
  # N = Sample size
  # OBS = diagnostic trilas per N
  tibble(
    id = rep(1:N, each=OBS),
    rt_inc  = rnorm(N*OBS, dia_means$rt[1], dia_means$rt_sd[1]),
    rt_con  = rnorm(N*OBS, dia_means$rt[2], dia_means$rt_sd[2]),
    pct_inc = rnorm(N*OBS, dia_means$pct[1], dia_means$pct_sd[1]),
    pct_con = rnorm(N*OBS, dia_means$pct[2], dia_means$pct_sd[2]),
    ) |>
    mutate(
      pct_inc = ifelse(pct_inc>1, 1, pct_inc),
      pct_con = ifelse(pct_con>1, 1, pct_con),
    )
}


24*2.5

gen_sample(27, 40)




