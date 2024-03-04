### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ###

levenshtein_distance <- function(word1, word2) {
  #' Test Levenshtein distance of two words
  #'
  #' @description Calculates the number of character that two words differ by.
  #'
  #' @seealso Levenstein distance: https://en.wikipedia.org/wiki/Levenshtein_distance.
  #'   See also: https://doi.org/10.1145%2F375360.375365
  #'   Aided by ChatGPT, see response: https://chat.openai.com/share/c1de9fe4-4c86-4135-84fd-3ba8c0eff1e9
  #'
  #' @param word1 (string): The first word to compare
  #' @param word2 (string): The second word to compare
  #'
  #' @return A positive (or 0) number indicating the number of changes
  #'   that are necessary to do for the words to be the same.
  #'
  #' @export

  len1 <- nchar(word1)
  len2 <- nchar(word2)

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
      cost <- ifelse(substr(word1, i - 1, i - 1) != substr(word2, j - 1, j - 1), 1, 0)
      distance_matrix[i, j] <- min(
        distance_matrix[i - 1, j] + 1,        # Deletion
        distance_matrix[i, j - 1] + 1,        # Insertion
        distance_matrix[i - 1, j - 1] + cost  # Substitution
      )
    }
  }
  # Return the Levenshtein distance
  return(distance_matrix[len1 + 1, len2 + 1])
}

### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ###

generate_word_list <- function(data, length = NULL){
  vec <- sample(data, size = 1) # start word

  while(length(data) > 1){
    rnd_w <- sample(data, size=1)

    if(any(mapply(levenshtein_distance, vec, rnd_w) <= 2)){
      data[!data == rnd_w] -> data
    } else {
      c(vec, rnd_w) -> vec
      data[!data == rnd_w] -> data
    }
    if( !is.null(length) ){
      if(length(vec) >= length){
        break
      }
    }
  }

  cat("Length of", length(vec), "created.\n")
  if(length(vec)>= length){ cat("Successfully rearched a length of", length) }
  else{ cat("Failed to reach a length of", length) }
  invisible(vec)
}

### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ###
fmt_APA_numbers <- function(num, .p = FALSE, .low_val = FALSE, .chr = FALSE){
  require(purrr)

  purrr::map(num, \(num){
    o_num <- num
    # Store original value
    num <- as.numeric(num)
    # Transform to numeric (if possible)
    if(is.na(num)){
      return(o_num)
      # if is not numeric after transformation, return original
    }
    # p
    if(.p){
      p <- round(num, 3)
      if(p < .001){
        p <- "< .001"
      } else {
        p <- p |> as.character(num) |> sub("0.",".", x = _)
      }
      return( p )
    }
    # NORMAL VALS
    if(num >= 100 | num <= -100){
      num <- round(num, 0)
    }
    if(num >= 10 | num <= -10){
      num <- round(num, 1)
    }
    # IF LOW VALUES
    if(num >= 1 | num <= -1 | num < 1 & !.low_val | num > -1 & !.low_val){
      num <- round(num, 2)
    }
    if(num < 1 & .low_val | num > -1 & .low_val){
      num <- round(num, 3)
    }
    # IF .chr
    if(.chr){
      return( as.character(num) )
    } else {
      return( num )
    }
  }) |> unlist()
}

### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ###
fmt_APA_p_table_fig <- function(p, crit = 0.05, div = 5){
  chr <- ""
  if( p > crit ){
    return(chr)
  }
  if( p == crit ){
    paste0( "* *p* = ", as.character(crit) |> sub("0.",".",x=_)) -> chr
  }
  if( p < crit ){
    paste0( "* *p* < ", as.character(crit) |> sub("0.",".",x=_)) -> chr
  }
  if( p <= crit/div ){
    paste0( chr, " ** *p* < ", ( crit/div ) |> as.character() |> sub("0.",".",x=_) ) -> chr
  }
  if( p <= crit/(div*10) ){
    paste0( chr, " *** *p* < ",  ( crit/(div*10) ) |> as.character() |> sub("0.",".",x=_)  ) -> chr
  }
  return(chr)
}

### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ###

set_p_star <- function(p){
  ifelse(p < .001, "***",
         ifelse(p<.01, "**",
                ifelse(p<.05, "*","")))
}


### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ###

