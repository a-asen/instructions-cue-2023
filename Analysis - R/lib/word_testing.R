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

word_test <- function(word_list, new_word){
  dist <- as.numeric()

  for(word in word_list){
    dist <- c(dist, levenshtein_distance(word, new_word))
    # Get the levenshtein distances for each word pair
  }

  if(sum(dist<3)>=1){
    # if the chosen word is similar by a threshold of 2, to any items in
    # the existing list skip the word.
    # Threshold for similarity is 2 (e.g., two letters at the same location)
    print(paste("Skipping word:",new_word))
    return(word_list)
  }
  else {
    print(paste("Adding new word:", new_word))
    c(word_list, new_word) -> word_list
    return(word_list)
  }
}
