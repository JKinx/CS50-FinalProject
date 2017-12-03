// hold truth conditions for address inputs
var holder = [];

// initialize 0 AND c with false
holder[0] = false;
var second = false;

// number of waypoints
var waypoints=0;

label_input1 = '<label class="control-label">Place Found</label>'
label_input2 = '<span class="form-control-feedback"><i class="material-icons">done</i></span>'

label_input3 = '<label class="control-label">Place Not Available. Please select from the option displayed</label>'
label_input4 = '<span class="form-control-feedback"><i class="material-icons">clear</i></span>'

// return text input html for waypoints
function insert_textinput(index) {
    var text_input = '<div class="input-group"><span class="input-group-addon"><i class="material-icons">place</i></span><div class="form-group is-empty" id="div"><input type="text" class="form-control" id=index placeholder="Address" onFocus="geolocate(this.id)" placeholder="Place Name..."><input type="hidden" id="hidden"></div></div>';

    return text_input
}

// perfrom appropriate actions on user input into address boxes
function fillInAddress(name) {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();

    // if invalid address
    if (!place.geometry){

        divID = name.concat("_div");
        $(divID).prop('class', "form-group label-floating has-danger");
        $(divID).find('label').remove(".control-label");
        $(divID).find('span').remove(".form-control-feedback");             
        $(divID).prepend(label_input3);
        $(divID).append(label_input4);


        if (name == "#c"){
            second = false;
        }

        else {
            index = parseInt(name.replace("#",""))
            holder[index] = false;
        }

        $(name).val('');    
    }

    // valid address
    else {
    
        divID = name.concat("_div");
        $(divID).find('label').remove(".control-label");
        $(divID).find('span').remove(".form-control-feedback");
        $(divID).prop('class', "form-group label-floating has-success");
        $(divID).prepend(label_input1);
        $(divID).append(label_input2);

        if (name == "#c"){
            second = true;
        }
        else {
            index = parseInt(name.replace("#",""))
            holder[index] = true;
        }

        $(name).val(place.place_id);
    }

}

// if address input in starting place
function done() {
    fillInAddress("#0");
    if($("#first-last").is(':checked')) {
        $("#c_input").val($("#0_input").val());
        $("#c").val($("#0").val());
        second = holder[0];
    }
}

// Call Google Maps Autolocate API on user input and do necessary actions
function geolocate(field_name) {
    
    var input = document.getElementById(field_name);
    var options = {
      types: ['geocode']
    };

    autocomplete = new google.maps.places.Autocomplete(input, options);

    input_id = "#".concat(field_name).replace('_input', '');

    if(field_name == "0_input") {
        autocomplete.addListener('place_changed', done);
    }
    else {
        autocomplete.addListener('place_changed', fillInAddress.bind(null, input_id));
    }
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        autocomplete.setBounds(circle.getBounds());
      });
    }
}

// display address fields on selecting number of waypoints
function display_field(el){

    // get number selected
    var value = parseInt(el.options[el.selectedIndex].value);

    //change state variables
    $('#waypoints').val(value)
    holder.splice(1,waypoints);
    waypoints = value;

    // remove previous fields and insert new
    $('#waypoints_holder').empty()

    for (var i = 1; i < value + 1; i++){
        
        holder[i] = false;

        $('#waypoints_holder').append(insert_textinput(i));
        $("#hidden").attr("name", i);
        $("#hidden").attr("id", i);

        textInputID = i.toString().concat("_input");
        $("#index").attr("id", textInputID);

        divID = i.toString().concat("_div");
        $("#div").attr("id", divID);
    }    
}

// event listeners
$(document).ready(function () {

    // on changing toggle button
    $("#first-last").on('change', function (){
            
            // if toggle checked
            if ($(this).is(':checked')){
                second = holder[0]; 

                $("#c_div").prop('class', "form-group");
                $("#c_div").find('label').remove(".control-label");
                $("#c_div").find('span').remove(".form-control-feedback"); 

                $("#c_input").prop('disabled', true);
                $("#c").prop('disabled', true);
                $("#c_input").val($("#0_input").val());
                $("#c").val($("#0").val());
            }

            // if toggle unchecked
            else {
                $("#c_input").prop('disabled', false);
                $("#c").prop('disabled', false);

                if(holder[0]) {
                    $("#c_div").prop('class', "form-group label-floating has-success");
                    $("#c_div").find('label').remove(".control-label");
                    $("#c_div").find('span').remove(".form-control-feedback");              
                    $("#c_div").prepend(label_input1);
                    $("#c_div").append(label_input2);
                }
                else {
                    $("#c_div").prop('class', "form-group label-floating has-danger");
                    $("#c_div").find('label').remove(".control-label");
                    $("#c_div").find('span').remove(".form-control-feedback");              
                    $("#c_div").prepend(label_input3);
                    $("#c_div").append(label_input4);
                }

            }
    });

    // prevent form submit on pressing enter key
    $(window).keydown(function(event){
        if(event.keyCode == 13) {
          event.preventDefault();
          return false;
        }
    });
 
    $("#form").submit( function (event) {   
        check = $.inArray(false,holder);
        
        // check if valid addresses were entered before submitting from
        if( check == -1 && second)
        {
            return true;
        }

        // prevent form submit if invalid address(es) present, scroll to the part of the form with the invalid input and return false
        else{
            if(check == -1){
                input_id = "#c_div";
            }
            else {
                if(check > 0 && second == false){
                    input_id = "#c_div";
                }
                else {
                    input_id = "#".concat($.inArray(false,holder)).concat("_div");
                }
            }

            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: ($(input_id).offset().top - 350)
            }, 5);
            return false;
        }
    })
})