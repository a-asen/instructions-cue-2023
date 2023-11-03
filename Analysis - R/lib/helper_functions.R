gen_prob <- \(min, max, decent, math, spare=0, debug=F){
  # Generate a probability distribution using various parameters
  # math = log, log2, log1p, log10, linear

  if (tolower(math) == "none") {
    final_probability_list <- rep(1, max-min)
  }

  else {
    halfway <- (min + max) / 2
    if (debug) { cat("Halway: ", halfway, "\n") }

    probability_list <- c()
    if(spare != 0){
      for (i in 1:spare) {
        probability_list <- c(probability_list, 1)
        if (debug) { cat("Probability list: ", probability_list, "\n") }
      }
    }

    for (i in 1:(floor(halfway - min - spare))) {
      switch(
        tolower(math),
        log = {
          probability_list <- c(probability_list, 1 - (log(1 + i) * decent))
        },
        log2 = {
          probability_list <- c(probability_list, 1 - (log2(1 + i) * decent))
        },
        log1p = {
          probability_list <- c(probability_list, 1 - (log1p(1 + i) * decent))
        },
        log10 = {
          probability_list <- c(probability_list, 1 - (log10(1 + i) * decent))
        },
        linear = {
          probability_list <- c(probability_list, 1 - (i * decent))
        }
      )
    }

    if (length(min:max) %% 2 == 0) {
      probability_list <- c(1, probability_list)
      final_probability_list <- c(rev(probability_list), probability_list)
    } else {
      final_probability_list <- c(rev(probability_list), 1, probability_list)
    }
  }
  return(final_probability_list)
}

### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ###

levenshtein_distance <- function(s1, s2) {
  # Function to calculate Levenshtein distance
  # Levenstein distance: https://en.wikipedia.org/wiki/Levenshtein_distance
  # See also: https://doi.org/10.1145%2F375360.375365
  # GPT code response: https://chat.openai.com/share/c1de9fe4-4c86-4135-84fd-3ba8c0eff1e9

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

### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ###

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

