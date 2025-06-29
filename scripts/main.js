var $ = function(id) { return document.getElementById(id); };

let dead_unit_input = $("dead-units");
let hospital_unit_input = $("hospital-units");
let output_box = $("output");
let process_button = $("process");
let options_box = $("options");
let percentage_textbox = $("percentage-textbox");
let copy_output = $("copy-output");
let copy_output_window = $("overlay");
let advanced_options = $("advanced-options");
let advanced_options_window = $("advanced-options-window");
let list_order_window = $("list-order-window");
let theme_switcher = $("theme-switcher");
let clear_textboxes = $("clear-textboxes");
let show_unit_properties = $("show-unit-properties");
let show_defences = $("show-defences");
let auto_bypass_errors = $("auto-bypass-errors");
let game_switcher = $("game-switcher");
let game_selector_menu = $("game-selector-menu");
let error_message = $("error-message");
let error_code_text = $("error-code");
let error_message_content = $("error-message-content");
let display_alphabetically = $("display-alphabetically");
let combine_units = $("combine-units");
let line_counter = $("line-counter");
let show_log_time = $("show-log-time");
let time_style_switcher = $("time-style-switcher");
let merge_perma = $("merge-perma");
let maximize = $('maximize');

let show_defences_text = document.querySelector(".su-disabled");
let merge_perma_text = document.querySelector(".mpl-disabled");

const close_buttons = document.querySelectorAll(".close-popup");
const buttons_behind_popup = document.querySelectorAll(".disable-on-popup");

let css_root = document.querySelector(':root');

let selected_game = 0;
let time_style = 0;
let option_status = 0;
let num_rows = 0;

let show_properties_enabled = false;
let show_defences_enabled = false;
let auto_bypass_errors_enabled = false;
let show_time_enabled = false;
let alphabetic_sorting_enabled = false;
let merge_perma_enabled = false;

let combine_units_enabled = true;

let encoded_json_one;
let decoded_unit_json;

let parsed_unit_json;
let split_parsed_unit_data;

let info_unit_names = [];
let info_unit_tier = [];
let info_unit_power = [];
let info_unit_defense_status = [];

let window_is_currently_showing = false;
let is_dark_theme = true;
let current_window;

let percentage_modifier = 0.3;

encoded_json_one = $("encjson");
decoded_unit_json = atob(encoded_json_one.innerHTML);

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
theme_switcher.addEventListener('click', toggleTheme);
clear_textboxes.addEventListener('click', clearAllText);
show_unit_properties.addEventListener('click', toggleShowUnitProperties);
show_defences.addEventListener('click', toggleShowDefences);
auto_bypass_errors.addEventListener('click', toggleAutoBypassErrors);
game_switcher.addEventListener('click', toggleGame);
display_alphabetically.addEventListener('click', toggleAlphabeticDisplay);
combine_units.addEventListener('click', toggleCombineUnits);
show_log_time.addEventListener('click', toggleLogTime);
time_style_switcher.addEventListener('click', toggleTimeStyleSwitch);
merge_perma.addEventListener('click', toggleMergePerma);
maximize.addEventListener('click', toggleOutputSize);

function clearAllText() {
    dead_unit_input.value = "";
    hospital_unit_input.value = "";
    output_box.value = "";
}

function toggleMergePerma() {
    if (merge_perma.checked) {
        merge_perma_enabled = true;
    } else {
        merge_perma_enabled = false;
    }
}

function toggleOutputSize() {
    if (output_box.rows < 17) {
        if (num_rows > 16) {
        output_box.rows = num_rows;
        maximize.textContent = "Shrink ⛶"
        }
    } else {
        output_box.rows = 16;
        maximize.textContent = "Expand ⛶"
    }
    
}

function toggleShowUnitProperties() {
    if (show_unit_properties.checked) {
        show_properties_enabled = true;
        game_selector_menu.classList.remove("gs-hidden");
        show_defences_text.classList.remove("su-disabled");
        show_defences.disabled = false;
    } else {
        show_properties_enabled = false;
        game_selector_menu.classList.add("gs-hidden");
        show_defences_text.classList.add("su-disabled");
        show_defences.disabled = true;
    }
}

