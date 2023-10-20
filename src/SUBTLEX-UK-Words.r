library(ProjectTemplate)
load.project()

# Get words consisting of 3 letters and that occur rarely (Freq < 10)
subt |>
  filter(nchar(Spelling)==3 & Freq<10) |>
  pull(Spelling) -> rare_words


levenshtein_distance <- function(s1, s2) {
  # Function to calculate Levenshtein distance
    # GPT: https://chat.openai.com/share/c1de9fe4-4c86-4135-84fd-3ba8c0eff1e9
      # See also: https://en.wikipedia.org/wiki/Levenshtein_distance
      # https://doi.org/10.1145%2F375360.375365
  len1 <- nchar(s1)
  len2 <- nchar(s2)

  # Create a matrix to store the distances
  distance_matrix <- matrix(0, nrow = len1 + 1, ncol = len2 + 1)

  # Initialize the first row and column
  for (i in 1:(len1 + 1)) {
    distance_matrix[i, 1] <- i
  }
  for (j in 1:(len2 + 1)) {
    distance_matrix[1, j] <- j
  }

  # Fill in the matrix
  for (i in 2:(len1 + 1)) {
    for (j in 2:(len2 + 1)) {
      cost <- ifelse(substr(s1, i - 1, i - 1) != substr(s2, j - 1, j - 1), 1, 0)
      distance_matrix[i, j] <- min(
        distance_matrix[i - 1, j] + 1,  # Deletion
        distance_matrix[i, j - 1] + 1,  # Insertion
        distance_matrix[i - 1, j - 1] + cost  # Substitution
      )
    }
  }
  # Return the Levenshtein distance
  return(distance_matrix[len1 + 1, len2 + 1])
}


word_list <- sample(word_list, 1) # start word
for(x in 1:128){
  sample(rare_words,1) -> new_word # Sample a new word
  print(new_word)

  dist <- as.numeric()
  for(word in word_list){
    print(word)
    dist <- c(dist, levenshtein_distance(word, new_word))
    # Get the levenshtein distances for each word pair
    print(dist)
  }
  if(sum(dist<=2)>1){
  # Threshold for similarity is 2 (e.g., two letters at the same location)
    print(paste("Skipping word:",new_word))
    next
  } else {
    print(paste("Add new word:", new_word))
    c(word_list, new_word) -> word_list
  }
  print(x)
}
save(word_list, file = "data/word_list.rdata")

