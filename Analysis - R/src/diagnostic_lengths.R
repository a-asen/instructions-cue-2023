
# diag length
diag_length <- function(){ sample(seq(4,16,1), 23, replace = T) }

g_len <- function(len = 100){
  t <- tibble(n = seq(4,16,1), count=0)

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

g_len()
g_len(1)

# if(sum(s$s[s$n>10]) != sum(s$s[s$n<10])){ cat( sum(s$s[s$n>10]), "UNEQUAL", sum(s$s[s$n<10])) }