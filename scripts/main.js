let dead_unit_input = document.getElementById("dead-units");
let hospital_unit_input = document.getElementById("hospital-units");
let output_box = document.getElementById("output");
let process_button = document.getElementById("process");
let adjust_percentage_checkbox = document.getElementById("adjust-percentage-checkbox");
let percentage_textbox = document.getElementById("percentage-textbox");

adjust_percentage_checkbox.addEventListener('change', togglePercentageAdjustment)
process_button.addEventListener('click', processData);

function togglePercentageAdjustment() {
    if (!adjust_percentage_checkbox.checked) {
        percentage_textbox.disabled = true;
        return
    }

    percentage_textbox.disabled = false;
}

function processData() {
    let dead_unit_text = dead_unit_input.value;
    let hospital_unit_text = hospital_unit_input.value;

    let terminator = "END";
    let midpoint = " x ";

    let dead_unit_data = extractRawText(dead_unit_text, "DEAD UNIT", "died", terminator);
    let split_dead_unit_data = splitTextIntoData(dead_unit_data, midpoint, terminator);
    let combined_dead_unit_data = combineCommonUnitTypes(split_dead_unit_data);

    let hospital_unit_data = extractRawText(hospital_unit_text, "HOSPITAL UNIT", "added", terminator);
    let split_hospital_unit_data = splitTextIntoData(hospital_unit_data, midpoint, terminator);
    let combined_hospital_unit_data = combineCommonUnitTypes(split_hospital_unit_data);

    let dead_unit_losses = combined_dead_unit_data[0];
    let dead_unit_types = combined_dead_unit_data[1];    

    let hospital_unit_losses = combined_hospital_unit_data[0];
    let hospital_unit_types = combined_hospital_unit_data[1];

    let output_text = "";

    /* for applying percentage later
    for (var i = 0; i < types.length; i++) {
        losses[i] = Math.trunc(losses[i] * 0.3);
    }
    */
   
    for (var i = 0; i < dead_unit_types.length; i++) {
        output_text += dead_unit_types[i] + " x " + dead_unit_losses[i].toLocaleString("en-US") + "\n";
    }

    output_text += "\n";

    for (var i = 0; i < hospital_unit_types.length; i++) {
        output_text += hospital_unit_types[i] + " x " + hospital_unit_losses[i].toLocaleString("en-US") + "\n";
    }

    fillOutput(output_text);
}

function fillOutput(output) {
    output_box.value = output;
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

function parseJSON(json) {
    var obj;
    if (!isJSON(json)) {
        console.log(isJSON(json))
        alert("Invalid JSON")
        return
    }

    obj = JSON.parse(json);

    return obj;
}

function isJSON(data) {
    try {
        JSON.parse(data);
    } catch (e) {
        return false;
    }
    return true;
}