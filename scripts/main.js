/*
future features

let hospital_capacity = document.getElementById("hospital-capacity");
let list_order = document.getElementById("list-order");

hospital_capacity.addEventListener('click', function() {showWindowPopup(hospital_capacity_window)});
list_order.addEventListener('click', function() {showWindowPopup(list_order_window)});
*/

let dead_unit_input = document.getElementById("dead-units");
let hospital_unit_input = document.getElementById("hospital-units");
let output_box = document.getElementById("output");
let process_button = document.getElementById("process");
let options_box = document.getElementById("options");
let percentage_textbox = document.getElementById("percentage-textbox");
let copy_output = document.getElementById("copy-output");
let copy_output_window = document.getElementById("overlay");
let advanced_options = document.getElementById("advanced-options");
let advanced_options_window = document.getElementById("advanced-options-window");
let hospital_capacity_window = document.getElementById("hospital-capacity-window");
let list_order_window = document.getElementById("list-order-window");
let set_hospital_capacity_adjustment = document.getElementById("set-hospital-capacity-adjustment");
let new_hospital_capacity = document.getElementById("new-hospital-capacity");
let enable_return_percentage = document.getElementById("enable-return-percentage")
let return_percentage = document.getElementById("return-percentage");
let return_percentage_window = document.getElementById("return-percentage-window");
let set_return_percentage_adjustment = document.getElementById("set-return-percentage-adjustment");
let new_return_percentage = document.getElementById("new-return-percentage");
let theme_switcher = document.getElementById("theme-switcher");
let clear_textboxes = document.getElementById("clear-textboxes");
let show_unit_properties = document.getElementById("show-unit-properties");
let show_defences = document.getElementById("show-defences");
let auto_bypass_errors = document.getElementById("auto-bypass-errors");
let game_switcher = document.getElementById("game-switcher");
let error_message = document.getElementById("error-message");
let error_code_text = document.getElementById("error-code");
let error_message_content = document.getElementById("error-message-content");

const close_buttons = document.querySelectorAll(".close-popup");
const buttons_behind_popup = document.querySelectorAll(".disable-on-popup");

let css_root_element = document.querySelector(':root');

let selected_game = 0;
let option_status = 0;

let show_properties_enabled = false;
let show_defences_enabled = false;
let auto_bypass_errors_enabled = false;

let encoded_json_one_units;
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

encoded_json_one_units = document.getElementById("encjson");
decoded_unit_json = atob(encoded_json_one_units.innerHTML);

parsed_unit_json = JSON.parse(decoded_unit_json);
split_parsed_unit_data = Object.values(parsed_unit_json);

for (i = 0; i < split_parsed_unit_data[0].length; i++) {
    let extracted_unit_data = JSON.parse(JSON.stringify(split_parsed_unit_data[0][i]));

    info_unit_names.push(extracted_unit_data.name);
    info_unit_tier.push(extracted_unit_data.tier);
    info_unit_power.push(extracted_unit_data.power);
    info_unit_defense_status.push(extracted_unit_data.is_def);
}

copy_output.addEventListener('click', copyToClipboard);
process_button.addEventListener('click', processData);
advanced_options.addEventListener('click', function() {showWindowPopup(advanced_options_window)});
return_percentage.addEventListener('click', function() {showWindowPopup(return_percentage_window)});
theme_switcher.addEventListener('click', toggleTheme);
set_hospital_capacity_adjustment.addEventListener('click', updateHospitalCapacity);
set_return_percentage_adjustment.addEventListener('click', updateReturnPercentage);
clear_textboxes.addEventListener('click', clearAllText);
show_unit_properties.addEventListener('click', toggleShowUnitProperties);
show_defences.addEventListener('click', toggleShowDefences);
auto_bypass_errors.addEventListener('click', toggleAutoBypassErrors);
enable_return_percentage.addEventListener('click', toggleReturnPercentage);
game_switcher.addEventListener('click', toggleGame);

function clearAllText() {
    dead_unit_input.value = "";
    hospital_unit_input.value = "";
    output_box.value = "";
}

