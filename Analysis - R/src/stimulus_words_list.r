library(ProjectTemplate)
load.project()

# Read subtlex uk
read_xlsx("data/subtlex-uk/SUBTLEX-UK_all.xlsx") -> subt

# Get words consisting of 3 letters and that occur rarely (Freq < 10)
subt |>
  filter(nchar(Spelling)==3 & Freq<10) |>
  pull(Spelling) -> rare_words
write.csv(tibble(words=rare_words), file="data/word_stimuli/relevant_word_list.csv", row.names = F)
# csv because you may want to access these outside of R

# 128 any symbol              ======
# Generate a word list of an exact length
any_word_128 <- generate_word_list(
  relevant_word_list, 128)
#write.csv(tibble(words=any_word_128), file="data/word_stimuli/any_word_128csv", row.names = F)


# 128 words + number          ======
word_num_128 <- generate_word_list(
  relevant_word_list[str_detect(relevant_word_list, "[1234567890]")], 128)
#write.csv( tibble(words=word_num_128), file="data/word_stimuli/word_num_128.csv", row.names = F)


# 128 only words              =======
word_128 <- generate_word_list(
  relevant_word_list[str_detect(relevant_word_list, "\\b\\D+\\b")], 128)
#write.csv( tibble(words=word_128), file="data/word_stimuli/word_128.csv", row.names = F)


# Parse all items             ======
max_parse_list <- generate_word_list(relevant_word_list)
# regenerated lists may differ from each other.
#write.csv(tibble(words=max_parse_list), file="data/word_stimuli/max_parse_list.csv", row.names = F)