function toggleLogTime() {
    if (show_log_time.checked) {
        show_time_enabled = true;
        if (display_alphabetically.checked) {
            time_style_switcher.classList.add("ts-disabled");
        } else {
            time_style_switcher.classList.remove("ts-disabled");
        }
    } else {
        show_time_enabled = false;
        time_style_switcher.classList.add("ts-disabled");
    }
}

function toggleTimeStyleSwitch() {
    switch(time_style) {
        case 0:
            time_style_switcher.textContent = "🕒 Time Style: Headers";
            time_style = 1;
            break;
        case 1:
        default:
            time_style_switcher.textContent = "🕒 Time Style: Alongside";
            time_style = 0;
            break;
    }
}

function toggleShowDefences() {
    if (show_defences.checked) {
        show_defences_enabled = true;
    } else {
        show_defences_enabled = false;
    }
}

function toggleAlphabeticDisplay() {
    if (display_alphabetically.checked) {
        alphabetic_sorting_enabled = true;
        time_style_switcher.classList.add("ts-disabled");
    } else {
        alphabetic_sorting_enabled = false;
        if (show_log_time.checked) {
            time_style_switcher.classList.remove("ts-disabled");
        } else {
            time_style_switcher.classList.add("ts-disabled");
        }
    }
}

function toggleAutoBypassErrors() {
    if (auto_bypass_errors.checked) {
        auto_bypass_errors_enabled = true;
    } else {
        auto_bypass_errors_enabled = false;
    }
}

function toggleCombineUnits() {
    if (combine_units.checked) {
        combine_units_enabled = true;
        merge_perma.disabled = true;
        merge_perma_text.classList.add("mpl-disabled");
    } else {
        combine_units_enabled = false;
        merge_perma.disabled = false;
        merge_perma_text.classList.remove("mpl-disabled");
    }
}

for (let i = 0; i < close_buttons.length; i++) { 
    close_buttons[i].addEventListener('click', hideWindowPopup);
}

function toggleTheme() {
    switch(is_dark_theme) {
        case true:
            theme_switcher.textContent = "Theme: Light ☀️";
            is_dark_theme = false;
            changeThemeLight();
            break;
        case false:
        default:
            theme_switcher.textContent = "Theme: Dark 🌙";
            is_dark_theme = true;
            changeThemeDark();
            break;
    }
}

