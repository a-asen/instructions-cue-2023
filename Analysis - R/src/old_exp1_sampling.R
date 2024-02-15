library(ProjectTemplate)
load.project()

# Not used.

# An early version of generating the diagnostic lengths (would result in varying lengths for subjects)

l <- list()

# Generate probability distribution of the diagnostic run (if relevant)
max_diagnostic_length(4, 16, experiment_length = 24, reps = 5000) -> l$none

max_diagnostic_length(4, 16, experiment_length = 24, reps = 5000,
                      probability = T, decent = .2, math = "log10", spare = 1) -> l$log10

max_diagnostic_length(4, 16, experiment_length = 24, reps = 5000,
                      probability = T, decent = .2, math = "log", spare = 1) -> l$log

max_diagnostic_length(4, 16, experiment_length = 24, reps = 5000,
                      probability = T, decent = .2, math = "log1p", spare = 1) -> l$log1p

max_diagnostic_length(4, 16, experiment_length = 24, reps = 5000,
                      probability = T, decent = .2, math = "log2", spare = 1) -> l$log2

max_diagnostic_length(4, 16, experiment_length = 24, reps = 60,
                      probability = T, decent = .15, math = "linear", spare = 1) -> l$linear

l$linear

l$none + l$log10 + l$log + l$log1p + l$log2 + l$linear
