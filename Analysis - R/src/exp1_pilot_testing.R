library(ProjectTemplate)
load.project()

#   Get files     =====
list.files("data/raw/pilot", pattern = "*.csv", full.names = T) -> fnames
list.files("data/raw/experiment1", pattern = "*.csv", full.names = T) -> fnames
#list.files("data/raw/experiment2", pattern = "*.csv")

fnames2 <- fnames[4:7]
map_df(fnames2, \(x){
  read_csv(x)
}) -> data


# Pre-transformation
data |>
  mutate(rt = as.integer(ifelse( rt=="null", NA, rt ))) -> data

#   Behaviour       =====
data |>
  select(id, trial_info, inducer_run, correct_response, rt, congruent) |>
  filter(trial_info=="Diagnostic trial" | trial_info=="Inducer trial") -> d

 d |> filter(!inducer_run=="practice" ) -> d

##   Exclusion       =====
loss <- list()
loss$data_trials <- nrow(d)

### Practice round      =====
# d |> filter(inducer_run > 0) -> d


### Overall accuracy      ====
d |>
  filter(trial_info=="Diagnostic trial" | trial_info == "Inducer trial") |>
  group_by( id ) |>
  summarize( acc = sum(correct_response, na.rm = TRUE) / length( !is.na(correct_response) ) ) |>
  filter( acc < .7 ) |>
  pull( id ) -> loss$exclude_par

cat( length( loss$exclude_par ), " participant(s) have been excluded")

d |> filter(!(id %in% loss$exclude_par)) -> d


###  Removing trials more than 2.5 SD (from individual mean) & NA RT    ======
d |>
  group_by(id) |>
  mutate(rt_crit = ifelse( trial_info == "Diagnostic trial",
                           mean( rt, na.rm = TRUE ) + sd( rt, na.rm = TRUE ) * 2.5,
                           NA ),
         retain_trials = ifelse(
           # Remove deviations more than 2.5 SD
           rt >= rt_crit & trial_info == "Diagnostic trial" |
             # AND remove slow responses
             is.na(rt) & trial_info == "Diagnostic trial",
                             0, 1 ) ) -> d
sum(d$rt_remove==1)

cat(sum(d$rt >= d$rt_crit, na.rm = T), "lost trial(s) from ", nrow(d), "trials.",
    "Resulting in a loss of", sum(d$rt >= d$rt_crit, na.rm = T) / nrow(d) * 100, "percent of the data") # print
sum(d$rt >= d$rt_crit) / nrow(d) -> loss[["rt_sd_trials"]]
sum(d$rt >= d$rt_crit) / nrow(d) * 100 -> loss[["rt_sd_pct"]]

d |>
  filter( retain_trials == 1 ) -> d


### Only correct inducers         =====
  # Group_by should still be active?
d |>
  mutate( valid_trials = case_when( trial_info=="Inducer trial" & correct_response==1 ~ 1,
                                    trial_info=="Inducer trial" & correct_response==0 ~ 0,
                                    T ~ NA ) ) |>
  fill(valid_trials, .direction = "up") -> d

cat("Removed", sum(d$valid_trials==0), "trials of", nrow(d), "trials. Resulting in a loss of",
    sum(d$valid_trials==0) / length(d$valid_trials) * 100, "percent of the data.")
# save loss
sum(d$valid_trials==0) -> loss[["inducer_fail_trials"]]
sum(d$valid_trials==0) / length(d$valid_trials) * 100 -> loss$inducer_fail_pct

d |> filter(valid_trials == 1) -> d


# Diagnostic RT & accuracy ====
d |>
  filter(trial_info=="Diagnostic trial") |>
  group_by(id, congruent) |>
  summarize(rt = mean(rt, na.rm = TRUE),
            pct = sum(correct_response==1) / length(correct_response)) -> d2


# Statistics          ======
##  RT          =====
###   Test          ======
d2 |>
  pivot_wider( names_from = congruent, values_from = c(rt, pct) ) |>
  ungroup() |>
  summarise(
    pct_incongruent = mean(rt_FALSE),
    rt_congruent = mean(rt_TRUE),
    rt_diff = mean(rt_FALSE - rt_TRUE),
    t = t.test( rt_FALSE, rt_TRUE, paired = TRUE )[["statistic"]],
    df = t.test( rt_FALSE, rt_TRUE, paired = TRUE )[["parameter"]],
    p = t.test( rt_FALSE, rt_TRUE, paired = TRUE )[["p.value"]],
    )

###   Plot          =====
library(ggpp)
d2 |>
  mutate(congruent = ifelse(str_detect(congruent, "TRUE"), "Congruent", "Incongruent")) |>
  ggplot(aes(x = congruent, y = rt))+
  geom_point(position = position_dodgenudge(.05, x = .05), alpha = .35)+
  geom_line(aes(group = id), position = position_dodgenudge(.05, x=.05), alpha = .4)+
  stat_summary(fun.data = mean_se, col = "red")+
  labs(x = "", y = "Response time")



##    Percet correct        ======
d2 |>
  pivot_wider( names_from = congruent, values_from = c( rt, pct ) ) |>
  ungroup() |>
  summarise(
    pct_incongruent = mean( pct_FALSE ),
    pct_congruent = mean( pct_TRUE ),
    pct_diff = mean( pct_FALSE - pct_TRUE ),
    t = t.test( pct_FALSE, pct_TRUE, paired = TRUE )[["statistic"]],
    df = t.test( pct_FALSE, pct_TRUE, paired = TRUE )[["parameter"]],
    p = t.test( pct_FALSE, pct_TRUE, paired = TRUE )[["p.value"]],
  )





