(function(){
  var documentElem = $(document),
    header = $('head'),
    lastScrollTop = 0;

    documentElem.on('scroll', function(){
      var currentScrollTop = $(this).scrollTop();

      if(currentScrollTop > lastScrollTop ) header.addClass('hidden');

      else header.removeClass('hidden');

      lastScrollTop = currentScrollTop
    })

})

function validateForm() {
    var x = document.forms["SM-myForm"]["SM-mForm"].value;
    if (x == null || x == "") {
        alert("All the input fields with the * need to be filled out!");
        return false;
    }
}
