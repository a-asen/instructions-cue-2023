library(ProjectTemplate)
load.project()

# pilot analysis
read.csv("data/raw/pilot/mydata2.csv") -> data
data |>
  mutate(correct_response = case_when(
    trial_info=="Diagnostic trial" ~ correct_response,
    trial_info=="Inducer trial" ~ inducer_correct_response,
    T~NA),
    correct_response = ifelse(correct_response=="true", 1, 0)) -> data


#   Get files     =====
list.files("data/raw/experiment1", pattern = "*.csv", full.names = T) -> fnames
#list.files("data/raw/experiment2", pattern = "*.csv")

map_df(fnames, \(x){
  read_csv(x)
}) -> data


# Pre-transformation
data |>
  mutate(rt = as.integer(ifelse(rt=="null", NA, rt))) -> data

#   Behaviour       =====
data |>
  select(id, trial_info, inducer_run, correct_response, rt, congruent) |>
  filter(trial_info=="Diagnostic trial" | trial_info=="Inducer trial") -> d

##   Exclusion       =====
loss <- list()
loss$data_trials <- nrow(d)
### Practice round      =====
d |>
  filter(inducer_run>0) -> d

### Overall accuracy      ====
d |>
  filter(trial_info=="Diagnostic trial" | trial_info == "Inducer trial") |>
  group_by(id) |>
  summarize(acc = sum(correct_response)/length(correct_response)) |>
  filter(acc<.7) |>
  pull(id) -> loss$exclude_par

cat(length(loss$exclude_par), " participant(s) have been excluded")

d |> filter(!(id %in% loss$exclude_par)) -> d


###  Trials more than 2.5 SD    ======
d |>
  group_by(id) |>
  mutate(rt_crit = mean(rt, na.rm=T) + sd(rt, na.rm=T)*2.5) -> d

cat(sum(d$rt >= d$rt_crit), "lost trial(s) from ", nrow(d),"trials.",
    "Resulting in a loss of", sum(d$rt >= d$rt_crit) / nrow(d) * 100, "percent of the data") # print
sum(d$rt >= d$rt_crit) / nrow(d) -> loss[["rt_sd_trials"]]
sum(d$rt >= d$rt_crit) / nrow(d) * 100 -> loss[["rt_sd_pct"]]

d |>
  filter(rt<rt_crit) -> d


### Only correct inducers         =====
  # Group_by should still be active?
d |>
  mutate(valid_trials = case_when(trial_info=="Inducer trial" & correct_response==1 ~ 1,
                                   trial_info=="Inducer trial" & correct_response==0 ~ 0,
                                   T ~ NA)) |>
  fill(valid_trials, .direction ="up") -> d

cat("Removed", sum(d$valid_trials==0), "trials of", nrow(d), "trials. Resulting in a loss of",
    sum(d$valid_trials==0) / length(d$valid_trials) * 100, "percent of the data.")
sum(d$valid_trials==0) -> loss[["inducer_fail_trials"]]
sum(d$valid_trials==0) / length(d$valid_trials) * 100 -> loss$inducer_fail_pct

d |>
  filter(valid_trials==1) -> d


# Diagnostic RT & accuracy ====
d |>
  filter(trial_info=="Diagnostic trial") |>
  group_by(id, congruent) |>
  summarize(rt = mean(rt, na.rm=T), pct = sum(correct_response==1) / length(correct_response)) -> d2

## RT
aov(rt ~ congruent, d2)

## PCT
aov(pct ~ congruent, d2)