function toggleReturnPercentage() {
    if (perma_to_be_returned) {
        enable_return_percentage.textContent = "Return Perma-Losses: ❌";
        perma_to_be_returned = false;
        return_percentage.classList.add("rp-disabled");
    } else {
        enable_return_percentage.textContent = "Return Perma-Losses: ✅";
        perma_to_be_returned = true;
        return_percentage.classList.remove("rp-disabled");
    }
}

function toggleShowUnitProperties() {
    if (show_unit_properties.checked) {
        show_properties_enabled = true;
        game_switcher.classList.remove("gs-hidden");
    } else {
        show_properties_enabled = false;
        game_switcher.classList.add("gs-hidden");
    }
}

function toggleShowDefences() {
    if (show_defences.checked) {
        show_defences_enabled = true;
    } else {
        show_defences_enabled = false;
    }
}

function toggleAutoBypassErrors() {
    if (auto_bypass_errors.checked) {
        auto_bypass_errors_enabled = true;
    } else {
        auto_bypass_errors_enabled = false;
    }
}

function updateReturnPercentage() {
    return_percentage.textContent = "Return Percentage: " + Number(new_return_percentage.value) + "%";

    percentage_modifier = new_return_percentage.value / 100;
}

function updateHospitalCapacity() {
    hospital_capacity.textContent = "Hospital Capacity: " + Number(new_hospital_capacity.value).toLocaleString("en-US");
}

for (let i = 0; i < close_buttons.length; i++) { 
    close_buttons[i].addEventListener('click', hideWindowPopup);
}

function toggleTheme() {
    switch(is_dark_theme) {
        case true:
            theme_switcher.textContent = "Website Theme: ☀️";
            is_dark_theme = false;
            changeThemeLight();
            break;
        case false:
        default:
            theme_switcher.textContent = "Website Theme: 🌙";
            is_dark_theme = true;
            changeThemeDark();
            break;
    }
}

function toggleGame() {
    switch(selected_game) {
        case 0:
            game_switcher.textContent = "WAR Mode ⚔️";
            //let encoded_json_war = document.getElementById("encjson2");
            //decoded_json = atob(encoded_json_one.innerHTML);
            selected_game = 1;
            break;
        case 1:
            game_switcher.textContent = "GXK Mode 🦖";
            //let encoded_json_gxk = document.getElementById("encjson3");
            //decoded_json = atob(encoded_json_one.innerHTML);
            selected_game = 2;
            break;
        case 2:
        default:
            game_switcher.textContent = "ONE Mode 🛸";
            //decoded_json = atob(encoded_json_one.innerHTML);
            selected_game = 0;
            break;
    }

    parsed_unit_json = JSON.parse(decoded_unit_json);
    split_parsed_unit_data = Object.values(parsed_unit_json);

    for (i = 0; i < split_parsed_unit_data[0].length; i++) {
        let extracted_values = JSON.parse(JSON.stringify(split_parsed_unit_data[0][i]));

        info_unit_names.push(extracted_values.name);
        info_unit_tier.push(extracted_values.tier);
        info_unit_power.push(extracted_values.power);
        info_unit_defense_status.push(extracted_values.is_def);
    }
}


function changeThemeLight() {
    css_root_element.style.setProperty('--button-bg', 'eeeeee');
    css_root_element.style.setProperty('--button-highlight', 'black');
    css_root_element.style.setProperty('--textarea-bg', '#e8e8e8');
    css_root_element.style.setProperty('--scrollbar-thumb', '#c9c9c9');
    css_root_element.style.setProperty('--scrollbar-thumb-hover', '#adadad');
    css_root_element.style.setProperty('--body-bg', 'whitesmoke');
    css_root_element.style.setProperty('--button-hover', '#e8e8e8');
    css_root_element.style.setProperty('--button-active', '#c9c9c9');
}

function changeThemeDark() {
    css_root_element.style.setProperty('--button-bg', '#131313');
    css_root_element.style.setProperty('--button-highlight', 'white');
    css_root_element.style.setProperty('--textarea-bg', '#111111');
    css_root_element.style.setProperty('--scrollbar-thumb', '#323232');
    css_root_element.style.setProperty('--scrollbar-thumb-hover', '#404040');
    css_root_element.style.setProperty('--body-bg', '#191919');
    css_root_element.style.setProperty('--button-hover', '#252525');
    css_root_element.style.setProperty('--button-active', '#505050');
}

