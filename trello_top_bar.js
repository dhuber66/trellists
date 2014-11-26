$(function(){

  buildTopBar();
  
  //setTimeout(buildTopBar,2000);
	
  
  /* Actions */
  
  // We need to disable new List creation window:
	$('.top-bar').dblclick(function (e) {
    e.stopPropagation();
  });

  // Top Bar double click reaction:
	$('.top-bar-tab').dblclick(function () {
    toggleList($(this));
  });


  
  // Reaction on double click on icon in List:
	$('.list-area .list').dblclick(function () {
    toggleList($(this));
  });

});





function buildTopBar() {
  
  var HTMLmarkup = '<div class="top-bar"><ul>';
  var hidden_list_id = 0;
  // Get all lists on board:
	$('.list-area .list').each(function () {
    // Mark necessary elements:
    $(this).addClass('show-list').removeClass('hide-list').append('<div class="list-id" id="' + hidden_list_id + '"></div>');    
    // Create HTML list:
    HTMLmarkup += '<li><span class="top-bar-tab show-list"><span class="app-icon small-icon list-icon"></span><span ' +
      'class="name">' + $(this).find('.list-title h2').text() + '</span><div ' + 
      'class="list-id" id="' + hidden_list_id + '"></div></span></li>';
    hidden_list_id++;
	});
  HTMLmarkup += '</ul></div>';
  // Insert Top Bar into DOM:
  $('.top-bar').remove();
  $('.list-area').before(HTMLmarkup);
}





// Decide should we show or hide List:
function toggleList($element) {
  var id = $element.find('.list-id').attr('id');
  var $list = $('.list-area .list').find('#' +id).parent('.list');
  var $tab = $('.top-bar-tab').find('#' +id).parents('.top-bar-tab');
  if ($list.hasClass('show-list')) {
    // Hide
    $list.addClass('hide-list').removeClass('show-list').hide();
    $tab.addClass('hide-list').removeClass('show-list');
    //alert ('hide '+ id);
  } else {
    // Show
    $list.addClass('show-list').removeClass('hide-list').show();
    $tab.addClass('show-list').removeClass('hide-list');
    //alert ('show ' + id);
  }
}
