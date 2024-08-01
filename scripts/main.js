encoded_json_one = document.getElementById("encjson");
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

process_button.addEventListener('click', processData);

function processData() {
    option_status = 0;

    if (show_properties_enabled) {
        option_status = 1;
    }

    let output_text = "";

    let units_are_invalid = false;

    let dead_unit_text = dead_unit_input.value;
    let hospital_unit_text = hospital_unit_input.value;

    let extract_start = "DEAD UNIT";
    let extract_end = "died";
    let quantity_separator = " x ";
    let line_terminator = "--END";

    let dead_unit_data = extractRawText(dead_unit_text, extract_start, extract_end, line_terminator);
    let split_dead_unit_data = splitTextIntoData(dead_unit_data, quantity_separator, line_terminator);
    let combined_dead_unit_data = combineCommonUnitTypes(split_dead_unit_data);

    let extract_start_hospital = "HOSPITAL UNIT";
    let extract_end_hospital = "added";

    let hospital_unit_data = extractRawText(hospital_unit_text, extract_start_hospital, extract_end_hospital, line_terminator);
    let split_hospital_unit_data = splitTextIntoData(hospital_unit_data, quantity_separator, line_terminator);
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

    output_text += "Dead Units -- " + dead_unit_total.toLocaleString("en-US") +  ":\n\n";
    output_text += createUnitList(dead_unit_types, dead_unit_losses, 1, option_status, dead_attached_ids);

    if (hospital_unit_total > 0) {
        output_text += "\nHospital Units -- " + hospital_unit_total.toLocaleString("en-US") + ":\n\n";
        output_text += createUnitList(hospital_unit_types, hospital_unit_losses, 1, option_status, hospital_attached_ids);
    }

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

function splitTextIntoData(targetText, quantity_separator, terminator) {
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

        let next_midpoint_occurrence = target_text.indexOf(quantity_separator, split_counter);
        let next_terminator_occurrence = target_text.indexOf(terminator, split_counter + 1);

        left_split_end = next_midpoint_occurrence;

        right_split_start = next_midpoint_occurrence + quantity_separator.length;
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
    let raw_losses = uncombinedUnitData[0];
    let raw_types = uncombinedUnitData[1];

    let combined_losses = [];
    let combined_types = [];
    let master_combined_array = [];

    let index_checked = [];
    let losses_running_total = 0;
    let currently_selected_type = "";

    for (var i = 0; i < raw_losses.length; i++) {
        index_checked[i] = false;
    }

    for (var i = 0; i < raw_losses.length; i++) {
        // losses_running_total must start from i as initial reference but never use it afterwards
        losses_running_total += raw_losses[i];

        if (index_checked[i] == true) {
            losses_running_total = 0;
            continue;
        }

        // only runs through as current_type if standalone (ie. the only line of losses of that specific unit)
        currently_selected_type = raw_types[i];

        for (var j = i; j < raw_losses.length; j++) {
            if (raw_types[i] == raw_types[j + 1]) {
                currently_selected_type = raw_types[j + 1];
                losses_running_total += raw_losses[j + 1];
                index_checked[j + 1] = true;
            }
        }

        combined_losses.push(losses_running_total);
        combined_types.push(currently_selected_type);
        losses_running_total = 0;
    }

    master_combined_array.push(combined_losses);
    master_combined_array.push(combined_types);

    return master_combined_array;
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
    let final_output = "";
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
            final_output += "[T" + unit_tier + "] " + unit_types + " x " + unit_losses + "\n";
        } else {
            final_output += unit_types + " x " + unit_losses + "\n";
        }

        combined_power = 0;
    }

    if (display_status == 1 && perma) {
        final_output +="\nEstimated Power Lost: " + total_combined_power.toLocaleString("en-US") + "\n";
    }

    return final_output;
}

function fillOutput(output) {
    output_box.value = output.substring(0, output.length - 1);
}