function showWindowPopup(window, error_code = -1) {
    if (error_code > -1) {
        error_code_text.textContent = "Error Code " + error_code;

        switch(error_code) {
            case 0:
                error_message_content.innerHTML = "Example error message, should not show up during runtime<br><br>Send me a message if you see this, along with what you did";
                break;
            case 1:
                error_message_content.innerHTML = "Negative perma-losses - likely caused by too many hospital units<br><br>Make sure you have copied both logs correctly";
                break;
        }
    }

    window.style.display = "block";
    css_root_element.style.setProperty('cursor', 'default');
    current_window = window;

    setTimeout(() => {
        window.style.opacity = '1';
    }, "50");

    setTimeout(() => {
    window_is_currently_showing = true;
    }, "50");

    for (let i = 0; i < buttons_behind_popup.length; i++) { 
        buttons_behind_popup[i].disabled = true;
        buttons_behind_popup[i].classList.add("disable-anchor-tags");
    }
}

function hideWindowPopup() {
    let window = current_window;
    document.body.removeAttribute('style');

    for (let i = 0; i < buttons_behind_popup.length; i++) { 
        buttons_behind_popup[i].disabled = false;
        buttons_behind_popup[i].classList.remove("disable-anchor-tags");
    }

    if (window_is_currently_showing) {
        window.style.opacity = '0';
        
        setTimeout(() => {
            window.style.display = "none";
        }, "300");

        setTimeout(() => {
            window_is_currently_showing = false;
        }, "50");
    }
}

function toggleOptionsVisibility() {
    if (!show_options_checkbox.checked) {
        options_box.classList.add("options-toggle");
        return
    }

    options_box.classList.remove("options-toggle");
}

function togglePercentageAdjustment() {
    if (!adjust_percentage_checkbox.checked) {
        percentage_textbox.disabled = true;
        return
    }

    percentage_textbox.disabled = false;
}

function copyToClipboard() {
    navigator.clipboard.writeText(output_box.value);

    copy_output_window.style.display = "block";

    setTimeout(() => {
        copy_output_window.style.opacity = '1';
    }, "50");

    setTimeout(() => {
        copy_output_window.style.opacity = '0';
    }, "1000");

    setTimeout(() => {
        copy_output_window.style.display = "none";
    }, "1300");
}

function processData() {
    option_status = 0;

    if (show_properties_enabled) {
        option_status = 1;
    }

    let output_text = "";

    let units_are_invalid = false;

    let dead_unit_text = dead_unit_input.value;
    let hospital_unit_text = hospital_unit_input.value;

    let line_terminator = "END";
    let midpoint = " x ";

    let dead_unit_data = extractRawText(dead_unit_text, "DEAD UNIT", "died", line_terminator);
    let split_dead_unit_data = splitTextIntoData(dead_unit_data, midpoint, line_terminator);
    let combined_dead_unit_data = combineCommonUnitTypes(split_dead_unit_data);

    let hospital_unit_data = extractRawText(hospital_unit_text, "HOSPITAL UNIT", "added", line_terminator);
    let split_hospital_unit_data = splitTextIntoData(hospital_unit_data, midpoint, line_terminator);
    let combined_hospital_unit_data = combineCommonUnitTypes(split_hospital_unit_data);

    let dead_units_sorted = sortUnitData(combined_dead_unit_data);
    let hospital_units_sorted = sortUnitData(combined_hospital_unit_data);

    /* Array copies are used to avoid incorrect (previously set) data being used after being sorted */

    let dead_unit_types = [].concat(dead_units_sorted[0]);
    let dead_unit_losses = [].concat(dead_units_sorted[1]);
    let dead_attached_ids = [].concat(dead_units_sorted[2]);

    let hospital_unit_types = [].concat(hospital_units_sorted[0]);
    let hospital_unit_losses = [].concat(hospital_units_sorted[1]);
    let hospital_attached_ids = [].concat(hospital_units_sorted[2]);

    let find_perma = calculatePermaLosses(dead_units_sorted, hospital_units_sorted);

    let perma_unit_types = find_perma[0];
    let perma_unit_losses = find_perma[1];
    let perma_attached_ids = find_perma[2];

    let dead_unit_total = dead_unit_losses.reduce((partialSum, a) => partialSum + a, 0);
    let hospital_unit_total = hospital_unit_losses.reduce((partialSum, a) => partialSum + a, 0);
    let perma_unit_total = perma_unit_losses.reduce((partialSum, a) => partialSum + a, 0);

    for (i = 0; i < perma_unit_losses.length; i++) {
        if (perma_unit_losses[i] < 0) {
            units_are_invalid = true;
        }
    }

    if (!auto_bypass_errors_enabled) {
        if (perma_unit_total < 0 || units_are_invalid) {
            showWindowPopup(error_message, 1);
            return;
        }
    }

    if (auto_bypass_errors_enabled) {
        output_text += "[ERRORS BYPASSED - THESE RESULTS ARE VERY LIKELY INACCURATE]\n\n";
    }

    output_text += "Dead Units -- " + dead_unit_total.toLocaleString("en-US") +  ":\n\n";
    output_text += createUnitList(dead_unit_types, dead_unit_losses, 1, option_status, dead_attached_ids);

    output_text += "\nHospital Units -- " + hospital_unit_total.toLocaleString("en-US") + ":\n\n";
    output_text += createUnitList(hospital_unit_types, hospital_unit_losses, 1, option_status, hospital_attached_ids);

    if (perma_unit_total > 0) {
        output_text += "\nPermanent Losses -- " + perma_unit_total.toLocaleString("en-US") + ":\n\n";
        output_text += createUnitList(perma_unit_types, perma_unit_losses, 1, option_status, perma_attached_ids, true);
    } else {
        output_text += "\nNo perma-losses recorded in attack ";
    }

    if (perma_to_be_returned) {

    output_text += "\nTo be returned (" + Math.trunc(percentage_modifier * 100) +"%):\n\n";
    output_text += createUnitList(perma_unit_types, perma_unit_losses, percentage_modifier, option_status, perma_attached_ids);

    }

    fillOutput(output_text);
}

