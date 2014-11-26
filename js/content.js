(function(window){
  /**
   * Initialize Top Bar.
   */
  function topBarTrelloInit() {
    var HTMLmarkup = '<div class="top-bar"><ul>';
    var hidden_list_id = 0;
    // Get all lists on board:
    $('#board .list').each(function () {
      var name = $(this).find('.list-header-name').html();
      if (name) {
        // Mark necessary elements:
        $(this).addClass('show-list').removeClass('hide-list').append('<div class="list-id" id="' + hidden_list_id + '"></div>');
        // Create HTML list:
        HTMLmarkup += '<li><span class="top-bar-tab show-list"><span ' +
          'class="name">&#8226; ' + name + '</span><div ' +
          'class="list-id" id="' + hidden_list_id + '"></div></span></li>';
        hidden_list_id++;
        //TODO: Use HTML5 data properties instead of spans.
      }
    });
    HTMLmarkup += '</ul></div>';

    // Insert Top Bar into DOM:
    $('.top-bar').remove();
    $('.board-header').append(HTMLmarkup);

    // Top Bar click reaction:
    $('.top-bar-tab').click(function () {
      toggleList($(this));
    });
  }

  /**
   * Decide should we show or hide List:
   */
  function toggleList($element) {
    var id = $element.find('.list-id').attr('id');
    var $list = $('#board .list').find('#' +id).parent('.list');
    var $tab = $('.top-bar-tab').find('#' +id).parents('.top-bar-tab');
    if ($list.hasClass('show-list')) {
      // Hide
      $list.addClass('hide-list').removeClass('show-list').hide();
      $tab.addClass('hide-list').removeClass('show-list');
    } else {
      // Show
      $list.addClass('show-list').removeClass('hide-list').show();
      $tab.addClass('show-list').removeClass('hide-list');
    }
  }
  // Attach initialization to onLoad event.
  if(window.addEventListener) {
    window.addEventListener("load", function() { topBarTrelloInit(); } ,false);
  }
}) (window);
