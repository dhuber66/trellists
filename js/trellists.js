// TODO: Store state of Lists in LocalStorage so you shouldn't set state each time you opened board.
// TODO: Add ability to show all hidden Lists in one click.

// TODO: 'just_logged_in' = true.
// TODO: BUG: if lists has the same name they will be shown and hidden both at the same time.

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
    // This variable will collect all tabs in top menu.
    var li = '';
    // To count shown and hidden tabs we will use separate variables so we could switch 'Show all' and 'Hide all' tab.
    // TODO: store number of hidden and shown tabs in global variable or LocalStorage and update 'All' button depending on those numbers.
    var shownTabs = hiddenTabs = 0;
    // Get all Lists at board except placeholder for new List creation to add them to the Bar.
    $('#board .list').each(function() {
      // Get only List's name without any sub-elements.
      var name = getListName($(this));
      
      // This check allows to skip 'Add new list' widget.
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
          shownTabs ++;
        }
        else if ($(this).hasClass('hide-list')) {
          $(tab).addClass('hide-list');
          hiddenTabs ++;
        }
        else {
          // for just created lists
          $(tab).addClass('show-list');
          shownTabs ++;
        }
        li += tab[0].outerHTML;
      }
    });

    // Create the tab in Menu for current List.
    var tab = $('<li/>').attr('data-tab-name', 'all').text('Hide all').addClass('show-all');
    if (hiddenTabs == 0 && shownTabs != 0) {
      tab.text('Hide all').removeClass('hide-all').addClass('show-all');
    }
    if (hiddenTabs != 0 && shownTabs == 0) {
      tab.text('Show all').removeClass('show-all').addClass('hide-all');
    }
    
    li += tab[0].outerHTML;

    // Replace tabs in the Menu.
    $('#trellists').empty().append(li);
    
    // If number of list are huge we need to manually resize window so 'Add new card...' widget 
    // and horizontall scroll bar will be shown at the bottom.
    // TODO: code below doesn't work in extension but works fine in browser's console:
    // $(windows).trigger('resize');

    // Hides/shows List on click at tab.
    // We need to attach onClick behaviour for newly created tabs just after they was added to DOM
    // so we can't move out this code.
    $('#trellists li').click(function() {
      var tab = $(this).attr('data-tab-name');
      if (tab == 'all') {
        // 'Hide all/Show all' tab was clicked.
        // TODO: think how to avoid code duplication here.
        var status = $(this).hasClass('show-all') ? 'show-all' : 'hide-all';
        if (status == 'show-all') {
          $('#board .list').each(function() {
            // Check if list has name to avoid 'Add new list...' placeholder.
            if (getListName($(this))) {
              // Hide all lists
              $(this).addClass('hide-list').removeClass('show-list').hide();
            }
          });
        }
        else if (status == 'hide-all') {
          $('#board .list').each(function() {
            // Check if list has name to avoid 'Add new list...' placeholder.
            if (getListName($(this))) {
              // Show all lists
              $(this).addClass('show-list').removeClass('hide-list').show();
            }
          });
        } 
        // Rebuild menu to set correct status.
        buildMenu();
      }
      else {
        // List tab was clicked.
        var status = $(this).hasClass('show-list') ? 'show-list' : 'hide-list';
        var $list = $("#board .list[data-list-name='" + tab +"']");
        var allTab = $('#trellists li[data-tab-name=all]');
        //TODO: use jQuery .toggle instead code below.
        if (status == 'show-list') {
          // Hide related list
          $list.addClass('hide-list').removeClass('show-list').hide();
          // Update current tab.
          $(this).addClass('hide-list').removeClass('show-list');
          // Change 'Show all/Hide all' button.
          allTab.text('Show all').removeClass('show-all').addClass('hide-all');          
        } else {
          // Show related list
          $list.addClass('show-list').removeClass('hide-list').show();
          // Update current tab.
          $(this).addClass('show-list').removeClass('hide-list');
          // Change 'Show all/Hide all' button.
          allTab.text('Hide all').removeClass('hide-all').addClass('show-all');
        }
      }
    }); // 'click' event handler ends here
  };
}) ();