generate_diagnostic_lengths <- function(len = 100, d_min = 4, d_max = 16){
  #'  Randomly generate diagnostic lengths for the experiment parameters
  #'

  t <- tibble(n = seq(d_min,d_max,1), count=0)

  for(x in 1:len){
    s <- table(diag_length())
    s <- tibble(n = as.integer(names(s)), s=as.integer(s))


    t |>
      left_join(s, "n") |>
      mutate(s = ifelse(is.na(s), 0,s)) |>
      rowwise() |>  mutate(count = count+s) |>  ungroup() |>
      select(!s) -> t
  }
  m <- mean(t[["count"]])
  t |>
    ggplot(aes(n, count))+
    geom_col()+
    geom_hline(yintercept = m, col="red") -> p1
  print(p1)
  invisible(t)
}





### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ###
### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ###
### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ###


### Not used

gen_diag_distribution <- \(min, max, decent, math = "linear", spare = 0){
  #' Generate probability distribution
  #'
  #' @description This function generates a probability distribution (from the
  #'   halfway midpoint of the min-max) in relation to the diagnostic length of
  #'   any run for the diagnostic-inducer task.
  #'
  #' @param min (numeric): Minimum diagnostic length
  #' @param max (numeric): Maximum diagnostic length
  #' @param decent (numeric): Decending probability per one value change (from the center)
  #' @param math (string): Math function to be used (log10, log, log1p,  log2, linear - by steepness respectively)
  #' @param spare (numeric): Number of unaffected lengths (from the center)
  #'
  #' @return A list of values ranging from 0 to 1.
  #'
  #' @examples
  #'   add_numbers(4, 16, .1, "linear", spare = 9, debug = F)

  halfway <- (min + max) / 2
  cat("Halway: ", halfway, "\n")

  probability_list <- c()
  if(spare != 0){
    for (i in 1:spare) {
      probability_list <- c(probability_list, 1)
    }
  }

  for (i in 1:(floor(halfway - min - spare))) {
    switch(
      tolower(math),
      log = {
        calc <- 1 - (log(1 + i) * decent)
      },
      log2 = {
        calc <- 1 - (log2(1 + i) * decent)
      },
      log1p = {
        calc <- 1 - (log1p(1 + i) * decent)
      },
      log10 = {
        calc <- 1 - (log10(1 + i) * decent)
      },
      linear = {
        calc <- 1 - (i * decent)
      },
    )
    if(calc <= 0){
      calc <- 0
      cat("WARNING: Decent has reached a maximum!  Cases beyond", i, "from the center have a 0% probability of occuring!", "\n")
    }
    probability_list <- c(probability_list, calc)
  }

  if (length(min:max) %% 2 == 0) {
    probability_list <- c(1, probability_list)
    final_probability_list <- c(rev(probability_list), probability_list)
  } else {
    final_probability_list <- c(rev(probability_list),1, probability_list)
  }

  cat("Final probability list: ", final_probability_list, "\n")
  return(final_probability_list)
}

### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ###

# Not used
max_diagnostic_length <- \(min, max, reps = 1000, experiment_length = 24,
                           probability = NULL,
                           decent = .1, math = "linear", spare = 0){
  #'
  #' @param
  #' @param [decent, spare, math] is sent to "gen_prob"
  #'

  require(ggplot2)

  # ensure probability is correct format
  stopifnot("Probability can only take numeric, null or tue value" = is.double(probability) | is.null(probability) | isTRUE(probability))
  if(is.double(probability)){
    stopifnot("ERROR: One (or more) of the probabilities are > 1 or < 0. Please adjust the probability!" =
    !(probability > 1 | probability < 0))
    stopifnot("ERROR: Probability has either more or less entries than that requierd!" =
    length(probability) == max-min | length(probability) == (min+max)/2)

    if(length(probability) == (min+max)/2){
      probability <- c(probability, rev(probability))
    }
  } else { probability_l <- probability }

  if(!is.null(probability) | isTRUE(probability)){
    gen_prob(min=min, max=max, decent=decent, math=math, spare=spare) -> probability_l
  }

  n <- as.numeric()
  # Sample
  for(x in 1:reps){
    c(n, sum(sample(min:max, experiment_length, T, prob = probability_l))) -> n
  }

  # Create plot
  ggplot(tibble(n), aes(n))+
    geom_histogram(aes(y=after_stat(density)))+
    geom_density(fill="black", alpha=.2)+
    geom_vline(xintercept = mean(n), colour="red")+
    labs(title = ifelse(tolower(math)=="linear", "Math: Not applicable",
                        paste0("Math: ", math, ". Decent: ", decent, ". Spare: ", spare)),
         subtitle = paste0("Min diag.: ", min, ". Max diag.: ", max, ".\n",
                           "Mean: ", round(mean(n),2), ". SD: ", round(sd(n),2)) )
    #annotate("text", x=mean(n)-2*sd(n), y=max(n)/1000-.1, label=min)

}


