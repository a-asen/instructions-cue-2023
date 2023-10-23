n <- as.numeric()
for(x in 1:10000){
    c(n, sum(sample(4:16,24, T))) -> n
}
hist(n)