function toggleGame() {
    info_unit_names = [];
    info_unit_tier = [];
    info_unit_power = [];
    info_unit_defense_status = [];

    switch(selected_game) {
        case 0:
            game_switcher.textContent = "Warhammer: Chaos and Conquest ⚔️";
            let encoded_json_war = $("encjson2");
            decoded_unit_json = atob(encoded_json_war.innerHTML);
            selected_game = 1;
            break;
        case 1:
            game_switcher.textContent = "Godzilla x Kong: Titan Chasers 🦖";
            let encoded_json_gxk = $("encjson3");
            decoded_unit_json = atob(encoded_json_gxk.innerHTML);
            selected_game = 2;
            break;
        case 2:
        default:
            game_switcher.textContent = "Operation: New Earth 🛸";
            encoded_json_one = $("encjson");
            decoded_unit_json = atob(encoded_json_one.innerHTML);
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
    css_root.style.setProperty('--button-bg', 'eeeeee');
    css_root.style.setProperty('--button-highlight', 'black');
    css_root.style.setProperty('--textarea-bg', '#e8e8e8');
    css_root.style.setProperty('--scrollbar-thumb', '#c9c9c9');
    css_root.style.setProperty('--scrollbar-thumb-hover', '#adadad');
    css_root.style.setProperty('--body-bg', 'whitesmoke');
    css_root.style.setProperty('--button-hover', '#e8e8e8');
    css_root.style.setProperty('--button-active', '#c9c9c9');
    css_root.style.setProperty('--textarea-active', '#f2f0ff');
    css_root.style.setProperty('--textarea-hover', 'rgba(0, 0, 0, 0.05)');
}

function changeThemeDark() {
    css_root.style.setProperty('--button-bg', '#131313');
    css_root.style.setProperty('--button-highlight', 'white');
    css_root.style.setProperty('--textarea-bg', '#111111');
    css_root.style.setProperty('--scrollbar-thumb', '#323232');
    css_root.style.setProperty('--scrollbar-thumb-hover', '#404040');
    css_root.style.setProperty('--body-bg', '#191919');
    css_root.style.setProperty('--button-hover', '#252525');
    css_root.style.setProperty('--button-active', '#505050');
    css_root.style.setProperty('--textarea-active', '#131219');
    css_root.style.setProperty('--textarea-hover', 'rgba(255, 255, 255, 0.05)');
}

function showWindowPopup(window, error_code = -1) {
    if (error_code > -1) {
        error_code_text.textContent = "Error Code " + error_code;

        switch(error_code) {
            case 0:
                error_message_content.innerHTML = "<b>Example error message</b><br<br>This should not show up during runtime<br>Send me a message if you see this, along with what you did";
                break;
            case 1:
                error_message_content.innerHTML = "<b>Negative perma-losses</b><br>Likely cause: too many hospital units - try re-copying logs";
                break;
            case 2:
                error_message_content.innerHTML = "<b>Empty output or incorrect formatting</b><br>Try enabling 'Also Show Defences' if there were only defence units killed";
                break;
        }
    }

    window.style.display = "block";
    css_root.style.setProperty('cursor', 'default');
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

    let line_terminator = "¬#`@";
    let unit_splitter = " x ";

    let dead_unit_data = extractRawText(dead_unit_text, "DEAD UNIT", "died", line_terminator);
    let split_dead_unit_data = splitTextIntoData(dead_unit_data, unit_splitter, line_terminator);
    let combined_dead_unit_data = combineCommonUnitTypes(split_dead_unit_data);

    let hospital_unit_data = extractRawText(hospital_unit_text, "HOSPITAL UNIT", "added", line_terminator);
    let split_hospital_unit_data = splitTextIntoData(hospital_unit_data, unit_splitter, line_terminator);
    let combined_hospital_unit_data = combineCommonUnitTypes(split_hospital_unit_data);

    let dead_units_sorted = sortUnitData(combined_dead_unit_data);
    let hospital_units_sorted = sortUnitData(combined_hospital_unit_data);

    /* Array copies are used to avoid incorrect (previously set) data being used after being sorted */

    let final_dead_units = JSON.parse(JSON.stringify(dead_units_sorted));
    let final_hospital_units = JSON.parse(JSON.stringify(hospital_units_sorted));

    let calculated_perma_losses = calculatePermaLosses(final_dead_units, final_hospital_units);

    let dead_unit_types = JSON.parse(JSON.stringify(dead_units_sorted[0]));
    let dead_unit_losses = JSON.parse(JSON.stringify(dead_units_sorted[1]));
    let dead_unit_times = JSON.parse(JSON.stringify(dead_units_sorted[2]));
    let dead_attached_ids = JSON.parse(JSON.stringify(dead_units_sorted[3]));

    let hospital_unit_types = JSON.parse(JSON.stringify(hospital_units_sorted[0]));
    let hospital_unit_losses = JSON.parse(JSON.stringify(hospital_units_sorted[1]));
    let hospital_unit_times = JSON.parse(JSON.stringify(hospital_units_sorted[2]));
    let hospital_attached_ids = JSON.parse(JSON.stringify(hospital_units_sorted[3]));

    let perma_unit_types = calculated_perma_losses[0];
    let perma_unit_losses = calculated_perma_losses[1];
    let perma_unit_times = calculated_perma_losses[2];
    let perma_attached_ids = calculated_perma_losses[3];

    let dead_unit_total = dead_unit_losses.reduce((partialSum, a) => partialSum + a, 0);
    let hospital_unit_total = hospital_unit_losses.reduce((partialSum, a) => partialSum + a, 0);
    let perma_unit_total = perma_unit_losses.reduce((partialSum, a) => partialSum + a, 0);

    for (i = 0; i < perma_unit_losses.length; i++) {
        if (perma_unit_losses[i] < 0) {
            units_are_invalid = true;
        }
    }

    if (!auto_bypass_errors_enabled) {
        if (dead_unit_total == 0) {
            showWindowPopup(error_message, 2);
            return;
        }
    }

    if (!auto_bypass_errors_enabled) {
        if (perma_unit_total < 0 || units_are_invalid) {
            showWindowPopup(error_message, 1);
            return;
        }
    }

    if (auto_bypass_errors_enabled) {
        output_text += "[ERRORS BYPASSED - THESE RESULTS ARE VERY LIKELY BROKEN OR INACCURATE]\n\n";
    }

    output_text += "Units Killed (Total: " + dead_unit_total.toLocaleString("en-US") +  "):\n\n";
    output_text += createUnitList(dead_unit_types, dead_unit_losses, dead_unit_times, 1, option_status, dead_attached_ids);

    if (hospital_unit_total > 0) {
        output_text += "\nSent to Hospital (Total: " + hospital_unit_total.toLocaleString("en-US") + "):\n\n";
        output_text += createUnitList(hospital_unit_types, hospital_unit_losses, hospital_unit_times, 1, option_status, hospital_attached_ids);
    }

    if (perma_unit_total > 0) {
        output_text += "\nMissing from Hospital Logs (Total: " + perma_unit_total.toLocaleString("en-US") + "):\n\n";
        output_text += createUnitList(perma_unit_types, perma_unit_losses, perma_unit_times, 1, option_status, perma_attached_ids, true);
    } else {
        output_text += "\nNo perma-losses recorded in attack ";
    }

    num_rows = output_text.split(/\r\n|\r|\n/).length - 1;
    line_counter.innerText = "Line count: " + (num_rows)

    fillOutput(output_text);
}

function fillOutput(output) {
    output_box.value = output.substring(0, output.length - 1);
}

function extractRawText(targetText, deadHospitalText, diedAddedText, terminator) {
    let target_text = targetText;
    let last_died_occurrence = target_text.lastIndexOf(diedAddedText);
    let substring_counter = 0;
    let substring_text = "";

    while (substring_counter < last_died_occurrence) {
        let substring_start = 0;
        let substring_end = 0;

        let time_substring = "";

        let next_dead_occurrence = "";
        next_dead_occurrence = target_text.indexOf(deadHospitalText.toLowerCase(), substring_counter);

        time_substring = targetText.substring(next_dead_occurrence, next_dead_occurrence - 9);

        substring_counter = next_dead_occurrence;
        substring_start = next_dead_occurrence + (deadHospitalText.length + 1);
        
        let next_died_occurrence = "";
        next_died_occurrence = target_text.indexOf(diedAddedText.toLowerCase(), substring_counter);

        substring_counter = next_died_occurrence;
        substring_end = next_died_occurrence - 1;

        substring_text += time_substring + " " + target_text.substring(substring_start, substring_end) + terminator + " \n";
    }
    
    let final_extracted_text = substring_text.replaceAll(",", "");

    return final_extracted_text;
}

function splitTextIntoData(targetText, unitSplitter, lineTerminator) {
    let target_text = ""; 
    let terminator = "";

    target_text = targetText;
    terminator = lineTerminator;

    let last_terminator_occurrence = target_text.lastIndexOf(terminator);
    let split_counter = 0;


    let uncombined_losses = [];
    let uncombined_types = [];
    let attack_times = [];
    let combined_array = [];
    

    while (split_counter < last_terminator_occurrence) {
        let time_split_start = 0;
        let time_split_end = 8;

        let lost_split_start = 0;
        let lost_split_end = 0;

        let type_split_start = 0;
        let type_split_end = 0;

        let log_time;

        // A very hacky way of ensuring left_split_start starts at zero initially, and then increments based on the last END reference
        if (split_counter > 1) {
            time_split_start = split_counter + (terminator.length + 2);
            time_split_end = time_split_start + 8;
        }

        let next_midpoint_occurrence = target_text.indexOf(unitSplitter, split_counter);
        let next_terminator_occurrence = target_text.indexOf(terminator, split_counter + 1);

        lost_split_start = time_split_end + 1;
        lost_split_end = next_midpoint_occurrence;

        if (split_counter <= (target_text.length - terminator.length)) {
            type_split_start = next_midpoint_occurrence + unitSplitter.length;
            type_split_end = next_terminator_occurrence;
        }

        split_counter = next_terminator_occurrence;

        if (split_counter <= (target_text.length - terminator.length)) {
            log_time = targetText.substring(time_split_start, time_split_end);
            attack_times.push(log_time);
        }

        let number_lost = target_text.substring(lost_split_start, lost_split_end);
        let unit_type = target_text.substring(type_split_start, type_split_end);

        uncombined_losses.push(parseInt(number_lost));
        uncombined_types.push(unit_type);
    }

    combined_array.push(uncombined_losses);
    combined_array.push(uncombined_types);
    combined_array.push(attack_times);

    return combined_array;
}

function combineCommonUnitTypes(uncombinedUnitData) {
    let uncombined_losses = [];
    let uncombined_types = [];
    let attack_times = [];

    uncombined_losses = JSON.parse(JSON.stringify(uncombinedUnitData[0]));
    uncombined_types = JSON.parse(JSON.stringify(uncombinedUnitData[1]));
    attack_times = JSON.parse(JSON.stringify(uncombinedUnitData[2]));

    let losses = [];
    let types = [];
    let times = [];

    let overall = [];

    let checked = [];
    let running_total = 0;
    let current_type = "";
    let current_time = "";

    if (combine_units_enabled) {
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
            current_time = attack_times[i];

            for (var j = i; j < uncombined_losses.length; j++) {
                if (uncombined_types[i] == uncombined_types[j + 1]) {
                    current_type = uncombined_types[j + 1];
                    running_total += uncombined_losses[j + 1];
                    checked[j + 1] = true;
                }
            }

            losses.push(running_total);
            types.push(current_type);
            times.push(current_time);
            running_total = 0;
        }
    } else {
        losses = JSON.parse(JSON.stringify(uncombined_losses));
        types = JSON.parse(JSON.stringify(uncombined_types));
        times = JSON.parse(JSON.stringify(attack_times));
    }

    overall.push(losses);
    overall.push(types);
    overall.push(times);

    return overall;
}

