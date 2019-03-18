var $ = jQuery.noConflict();

const Converter = ucumPkg.UcumLhcUtils.getInstance();

const unistByCategory = [
    {
        categoryID: 1, //Category value = "1"
        units: [
            {
                name: 'Meter [m]',
                code: "m",
            },
            {
                name: 'Centimeter [cm]',
                code: "cm",
            }
        ]
    },
    {
        categoryID: 2, //Category value = "2"
        units: [
            {
                name: 'Kilogram [kg]',
                code: "kg",
            },
            {
                name: 'Gram [g]',
                code: "g",
            },
            {
                name: 'Pounds [lb]',
                code: "[lb_av]",
            }
        ]
    }
];

$(document).ready(function () {

    var unitsCategories = $('#unitsCategories'),
        unitsList = $('.unitsType'),
        inputFields = $('.inputFields'),

        unitsTypeLeft = $('#unitsTypeLeft'),
        unitsTypeRight = $('#unitsTypeRight'),

        inputLeft = $('#inputLeft'),
        inputRight = $('#inputRight');

    //Populate units by selected category
    unitsCategories.on('change', function () {

        var _this = $(this),
            catValue = _this.val();

        if (!catValue || catValue === '' || catValue === 0) {
            alert('Category is not supported with value: ' + catValue);
            return;
        }

        //reset fields
        inputFields.removeAttr('disabled');
        inputFields.val('0');
        unitsList.empty();

        //find fields of selected category
        var selectedCategory = unistByCategory.filter(obj => {
            return obj.categoryID === parseInt(catValue)
        });

        if (!selectedCategory || selectedCategory.length <= 0) {
            alert("No units found within this category!");
            return;
        }

        selectedCategory[0].units.forEach(function (el, index) {
            //append units for this category
            var option = '<option value="' + el.code + '">' + el.name + '</option>';
            unitsList.append(option);
        });
    });

    //Conversion Left
    inputLeft.on('keyup', function () {

        var value = this.value;

        if (!value || value === '') {
            inputFields.val('0');
            return;
        }

        var fromUnit = $(unitsTypeLeft).children("option:selected").val();
        var toUnit = $(unitsTypeRight).children("option:selected").val();
        unitConvert('right', fromUnit, value, toUnit);

    });

    //Conversion Right
    inputRight.on('keyup', function () {

        var value = this.value;

        if (!value || value === '') {
            inputFields.val('0');
            return;
        }

        var fromUnit = $(unitsTypeRight).children("option:selected").val();
        var toUnit = $(unitsTypeLeft).children("option:selected").val();

        unitConvert('left', fromUnit, value, toUnit);

    });


    /*
    * side: the input to be filled
    * fromUnit: unit code to convert from
    * value: input value for conversion
    * toUnit: unit code to convert to
    * */
    function unitConvert(side, from, value, to) {

        var setValueTo = null;

        if (side === 'left') {
            setValueTo = inputLeft;
        } else if (side === 'right') {
            setValueTo = inputRight;
        } else {
            alert('Side not specified');
            return;
        }

        var result = Converter.convertUnitTo(from, value, to, false);

        if (result.status === "error") {
            alert("Unknown unit type for conversion");
            return;
        }

        setValueTo.val(result.toVal);
    }
});
