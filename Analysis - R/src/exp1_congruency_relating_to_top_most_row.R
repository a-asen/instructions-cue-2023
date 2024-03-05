library(ProjectTemplate)
load.project()


colnames(exp1_d)
unique(exp1_d$trial_info)

id_top_most_row <-
  exp1_d |>
  filter(trial_info == "Inducer instructions") |>
  select(id, trial_info, stimulus) |>
  mutate(top_row_resp = str_split(stimulus, " ") |> map_chr(4)) |>
  select(id, top_row_resp) |>
  unique()

data_w_top_row <-
  d |> # d is the excluded data.
  left_join(id_top_most_row, by = "id")


data_w_top_row |>
  filter(diagnostic_run < 18) |>
  ggplot(aes(top_row_resp, rt, col=con))+
  geom_boxplot()

exp1_d |>
  left_join(id_top_most_row, by="id") |>
  select(id, trial_info, top_row_resp, con, correct_response, rt) |>
  filter(trial_info %in% c("Diagnostic trial"))

right_left_diag <-
  exp1_d |>
  dplyr::select(id, trial_info, diagnostic_run, italic, inducer_run, stimulus,
                congruent, correct_diag_response_side, response, correct_response,rt) |>
  filter(trial_info=="Diagnostic trial" | trial_info=="Inducer instructions" | trial_info =="Diagnostic instructions") |>
  mutate(inducer_run = as.integer(inducer_run),
         italic = ifelse(italic=="true", TRUE, FALSE)) |>
  fill(inducer_run, .direction = "up") |>
  group_by(id) |>
  mutate(
    diag_ins = stimulus[trial_info=="Diagnostic instructions"],
    if_italic = str_split(diag_ins, " ") |> map_chr(4) ) |>
  ungroup() |>
  group_by(id, inducer_run) |>
  # reframe(ins = stimulus[trial_info=="Inducer instructions"] )
  mutate(
    response_side = ifelse(response=="j", "RIGHT", "LEFT"),
    #
    indu_ins = stimulus[trial_info=="Inducer instructions"],
    ins_left = str_split(indu_ins, " | ") |> map_chr(2),
    ins_right = str_split(indu_ins, " | ") |> map_chr(7),
    ins_resp = str_split(indu_ins, " | ") |> map_chr(4),
    #
    inducer_tap  = ifelse(stimulus==ins_left, ins_resp, ifelse(ins_resp=="LEFT", "RIGHT", "LEFT")),
    diag_tap     = ifelse(italic, if_italic, ifelse(if_italic=="LEFT", "RIGHT","LEFT") ) ) |>
  filter(trial_info=="Diagnostic trial")


# add top row instru and congruency
binded_left_right <-
  right_left_diag |>
  left_join(id_top_most_row, by = "id") |>
  left_join(
    exp1_d |>
      select(id, inducer_run, diagnostic_run, con),
    by = c("id", "inducer_run", "diagnostic_run")
  )

# RT over diag resp, inducer resp and instructions topmost row left/rigth
binded_left_right |>
  filter(inducer_run > 0) |>
  mutate(rt = as.integer(rt),
         top_row_resp = ifelse(top_row_resp=="LEFT", "LEFT topmost row", "RIGHT topmost row")) |>
  #pivot_longer(c(rt, correct_response)) |>
  ggplot(aes(diag_tap, rt, fill=inducer_tap))+
  stat_summary(geom="col", position = position_dodge())+
  facet_wrap(~top_row_resp)+
  coord_cartesian(ylim=c(550,750))


# To have more flexibility, create individual plots and then combine them
left_top_row_vis <-
  binded_left_right |>
  filter(inducer_run > 0) |>
  filter(top_row_resp == "LEFT") |>
  mutate(rt = as.integer(rt)) |>
  #pivot_longer(c(rt, correct_response)) |>
  ggplot(aes(diag_tap, rt, fill=inducer_tap))+
  stat_summary(geom="col", position = position_dodge())+
  coord_cartesian(ylim=c(600,720))+
  scale_fill_manual(values = c("skyblue","indianred"))+
  theme(legend.position = "none")

right_top_row_vis <-
  binded_left_right |>
  filter(inducer_run > 0) |>
  filter(top_row_resp == "RIGHT") |>
  mutate(rt = as.integer(rt)) |>
  #pivot_longer(c(rt, correct_response)) |>
  ggplot(aes(diag_tap, rt, fill=inducer_tap))+
  stat_summary(geom="col", position = position_dodge())+
  coord_cartesian(ylim=c(600,720))+
  scale_fill_manual(values = c("indianred","skyblue"))+

left_top_row_vis +
  right_top_row_vis +
  plot_layout(nrow=2)



