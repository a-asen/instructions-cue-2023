library(tidyverse)

list.files("data",pattern = ".dat", full.names = T) -> data
# data retrieved from https://osf.io/au7pv/

read_delim(data[str_detect(data, "3")], delim = "\t") -> d
# read experiment 3

str(d)

d |>
  filter(P_correct==1) |>  # only correct inducers
  filter(trialtype==0) |>  # only diagnostic trials
  filter(Pre_Post==1) |>   # Only after the cue
  filter(blocktype==2) |>
  #' I assume this is the type of run, but what 0,1 and 2 means is not clear,
  #' nor is it documented in the OSF -- as far as I can see
  summarise(
    .by = c(subject, blocknr, congruency),
    rt = mean(as.numeric(RT)),
    pe = 1 - mean(correct)
  ) -> dt

dt |>
  ggplot(aes(blocknr, rt, col=factor(congruency))) +
  stat_summary(fun.data=mean_se)
  geom_point()


# effect of time
d |>
  filter(P_correct==1) |>  # only correct inducers
  filter(trialtype==0) |>  # only diagnostic trials
  filter(Pre_Post==1) |>   # Only after the cue
  filter(blocktype==2) |>  # Only the third run type? i.e., cancel cue?
  group_by(subject) |>
  mutate(
    blk = dense_rank(blocknr)
  ) |> ungroup()  |>
  mutate(
    blk2 = blk / max(blk),
    congruency = ifelse(congruency==1, 0, 1),
  ) |>
  summarise(
    .by = c(subject, blk2, congruency),
    rt = mean(as.numeric(RT)),
    pe = 1 - mean(correct)
  ) -> test_data

lme4::lmer(rt ~ congruency * blk2 + (1|subject), test_data) -> test_sum
brms::brm(rt ~ congruency * blk2 + (1|subject), test_data, init = 0, backend = "cmdstanr", iter = 6000) -> test_bay_sum
# two-way intr not sig.

test_sum |>
  summary() |>
  pluck("coefficients") |>
  as_tibble()
