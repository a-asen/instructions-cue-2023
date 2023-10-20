library(ProjectTemplate)
load.project()

# Read data
readxl::read_xlsx("data/subtlex-uk/SUBTLEX-uk_all.xlsx") -> subt


str_detect(Sp)
subt |>
    mutate(a = str_detect(Spelling, "&")) |>
    filter(nchar(Spelling)==3 & Freq<10) |> View()

    reframe(sa = sample(Spelling, 128, replace = F))

gen_words <- \(){
    subt |>
        filter(nchar(Spelling)==3 & FreqCount<10) |>
        reframe(sa = sample(Spelling, 128, replace = F))
}

g1 <- gen_words()
pull(g1)

(2*4 + 2*8 + 2*16)*4

n <- as.numeric()
for(x in 1:1000){
    c(n, sum(sample(4:16,24, T))) -> n
}

hist(n)
