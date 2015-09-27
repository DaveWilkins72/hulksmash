function validateForm() {
    var x = document.forms["SM-myForm"]["SM-mForm"].value;
    if (x == null || x == "") {
        alert("All the input fields with the * need to be filled out!");
        return false;
    }
}
