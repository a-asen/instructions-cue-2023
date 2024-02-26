# # Read data for experiment 1
# list.files("data/raw/experiment2/task", pattern = "*.csv", full.names = T) -> fnames
#
# map_df(fnames, \(x){
#   read_csv(x)
# }) -> exp2_d
#
# # Add new congruency to data
# exp2_d <-
#   exp2_d |>
#   mutate(inducer_run = as.numeric(inducer_run)) |>
#   left_join(raw_d, by=c("id","inducer_run", "diagnostic_run"))
#