function fillOutput(output) {
    output_box.value = output.substring(0, output.length - 1);
}

function extractRawText(targetText, startingText, endingText, terminator) {
    let target_text = targetText;
    let last_died_occurrence = target_text.lastIndexOf(endingText);
    let substring_counter = 0;
    let substring_text = "";

    while (substring_counter < last_died_occurrence) {
        let substring_start = 0;
        let substring_end = 0;

        let next_dead_occurrence = target_text.indexOf(startingText, substring_counter);

        substring_counter = next_dead_occurrence;
        substring_start = next_dead_occurrence + (startingText.length + 1);

        let next_died_occurrence = target_text.indexOf(endingText, substring_counter);

        substring_counter = next_died_occurrence;
        substring_end = next_died_occurrence - 1;

        substring_text += target_text.substring(substring_start, substring_end) + terminator + " \n";
    }
    
    return substring_text.replaceAll(",", "");
}

function splitTextIntoData(targetText, midpoint, terminator) {
    let target_text = targetText;
    let last_terminator_occurrence = targetText.lastIndexOf(terminator);
    let split_counter = 0;
    let uncombined_losses = [];
    let uncombined_types = [];
    let combined_array = [];

    while (split_counter < last_terminator_occurrence) {
        let left_split_start = 0;
        let left_split_end = 0;

        let right_split_start = 0;
        let right_split_end = 0;

        // A very hacky way of ensuring left_split_start starts at zero initially, and then increments based on the last END reference
        if (split_counter > 1) {
            left_split_start = split_counter + (terminator.length + 1);
        }

        let next_midpoint_occurrence = target_text.indexOf(midpoint, split_counter);
        let next_terminator_occurrence = target_text.indexOf(terminator, split_counter + 1);

        left_split_end = next_midpoint_occurrence;

        right_split_start = next_midpoint_occurrence + midpoint.length;
        right_split_end = next_terminator_occurrence;

        split_counter = next_terminator_occurrence;

        let number_lost = target_text.substring(left_split_start, left_split_end);
        let unit_type = target_text.substring(right_split_start, right_split_end);

        uncombined_losses.push(parseInt(number_lost));
        uncombined_types.push(unit_type);
    }

    combined_array.push(uncombined_losses);
    combined_array.push(uncombined_types);

    return combined_array;
}

