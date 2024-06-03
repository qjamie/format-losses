## An interface to output combined quantities

Default functionality allows **Dead Units** and **Hospital Units** to be combined to create a comprehensive list of what was lost, saving minutes and potentially hours of tedious calculations

This works by extracting substrings from attack logs into the format `number_of_units_lost x unit_name`, removing any defensive units that might interfere with final counts

Advanced options, whilst currently limited, allow the user to display more information alongside units. This can be hit-or-miss sometimes, especially with game updates

## Plans for the future

A few previously planned features were omitted for the full release, which will be added later. These are:

- Support for comparison against 'current hospital units'
- The above feature will also facilitate the use of a 'hospital cap' feature, which is currently hidden
- Customisable parameters, drastically improving the tool's versatility beyond just unit calculations
- Preset ordering and the ability to prioritise the return percentage of specific units
- Full rewrite of the code to make it more readable and maintanable