function sortUnitData(unsortedUnitData) { 
    let losses = [];
    let units = [];
    let times = [];

    input_losses = structuredClone(unsortedUnitData[0]);
    input_units = structuredClone(unsortedUnitData[1]);
    input_times = structuredClone(unsortedUnitData[2]);

    let unit_list = [];
    let recombined_data = [];
    let id_list = [];

    for (var i = 0; i < input_losses.length; i++) {
        unit_list.push({'unit_name': input_units[i], 'units_lost': input_losses[i], 'attack_time': input_times[i]});
    }

    if (alphabetic_sorting_enabled) {
        unit_list.sort(function(a, b) {
            return a.unit_name.localeCompare(b.unit_name);
        });
    }

    for (var i = 0; i < unit_list.length; i++) {
        losses[i] = unit_list[i].unit_name;
        units[i] = unit_list[i].units_lost;
        times[i] = unit_list[i].attack_time;
    }

    recombined_data.push(losses);
    recombined_data.push(units);
    recombined_data.push(times);

    for (var i = 0; i < losses.length; i++) {
        for (var j = 0; j < info_unit_names.length; j++) {
            if (losses[i] == info_unit_names[j]) id_list.push(j);
            
            continue;
        }
    }
    
    recombined_data.push(id_list);

    if (!show_defences_enabled && show_properties_enabled) {
        for (var i = 0; i < recombined_data[0].length; i++) {
            for (var j = 0; j < info_unit_defense_status.length; j++) {
                if (recombined_data[0][i] == info_unit_names[j] && info_unit_defense_status[j] == true) {
                    recombined_data[0].splice(i, 1);
                    recombined_data[1].splice(i, 1);
                    recombined_data[2].splice(i, 1);
                    recombined_data[3].splice(i, 1);
                    j = 0;
                }
            }
        }
    }

    return recombined_data;
}