function combineCommonUnitTypes(uncombinedUnitData) {
    let uncombined_losses = uncombinedUnitData[0];
    let uncombined_types = uncombinedUnitData[1];

    let losses = [];
    let types = [];
    let overall = [];

    let checked = [];
    let running_total = 0;
    let current_type = "";

    for (var i = 0; i < uncombined_losses.length; i++) {
        checked[i] = false;
    }

    for (var i = 0; i < uncombined_losses.length; i++) {
        // running_total must start from i as initial reference but never use it afterwards
        running_total += uncombined_losses[i];

        if (checked[i] == true) {
            running_total = 0;
            continue;
        }

        // only runs through as current_type if standalone (ie. the only line of losses of that specific unit)
        current_type = uncombined_types[i];

        for (var j = i; j < uncombined_losses.length; j++) {
            if (uncombined_types[i] == uncombined_types[j + 1]) {
                current_type = uncombined_types[j + 1];
                running_total += uncombined_losses[j + 1];
                checked[j + 1] = true;
            }
        }

        losses.push(running_total);
        types.push(current_type);
        running_total = 0;
    }

    overall.push(losses);
    overall.push(types);

    return overall;
}

function sortUnitData(unsortedUnitData) { 
    let losses = unsortedUnitData[0];
    let units = unsortedUnitData[1];

    let unit_list = [];
    let recombined_data = [];
    let id_list = [];

    for (var i = 0; i < losses.length; i++) {
        unit_list.push({'unit_name': units[i], 'units_lost': losses[i]});
    }

    unit_list.sort(function(a, b) {
        return ((a.unit_name < b.unit_name) ? -1 : 0);
    });

    for (var i = 0; i < unit_list.length; i++) {
        losses[i] = unit_list[i].unit_name;
        units[i] = unit_list[i].units_lost;
    }

    recombined_data.push(losses);
    recombined_data.push(units);

    for (var i = 0; i < losses.length; i++) {
        for (var j = 0; j < info_unit_names.length; j++) {
            if (losses[i] == info_unit_names[j]) id_list.push(j);
            
            continue;
        }
    }

    recombined_data.push(id_list);

    for (var i = 0; i < recombined_data[0].length; i++) {
        for (var j = 0; j < info_unit_defense_status.length; j++) {
            if (!show_defences_enabled) {

                if (recombined_data[0][i] == info_unit_names[j] && info_unit_defense_status[j] == true) {
                    recombined_data[0].splice(i, 1);
                    recombined_data[1].splice(i, 1);
                    recombined_data[2].splice(i, 1);

                    j = 0;
                }
            }
        }
    }

    return recombined_data;
}

function calculatePermaLosses(deadData, hospitalData) {
    let dead_data = deadData;
    let hospital_data = hospitalData;

    for (var i = 0; i < dead_data[0].length; i++) {
        for (var j = 0; j < hospital_data[0].length; j++) {
            if (dead_data[0][i] == hospital_data[0][j]) {
                dead_data[1][i] -= hospital_data[1][j];
            }
        }
    }

    let full_length = dead_data[0].length

    for (var i = 0; i < full_length; i++) {
        if (dead_data[1][i] == 0) {
            dead_data[0].splice(i, 1);
            dead_data[1].splice(i, 1);
            dead_data[2].splice(i, 1);

            i -= 1;
        }
    }

    return dead_data;
}

function createUnitList(types, losses, multiply_modifier, display_status, info_ids = null, perma = false) {
    let text = "";
    let loop_length = types.length;
    let total_combined_power = 0;

    for (var i = 0; i < loop_length; i++) {
        let unit_types = types[i];
        let unit_losses = Math.trunc(losses[i] * multiply_modifier).toLocaleString("en-US");
        let unit_tier;

        if (display_status == 1) {
            unit_tier = info_unit_tier[info_ids[i]];

            let combined_power = info_unit_power[info_ids[i]] * Math.trunc(losses[i] * multiply_modifier);
            total_combined_power += combined_power;
        }

        if (display_status == 1) {
            text += "[T" + unit_tier + "] " + unit_types + " x " + unit_losses + "\n";
        } else {
            text += unit_types + " x " + unit_losses + "\n";
        }

        combined_power = 0;
    }

    if (display_status == 1 && perma) {
        text +="\nTotal Power Lost: " + total_combined_power.toLocaleString("en-US") + "\n";
    }

    return text;
}