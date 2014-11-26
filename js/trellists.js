// TODO: when 'Points for Trello' changes header topBar updates and loose status of list. We should get this status from original List when rebuild topBar.
// TODO: store state of Lists in LocalStorage.
// TODO: add a 'Show all' button.

// TODO: 'just_logged_in' = true.

// Trello.com loads lists after whole page loaded and DOM is ready so we need to
// wait for some DOM-elements appear on page and then react on this change.
// Custom jQuery plugin was used to wait while required DOM-element will be created.
// See https://gist.github.com/md55/6565078

(function() {

  // This element appears last at page and we use it to add the Menu to page and set status for each List.
  $('#board .list form .js-open-add-list').waitUntilExists(function() {
    if ($('#trellists').length == 0) {
      // Insert bar placeholder to header. Should run only once.
      $('<ul/>').attr('id', 'trellists').appendTo('.board-header');

      // Set default 'show-list' status to all lists.
      // TODO: store status in LocalStorage and save status of Lists there.
      $('#board .list').each(function() {
        $(this).removeClass('hide-list').addClass('show-list');
      });
    }

    // Update Menu on List insert/archive/remove.
    buildMenu();
  });

  // Update  list name on change. Already optimized.
  $('.list h2.list-header-name').waitUntilExists(function() {
    $('.list h2.list-header-name').bind('DOMSubtreeModified', function() {
      var name = getListName($(this).parent().parent());
      // Somehow List title could be empty and we need to pass by this case.
      // Compare old title and new one to run only on title change but not subtree changes or etc.
      if (name && name != $(this).parent().parent().attr('data-list-name')) {
        buildMenu();
      }
    });
  });

  // Update on List's drag-n-drop movements.
  $('#board .placeholder').waitUntilExists(function() {
    $('#board .placeholder').bind('DOMNodeRemovedFromDocument', function(e) {
      buildMenu();
    });
  });

  // Get List name.
  function getListName(list) {
    return list.find('.list-header-name').clone().children().remove().end().text();
  }

  /**
   * Build Top Bar which shows titles of existing lists.
   * Each time new list created ate page we rebuild top bar.
   */
  function buildMenu() {
    var li = '';
    // Get all Lists at board except placeholder for new List creation to add them to the Bar.
    $('#board .list').each(function() {
      // Get only List's name without any sub-elements.
      var name = getListName($(this));
      if (name) {
        // Create the tab in Menu for current List.
        var tab = $('<li/>').attr('data-tab-name', name).text(name);

        // Mark a List to be able to find it later.
        // TODO: find a way to aviod this kind of marking and search by List's name.
        if ($(this).attr("data-list-name") != name) {
          // Update List name in attribute only if it's necessary.
          $(this).attr("data-list-name", name);
        }

        // Tabs should duplicate status (hide/show) of actual List.
        // Set default status 'show-list' and change it only if actual List has status.
        if ($(this).hasClass('show-list')) {
          $(tab).addClass('show-list');
        }
        else if ($(this).hasClass('hide-list')) {
          $(tab).addClass('hide-list');
        }
        li += tab[0].outerHTML;
      }
    });

    // Replace tabs in the Menu.
    $('#trellists').empty().append(li);

    // Hides/shows List on click at tab.
    // We need to attach onClick behaviour for newly created tabs just after they was added to DOM.
    $('#trellists li').click(function() {
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
