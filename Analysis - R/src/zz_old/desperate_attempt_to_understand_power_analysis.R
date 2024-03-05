
library(tidyverse)
library(lsr)

gen_sample(27, 70, .03, .71) -> test

test |>
  summarise(rt = mean(rt), pct = mean(pct), .by=c(id, con)) |>
  pivot_wider(names_from = con, values_from = c(rt, pct )) -> test2

cohensD(test2$rt_incon, test2$rt_con, method = "paired")


map_df(1:300, \(x){

  gen_sample(27, 70, .17, .71) -> test

  test |>
    summarise(rt = mean(rt), pct = mean(pct), .by=c(id, con))  |> # -> test3
    pivot_wider(names_from = con, values_from = c(rt, pct )) -> test2

  tibble(
    m = mean(test2$rt_incon - test2$rt_con),
    t = t.test(test2$rt_incon, test2$rt_con, paired=T)$statistic,
    p = t.test(test2$rt_incon, test2$rt_con, paired=T)$p.value,
    d = cohensD(test2$rt_incon, test2$rt_con, method = "paired"),
    m_p = mean(test2$pct_incon - test2$pct_con),
    t_p = t.test(test2$pct_incon, test2$pct_con, paired=T)$statistic,
    p_p = t.test(test2$pct_incon, test2$pct_con, paired=T)$p.value,
    d_p = cohensD(test2$pct_incon, test2$pct_con, method = "paired")
  )

}) -> tdf

tdf |>
  summarise(across(everything(), mean))

mean(test2$rt_incon - test2$rt_con) / sd(test2$rt_incon - test2$rt_con)
library(afex)
test
aov_car(rt ~ con + Error(id/(con)), data = test3)


t.test(test2$rt_incon, test2$rt_con, paired="T")
cohensD(test2$rt_incon, test2$rt_con, method = "paired")

mean(tdf$d)



#####

# Parameters
N <- 100  # Number of subjects
std_dev_differences <- 1  # Assumed standard deviation of differences between pairs
effect_size <- 0.17  # Desired effect size

# Calculate mean difference based on effect size
mean_difference <- effect_size * std_dev_differences

# Simulate data
set.seed(123)  # For reproducibility
subject_ids <- 1:N

# Generate differences based on the mean difference and standard deviation
differences <- rnorm(N, mean = mean_difference, sd = std_dev_differences)

# Generate baseline (con) condition with some arbitrary mean and standard deviation
con_baseline <- rnorm(N, mean = 100, sd = 15)

# Apply differences to generate incon condition
incon <- con_baseline + differences

# Create dataframe
data <- tibble(
  id = subject_ids,
  con = con_baseline,
  incon = incon
)

# Calculate actual effect size from simulated data
actual_mean_difference <- mean(data$incon - data$con)
actual_std_dev_difference <- sd(data$incon - data$con)
actual_effect_size <- actual_mean_difference / actual_std_dev_difference


##################### #3#

d2 |>
  summarise(across(contains("_"), mean))

d |>
  ungroup() |>
  filter(trial_info=="Diagnostic trial") |>
  summarize(rt = sd(rt))
d_rt

d |>
  ungroup() |>
  filter(trial_info=="Diagnostic trial") |>
  mutate(rt = scale(rt)) |>
  summarise(rt = mean(rt), .by=c(id,con)) |>
  pivot_wider(names_from=con, values_from=rt) -> tes

t.test(tes$`FALSE`, tes$`TRUE`, paired=T)

tes |>
  summarise(
    m = mean(`FALSE`-`TRUE`),
    sd = sd(`FALSE`-`TRUE`)
  )

cohensD(tes$`FALSE`, tes$`TRUE`, method="paired")
d2
cohensD(d2$rt_FALSE, d2$rt_TRUE, method="paired")
cohensD(d2$pe_FALSE, d2$pe_TRUE, method="paired")


d |>
  ungroup() |>
  filter(trial_info=="Diagnostic trial") |>
  summarise(rt = mean(rt), .by=c(id,con)) |>
  mutate(rt = scale(rt)) |> #-> tes22
  pivot_wider(names_from=con, values_from=rt) -> tes2

t.test(tes2$`FALSE`, tes2$`TRUE`, paired=T)
cohensD(as.double(tes2$`FALSE`), as.double(tes2$`TRUE`), method="corrected")

tes22 |>
  mutate(con = ifelse(con==TRUE, 1, 0)) |>
  ggplot(aes(con, `rt`, group=id))+
  geom_point()+
  geom_line()

tibble(
  id = rep(1:N, each = OBS*2),
  con = rep.int( c("con","incon"), N*OBS),
  rt  = rnorm(N*OBS*2, 666, 200),
  pct = rnorm(N*OBS*2, 647, 200),
)  -> n_t
n_t |>
  summarise(
    rt = mean(rt),
    pct = mean(pct),
    .by= c(id, con)
  ) -> n_t2
t.test(rt ~ con, paired = T, data=n_t2)


#### ### #### ### #### ### #### ### #### ### #### ### #### ### #### ### #### ###


map_df(1:50, \(x){
  tibble(
    id = seq(1,27,1),
    con = rnorm(27, 0.17, 1),
    incon = rnorm(27, 0, 1),
  ) -> n_gen

  t.test(n_gen$con, n_gen$incon, paired=T)





})
