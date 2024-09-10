/* 

-- EVENT LISTENERS --

Attaches event listeners of any kind (mostly clicks) to each necessary element.

Some of these may set a boolean variable, whilst others may utilising generic functions [i.e. showWindowPopup()]

*/

copy_output.addEventListener('click', copyToClipboard);
theme_switcher.addEventListener('click', toggleTheme);
clear_textboxes.addEventListener('click', clearAllText);
toggle_unit_properties.addEventListener('click', function() {show_properties_enabled = toggleGenericOptionElement(show_properties_enabled, toggle_unit_properties, true, game_switcher)});
toggle_defences.addEventListener('click', function() {show_defences_enabled = toggleGenericOptionElement(show_defences_enabled, toggle_defences, false)});
toggle_error_bypass.addEventListener('click', function() {auto_bypass_errors_enabled = toggleGenericOptionElement(auto_bypass_errors_enabled, toggle_error_bypass, false)});
game_switcher.addEventListener('change', function() {changeGame(game_switcher)});
custom_parameters.addEventListener('click', function() {showWindowPopup(custom_parameter_window)});
table_view.addEventListener('click', function() {showWindowPopup(table_view_window)});


for (let i = 0; i < close_buttons.length; i++) { 
    close_buttons[i].addEventListener('click', hideWindowPopup);
}

/* 

-- GENERIC FUNCTIONS --

These are functions that can be used multiple times for different purposes, usually for elements that are visually identical but functionally different.

------------------------------

toggleGenericOptionElement():

    -Required-
    target_option: designated boolean value for the desired option
    option_button: targeted option button, from the sidebar
    target_is_toggleable: true if option toggles another element (i.e. related textbox)

    -Optional-
    target_element: specified element to set to active/inactive if target_is_toggleable is true

*/
function toggleGenericOptionElement(target_option, option_button, target_is_toggleable, target_element) {
    if (!target_is_toggleable) {
        if (!target_option) {
            updateToggleButton(option_button, true);
            return true;
        } else {
            updateToggleButton(option_button, false);
            return false;
        }
    } else {
        if (!target_option) {
            updateToggleButton(option_button, true);
            target_element.disabled = false;
            target_element.nextElementSibling.classList.remove("gs-disabled");
            return true;
        } else {
            updateToggleButton(option_button, false);
            target_element.disabled = true;
            target_element.nextElementSibling.classList.add("gs-disabled");
            return false;
        }   
    }
    
}

/*

showWindowPopup():

    -Required-
    window: designated parent element for relevant HTML window element structure

    -Optional-
    error_code: defaults to -1 (regular window), any higher specified number designates an error & relevant prompt

*/

function showWindowPopup(window, error_code = -1) {
    if (error_code > -1) {
        error_code_text.textContent = "Error Code " + error_code + " ⚠";

        switch(error_code) {
            case 0:
                error_message_content.innerHTML = "<b>Example error message</b><br<br>This should not show up during runtime<br><br>Send me a message if you see this, along with what you did";
                break;
            case 1:
                error_message_content.innerHTML = "<b>Negative perma-losses</b><br><br>Likely cause: too many hospital units - try re-copying logs";
                break;
            case 2:
                error_message_content.innerHTML = "<b>Empty output or incorrect formatting</b><br><br>Try enabling 'Also Show Defences' if there were only defence units killed";
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

/* 

-- REGULAR FUNCTIONS --

Single use-case functions that cannot have shared uses like the generic ones

*/

function changeGame(game) {
    info_unit_names = [];
    info_unit_tier = [];
    info_unit_power = [];
    info_unit_defense_status = [];

    switch(game.seletedIndex) {
        case 0:
        default:
            let encoded_json_war = document.getElementById("encjson");
            decoded_unit_json = atob(encoded_json_war.innerHTML);
            selected_game = 1;
            break;
        case 1:
            let encoded_json_gxk = document.getElementById("encjson2");
            decoded_unit_json = atob(encoded_json_gxk.innerHTML);
            selected_game = 2;
            break;
        case 2:
            encoded_json_one = document.getElementById("encjson3");
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

function changeThemeDark() {
    css_root_element.style.setProperty('--button-bg', '#131313');
    css_root_element.style.setProperty('--button-highlight', 'white');
    css_root_element.style.setProperty('--textarea-bg', '#111111');
    css_root_element.style.setProperty('--scrollbar-thumb', '#323232');
    css_root_element.style.setProperty('--scrollbar-thumb-hover', '#404040');
    css_root_element.style.setProperty('--body-bg-top', '#202020');
    css_root_element.style.setProperty('--body-bg', '#151515');
    css_root_element.style.setProperty('--button-hover', '#252525');
    css_root_element.style.setProperty('--button-active', '#505050');
}

function changeThemeLight() {
    css_root_element.style.setProperty('--button-bg', 'eeeeee');
    css_root_element.style.setProperty('--button-highlight', 'black');
    css_root_element.style.setProperty('--textarea-bg', '#e8e8e8');
    css_root_element.style.setProperty('--scrollbar-thumb', '#c9c9c9');
    css_root_element.style.setProperty('--scrollbar-thumb-hover', '#adadad');
    css_root_element.style.setProperty('--body-bg-top', 'white');
    css_root_element.style.setProperty('--body-bg', 'whitesmoke');
    css_root_element.style.setProperty('--button-hover', '#e8e8e8');
    css_root_element.style.setProperty('--button-active', '#c9c9c9');
}

function clearAllText() {
    dead_unit_input.value = "";
    hospital_unit_input.value = "";
    output_box.value = "";
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
        return;
    }

    options_box.classList.remove("options-toggle");
}

function togglePercentageAdjustment() {
    if (!adjust_percentage_checkbox.checked) {
        percentage_textbox.disabled = true;
        return;
    }

    percentage_textbox.disabled = false;
}

function toggleTheme() {
    switch(is_dark_theme) {
        case true:
            theme_switcher.textContent = "Theming: Light ☀️";
            is_dark_theme = false;
            changeThemeLight();
            break;
        case false:
        default:
            theme_switcher.textContent = "Theming: Dark 🌙";
            is_dark_theme = true;
            changeThemeDark();
            break;
    }
}

function updateHospitalCapacity() {
    hospital_capacity.textContent = "Hospital Capacity: " + Number(new_hospital_capacity.value).toLocaleString("en-US");
}

function updateReturnPercentage() {
    return_percentage.textContent = "Return Percentage: " + Number(new_return_percentage.value) + "%";

    percentage_modifier = new_return_percentage.value / 100;
}

function updateToggleButton(button, is_enabled) {
    if (is_enabled) {
        button.classList.add("disable-toggle");
        button.textContent = "–";
        button.nextElementSibling.style.fontWeight = "bold";
    } else {
        button.classList.remove("disable-toggle");
        button.textContent = "+";
        button.nextElementSibling.style.fontWeight = "normal";
    }
}