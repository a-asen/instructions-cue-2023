library(ProjectTemplate)
load.project()

exp1_excluded |>
  ungroup() |> # rm after reload
  mutate(
    .by = c(id, inducer_run),
    l = length(diagnostic_run)-1,
    l2 = floor(l/2),
    tr = ifelse(diagnostic_run <= l2, "pre", "post")
  ) |>
  summarise(
    .by = c(id, tr),
    n = n()
  )

  slice_head(, by = c(id, inducer_run))

