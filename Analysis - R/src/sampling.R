
# Sampling script

diagnostic_length <- \(min, max, reps=1000, experiment_length=24, probability = NULL){
  n <- as.numeric()
  for(x in 1:reps){
    c(n, sum(sample(4:16,experiment_length, T, prob = probability))) -> n
  }
  hist(n)
}

gen_probability <- \(){

}

diagnostic_length(4,16, probability = [])
