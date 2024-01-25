# Helper functions: 
levenshtein_distance 
- Calculates the word distinctness.

generate_word_list 
- Generates a word list based on the parameters
fmt_APA_numbers 
- Format numbers according to APA standard.

fmt_APA_p_table_fig 
- Retrieve the relevant `*` p values for tables/figures

generate_diagnostic_lengths 
- Generate random samples of the diagnostic lengths

gen_diag_distribution
- Generates a probability distribution for the diagnostic lengths to normalize run lengths (has been changed for a hard limit; e.g., experiment 1 = 240 trials).

max_diagnostic_length 
- Generate a distribution related to the gen_diag_distribution (see `sampling.R` for examples) 