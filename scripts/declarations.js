
/* 

-- ELEMENT VARIABLES --

All elements on the page - either via ID selection, or query selection.

*/
let dead_unit_input = document.getElementById("dead-units");
let hospital_unit_input = document.getElementById("hospital-units");
let output_box = document.getElementById("output");
let process_button = document.getElementById("process");
let options_box = document.getElementById("options");
let percentage_textbox = document.getElementById("percentage-textbox");
let copy_output = document.getElementById("copy-output");
let copy_output_window = document.getElementById("overlay");
let theme_switcher = document.getElementById("theme-switcher");
let clear_textboxes = document.getElementById("clear-textboxes");
let show_unit_properties = document.getElementById("show-unit-properties");
let show_defences = document.getElementById("show-defences");
let auto_bypass_errors = document.getElementById("auto-bypass-errors");
let game_switcher = document.getElementById("game-switcher");
let error_message = document.getElementById("error-message");
let error_code_text = document.getElementById("error-code");
let error_message_content = document.getElementById("error-message-content");
let custom_parameters = document.getElementById("custom-parameters");
let custom_parameter_window = document.getElementById("custom-parameter-window");
let toggle_unit_properties = document.getElementById("toggle-unit-properties");
let toggle_defences = document.getElementById("toggle-defences");
let toggle_parameters = document.getElementById("toggle-parameters");
let toggle_error_bypass = document.getElementById("toggle-error-bypass");

const close_buttons = document.querySelectorAll(".close-popup");
const buttons_behind_popup = document.querySelectorAll(".disable-on-popup");

let css_root_element = document.querySelector(':root');

/* 

-- PROCESS VARIABLES --

Custom variables which are used to help with processing the inputted data

*/

let selected_game = 0;
let option_status = 0;

let show_properties_enabled = false;
let show_defences_enabled = false;
let auto_bypass_errors_enabled = false;

let encoded_json_one;
let decoded_unit_json;

let parsed_unit_json;
let split_parsed_unit_data;

let info_unit_names = [];
let info_unit_tier = [];
let info_unit_power = [];
let info_unit_defense_status = [];

let perma_to_be_returned = false;
let window_is_currently_showing = false;
let is_dark_theme = true;
let current_window;

let percentage_modifier = 0.3;
