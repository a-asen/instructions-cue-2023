library(ProjectTemplate)
# migrate.project()
load.project() # Loads local helper functions used in this script.

library(brms)
library(cmdstanr)
library(lme4)

list.files("data/raw/abrahamse-et-al-2022",pattern = ".dat", full.names = T) -> data
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
map(0:2, \(x){
  d |>
    filter(correct==1) |>  # only correct inducers
    filter(trialtype==0) |>  # only diagnostic trials
    filter(Pre_Post==1) |>   # Only after the cue
    filter(blocktype==x) |>  # ?
    group_by(subject) |>
    mutate(
      blk = dense_rank(blocknr)
    ) |> ungroup()  |>
    mutate(
      time = blk / max(blk),
      congruency = ifelse(congruency==1, 0, 1),
    ) |>
    summarise(
      .by = c(subject, time, congruency),
      rt = mean(as.numeric(RT)),
      pe = 1 - mean(correct)
    )
}) -> test_data


lme4::lmer(rt ~ congruency * time + (1|subject), test_data[[1]])|> summary()
lme4::lmer(rt ~ congruency * time + (1|subject), test_data[[2]]) |> summary()
# I am assuming the last run type is the cancellation cue.
lme4::lmer(rt ~ congruency * time + (1|subject), test_data[[3]]) -> test_sum
test_sum |> sumamry()

brms::brm(rt ~ congruency * time + (1|subject), test_data[[3]],
          init = 0, backend = "cmdstanr", iter = 6000) -> test_bay_sum
# two-way intr not sig.

test_sum |>
  summary() |>
  pluck("coefficients") |>
  as_tibble() |>
  mutate(
    .before = 1,
    predictor =
      test_sum |>
         summary() |>
         pluck("coefficients") |> rownames()) |>
  rename(n_est = Estimate) |>
  left_join(
    bayes_coefs_to_table(test_bay_sum, "") |>
      mutate(names = ifelse(names=="Intercept", "(Intercept)", names)),
    by = join_by("predictor"=="names") ) |>
  filter(!(predictor == "(Intercept)")
  ) -> comb_tab

comb_tab |>
  mutate(across(2:4, ~fmt_APA_numbers(.x, .chr=T))) |>
  gt() |>
  tab_spanner("HDI", starts_with("Q")) |>
  cols_hide("group") |>
  cols_label(
    n_est = "B", "Std. Error" = md("*SE*"),
    "t value" = md("*t*"), Estimate = md("*b*"),
    "Q2.5" = "Low", "Q97.5" = "High", predictor="Predictor",
    pdir = md("*p*~*b*~"), erat = md("ER~*b*~")
  ) |>
  gtsave("abrahamse-et-al-2022-interaction.docx", "outputs/tables/")

