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

