library(ProjectTemplate)
load.project()

# Get words consisting of 3 letters and that occur rarely (Freq < 10)
subt |>
  filter(nchar(Spelling)==3 & Freq<10) |>
  pull(Spelling) -> rare_words
# save(rare_words, file="data/rare_words.rdata")


# Acquire a certain length      ======
  # Generate a word list of an exact length
word_list <- sample(rare_words, size = 1) # start word
while(length(word_list) < 128){
  sample(rare_words,1) -> new_word # Sample a new word
  word_test(word_list, new_word) -> word_list
}


# Parse all items         ======
parse_all_items <- sample(rare_words, size = 1) # start word
i=1
while(i < length(rare_words)){
  # Test
  rare_words[i] -> new_word # Sample a new word
  word_test(parse_all_items, new_word) -> parse_all_items
  i + 1 -> i
}
save(parse_all_items, file="data/parse_all_items.rdata")
  #' NOTE. This parses from the start to the end, which selects the first words
  #' of a unique type. A more consistent random method would be to randomly sample
  #' from the word list.
  #' That is to say, the word list produced is not exhaustive. Other methods of
  #' parsing can be used to generate new combinations.




for(x in 1:128){

}


save(word_list, file = "data/word_list.rdata")

word_list