function calculatePermaLosses(deadData, hospitalData) {
    let dead_data = structuredClone(deadData);
    let hospital_data = structuredClone(hospitalData);

    if (combine_units_enabled) {
        for (var i = 0; i < dead_data[0].length; i++) {
            for (var j = 0; j < hospital_data[0].length; j++) {
                if (dead_data[0][i] == hospital_data[0][j]) {
                    dead_data[1][i] -= hospital_data[1][j];
                }
            }
        }

        // remove entries with zero losses
        for (let i = dead_data[0].length - 1; i >= 0; i--) {
            if (dead_data[1][i] === 0) {
                dead_data[0].splice(i, 1);
                dead_data[1].splice(i, 1);
                dead_data[2].splice(i, 1);
                dead_data[3].splice(i, 1);
            }
        }

        return dead_data;
    
    } else {
        for (let j = 0; j < hospital_data[0].length; j++) {
            let hospital_unit = hospital_data[0][j];
            let hospital_count = hospital_data[1][j];
            let hospital_time = hospital_data[2][j];

            // find all matching dead unit indexes
            let matching_indexes = [];
            for (let i = 0; i < dead_data[0].length; i++) {
                if (!merge_perma_enabled) {
                    if (dead_data[0][i] === hospital_unit && dead_data[2][i] === hospital_time) {
                    matching_indexes.push(i);
                    }
                } else {
                    if (dead_data[0][i] === hospital_unit) {
                    matching_indexes.push(i);
                    }
                }
            }

            let remaining_hospital_units = hospital_count;

            let total_dead_for_unit = matching_indexes.reduce((sum, i) => sum + dead_data[1][i], 0);
            if (total_dead_for_unit === 0) continue;

            for (let i of matching_indexes) {
                if (remaining_hospital_units <= 0) break; // no more hospital units to subtract

                if (dead_data[1][i] <= remaining_hospital_units) {
                    // subtract all dead units at i
                    remaining_hospital_units -= dead_data[1][i];
                    dead_data[1][i] = 0;
                } else {
                    // subtract only part of dead units at i
                    dead_data[1][i] -= remaining_hospital_units;
                    remaining_hospital_units = 0;
                }
            }
        }

        // remove entries with zero losses
        for (let i = dead_data[0].length - 1; i >= 0; i--) {
            if (dead_data[1][i] === 0) {
                dead_data[0].splice(i, 1);
                dead_data[1].splice(i, 1);
                dead_data[2].splice(i, 1);
                dead_data[3].splice(i, 1);
            }
        }

        return dead_data;
    }
}

