# Sampling script
max_diagnostic_length <- \(min, max, reps=1000, experiment_length=24, probability = NULL){
  n <- as.numeric()

   for(x in 1:reps){
    c(n, sum(sample(min:max, experiment_length, T, prob = probability))) -> n
  }
  #hist(n)

  if(!is.null(probability)){
    cat("With the probability distribution: ", probability, fill = T)
  }

  ggplot(tibble(n), aes(n))+
    geom_histogram(aes(y=after_stat(density)))+
    geom_density(fill="black", alpha=.2)+
    geom_vline(xintercept = mean(n), colour="red")
}



# Generate probability distribution of the diagnostic run (if relevant)
max_diagnostic_length(4,16, reps = 30, probability = gen_prob(4,16,.1,"log",1))
  # Gen_prob generates the probability distribution

