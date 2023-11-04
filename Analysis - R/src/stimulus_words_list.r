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

# A certain length of words         ======
  # Generate a word list of an exact length
word_list <- sample(rare_words, size = 1) # start word
while(length(word_list) < 128){
  sample(rare_words,1) -> new_word # Sample a new word
  word_test(word_list, new_word) -> word_list
    # Test new word (will add if new word is unique)
}
write.csv(tibble(words=word_list), file="data/word_stimuli/word_list_128.csv", row.names = F)


# Parse all items         ======
  # Parse through all items of the list and create a long list.
max_parse_list <- sample(rare_words, size = 1) # start word
i=1
for(i in rare_words){
  rare_words[i] -> new_word # Parse item "i"
  word_test(max_parse_list, new_word) -> max_parse_list
    # Test new and add if it is unique (if not it skips)
  i + 1 -> i # increment
}
  #' NOTE. This parses from the start to the end, which selects the first words
  #' of a unique type. A more consistent random method would be to randomly sample
  #' from the word list.
  #' That is to say, the word list produced is not exhaustive. Other methods of
  #' parsing can be used to generate new combinations.

write.csv(tibble(words=max_parse_list), file="data/word_stimuli/max_parse_list.csv", row.names = F)




