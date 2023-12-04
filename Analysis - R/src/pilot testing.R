library(ProjectTemplate)
load.project()

# pilot analysis
read.csv("data/raw/pilot/mydata2.csv") -> data
data |>
  mutate(test = case_when(trial_info=="Diagnostic trial" ~ correct_response,
                          trial_info=="Inducer trial" ~ inducer_correct_response,
                          T~NA))

#   Get files     =====
list.files("data/raw/experiment1", pattern = "*.csv", full.names = T) -> fnames
#list.files("data/raw/experiment2", pattern = "*.csv")

map_df(fnames, \(x){
  read_csv(x)
}) -> data


#   Exclusion       =====
# Practice round
data |>
  select(id, trial_info, inducer_run, correct_response, inducer_correct_response, rt, congruent) |>
  filter(inducer_run>0 & !(trial_info=="Inducer instructions"))
  mutate(correct_response = as.integer(ifelse(correct_response == "true", 1,0)),
         rt = as.integer(ifelse(rt=="null", NA, rt)),
#         )-> data

# Overall accuracy
data |>
  filter(trial_info=="Diagnostic trial" | trial_info == "Inducer trial") |>
  group_by(id) |>
  summarize(acc = sum(correct_response)/length(correct_response)) |>
  filter(acc<.7) |>
  pull(id) -> exclude_par

# Trials more than 2.5 SD
data |>
  mutate(rt_crit = mean(rt, na.rm=T), rt_crit_sd=sd(rt, na.rm=T), rt_exc=rt_crit+rt_crit_sd*2.5) |>
  filter(rt>rt_exc)


  # filter(!(id %in% exclude_par)) |>
  select(id, inducer_run, trial_info, congruent, rt, correct_response) |>
  filter(trial_info=="Diagnostic trial" | trial_info == "Inducer trial") |>

  group_by(id, trial_info) |>
  summarize(rt = sd(rt, na.rm=T),
            )




# diagnostic RT & accuracy
pdata |>
  select(id, inducer_run, trial_info, congruent, rt, correct_response) |>
  filter(trial_info=="Diagnostic trial" & inducer_run>0) |>
  mutate(),
         correct_response = ifelse(correct_response=="true", 1,0)) |>
  group_by(id, congruent) |>
  summarize(rt = mean(rt, na.rm=T), accuracy = sum(correct_response)/length(correct_response))

pdata |>
  select(id, inducer_run, trial_info, congruent, rt, correct_response) |>
  filter(trial_info=="Diagnostic trial" & inducer_run>0) |>
  mutate(rt = as.integer(ifelse(rt=="null",NA,rt)),
         correct_response = ifelse(correct_response=="true", 1,0)) |>
  ggplot(aes(x=congruent, y=rt, col=congruent))+
  geom_point()


pdata[pdata$trial_info=="Diagnostic trial",]  |>
  mutate(rt = as.integer(ifelse(rt=="null", NA, rt)))
  group_by(id, congruent) |> View()
  summarize(rt = mean(rt, na.rm=T))

unique(pdata$trial_info)

demo_data <- \(pdata){
  # Demographics / static info
  pdata |>
    # Not experimental trials
    filter(!(trial_info %in% c("Diagnostic trial", "Diagnostic instructions",
                               "Inducer instructions", "Inducer trial",
                               "Fixation - short", "Fixation - long"))) |>
    # Remove empty columns
    select(where(\(x) any(!is.na(x) & x != ""))) |> select(!response)

}

demo_data(pdata)
d -> pdata

exp_data <- \(pdata, rm_instr = F ){
  # Data
  pdata$stimulus[pdata$trial_info=="Diagnostic instructions"] -> diagnostic_instruction

    # to logical
  #italic, indcer_trial, correct_response, congruent, inducer_correct_response

  # Demo feedback
  which(colnames(pdata)=="gender") -> start_demo_feed
  which(colnames(pdata)=="post_screen") -> end_demo_feed
  pdata[nrow(pdata), start_demo_feed:end_demo_feed]

  # technicals
  which(colnames(pdata)=="width") -> start_tech
  which(colnames(pdata)=="microphone") -> end_tech
  pdata[which(pdata$trial_type=="browser-check"),start_tech:end_tech]



  pdata |>
    filter(!is.na(inducer_run) | trial_info == "Diagnostic instructions" |
             trial_type == "survey"| trial_type == "browser-check") -> test


  test |> fill(browser) |> View()
  fill(test$browser)
  mutate(across(if_any(is.double, fill)))
    #

    # Only experimental trials
    filter(!is.na(inducer_run) | trial_info == "Diagnostic instructions") |>
    # Remove empty columns
    select(where( \(x) any(!is.na(x) & x != "")) ) -> r_dat

  if(rm_instr == T){
    r_dat[!str_detect(r_dat$trial_info, "instruction"),]
  }
}

list.files("data/raw/pilot", full.names = T) -> fnames

map(fnames, \(fname){
  # map iterates over an element, hence we do something with each element of the vector
  # in this case I have a vector of files
  read.csv(fname) -> d

  d |> mutate(across(c(italic,inducer_trial, correct_response, congruent,
                      inducer_correct_response), as.logical)
              ) -> d

  exp_data(d, rm_instr = T)
}) |> list_to_dataframe -> data

data |> list_c() |> View()








