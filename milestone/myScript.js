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
