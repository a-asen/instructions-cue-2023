read_csv("data/word_stimuli/word_only_128.csv") |> pull(words) -> stimuli

load("data/processed/exp1_data.rdata")
