
/* 

-- ELEMENT VARIABLES --

All dynamic elements on the page - either via ID selection, or query selection.

*/

var $ = function(id) { return document.getElementById(id); };

// TEXTAREAS //
let dead_unit_input = $("dead-units");
let hospital_unit_input = $("hospital-units");
let output_box = $("output");

// MAINPAGE BUTTONS //
let process_button = $("process");
let copy_output = $("copy-output");
let table_view = $("table-view");
let clear_textboxes = $("clear-textboxes");

// SIDEBAR RIBBON BUTTONS //
let theme_switcher = $("theme-switcher");
let custom_parameters = $("custom-parameters");

// OPTIONS: SHOW/HIDE //
let show_unit_properties = $("show-unit-properties");
let show_defences = $("show-defences");

// OPTIONS: TOGGLES //
let toggle_unit_properties = $("toggle-unit-properties");
let toggle_defences = $("toggle-defences");
let toggle_parameters = $("toggle-parameters");
let toggle_error_bypass = $("toggle-error-bypass");

// OPTIONS: OTHER //
let auto_bypass_errors = $("auto-bypass-errors");

// INPUT BOXES + DROPDOWNS //
let percentage_textbox = $("percentage-textbox");
let capacity_textbox = $("capacity-textbox");
let game_switcher = $("game-switcher");

// WINDOWS //
let copy_output_window = $("overlay");
let table_view_window = $("table-view-window");
let custom_parameter_window = $("custom-parameter-window");

// ERROR POP-UP CONTENT //
let error_message = $("error-message");
let error_code_text = $("error-code");
let error_message_content = $("error-message-content");

// GROUP SELECTORS //
const close_buttons = document.querySelectorAll(".close-popup");
const buttons_behind_popup = document.querySelectorAll(".disable-on-popup");

// OTHER //
let css_root_element = document.querySelector(':root');

/* 

-- PROCESS VARIABLES --

Custom variables which are used to help with processing inputted data.

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