function createUnitList(types, losses, times = null, multiply_modifier, display_status, info_ids = null, perma = false) {
    let text = "";
    let loop_length = types.length;
    let total_combined_power = 0;
    let attack_no = 1;
    let current_time = "";

    for (var i = 0; i < loop_length; i++) {
        let unit_types = types[i];
        let time = times[i];
        let unit_losses = Math.trunc(losses[i] * multiply_modifier).toLocaleString("en-US");
        let unit_tier;

        if (display_status == 1) {
            unit_tier = info_unit_tier[info_ids[i]];

            let combined_power = info_unit_power[info_ids[i]] * Math.trunc(losses[i] * multiply_modifier);
            total_combined_power += combined_power;
        }

        if (!perma && show_time_enabled && time_style == 1 || !combine_units_enabled && show_time_enabled && time_style == 1) {
            if (current_time.toString() != time.toString()) {
                if (attack_no != 1) {text += "\n\n"}
                text += "Attack " + attack_no + " @ " + time + ":\n";
                
                current_time = time;
                attack_no += 1;
            }
        }

        if (display_status == 1) {
            if (!perma && show_time_enabled && time_style == 0 || !combine_units_enabled && show_time_enabled && time_style == 0) { text += "[" + time + "] "; }
            text +=  "[T" + unit_tier + "] " + unit_types + " x " + unit_losses + "\n";
        } else {
            if (!perma && show_time_enabled && time_style == 0 || !combine_units_enabled && show_time_enabled && time_style == 0)  { text += "[" + time + "] "; }
            text += unit_types + " x " + unit_losses + "\n";
        }

        combined_power = 0;
    }

    if (display_status == 1 && perma) {
        text +="\nEstimated Power Lost: " + total_combined_power.toLocaleString("en-US") + "\n";
    }

    return text;
}