// TODO: store state of Lists in LocalStorage.
// TODO: add a 'Show all' button.

(function() {

  // Insert bar placeholder to header.
  // Custom jQuery plugin was used to wait while required DOM-element will be created.
  $('.board-header').waitUntilExists(function() {
    $('<ul/>').attr('id', 'trellists').appendTo('.board-header');
  });
  
  // Trello.com loads lists after whole page loaded and DOM is ready so we need to 
  // wait for some DOM-elements appear on page and then react on this change.

  // Update Tabs on List insert/archive/remove.
  $('#board .list form .js-open-add-list').waitUntilExists(function() {
    buildTabs();
  });

  // Update  list name on change. Already optimized.
  $('.list h2.list-header-name').waitUntilExists(function() {
    $('.list h2.list-header-name').bind('DOMSubtreeModified', function() {
      // Somehow List title could be empty and we need to pass by this case.
      // Compare old title and new one to run only on title change but not subtree changes or etc.
      if ($(this).text() && $(this).text() != $(this).parent().parent().attr('data-list-name')) {
        buildTabs();
      }
    });
  });

  // Update on List's drag-n-drop movements.
  $('#board .placeholder').waitUntilExists(function() {
    $('#board .placeholder').bind('DOMNodeRemovedFromDocument', function(e) {
      buildTabs();
    });
  });

  /**
   * Build Top Bar which shows titles of existing lists.
   * Each time new list created ate page we rebuild top bar.
   */
  function buildTabs() {
    var li = '';
    // Get all Lists at board except placeholder for new List creation to add them to the Bar.
    $('#board .list').each(function () {
      // Get only List's name without any sub-elements.
      var name = $(this).find('.list-header-name').clone().children().remove().end().text();
      if (name) {
        // Create the tab for those List.
        var tab = $('<li/>').addClass('show-list').attr('data-tab-name', name).text(name);
        li += tab[0].outerHTML;
        
        // Mark a List to be able to find it later.
        // TODO: find a way to aviod this kind of marking and search by List's name.
        $(this).addClass('show-list').removeClass('hide-list').attr("data-list-name", name);
      }
    });
    // Replace tabs in the TabBar.
    $('#trellists').hide().empty().fadeIn().append(li);

    // Hides/shows List on click at tab.    
    // We need to attach onClick behaviour for newly created tabs just after they was added to DOM.
    $('#trellists li').click(function () {
      var $list = $("#board .list[data-list-name='" + $(this).attr('data-tab-name') +"']");
      //TODO: use jQuery .toggle instead code below.
      if ($list.hasClass('show-list')) {
        // Hide
        $list.addClass('hide-list').removeClass('show-list').hide();
        $(this).addClass('hide-list').removeClass('show-list');
      } else {
        // Show
        $list.addClass('show-list').removeClass('hide-list').show();
        $(this).addClass('show-list').removeClass('hide-list');
      }
    });
  };

}) ();
