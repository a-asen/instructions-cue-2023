read.csv("data/word_stimuli/max_parse_list.csv") |> pull(words) -> max_parse_list
read.csv("data/word_stimuli/relevant_word_list.csv") |> pull(words) -> relevant_word_list
read.csv("data/word_stimuli/word_list_128.csv") |> pull(words) -> word_list_128
