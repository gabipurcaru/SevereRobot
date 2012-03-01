$(function() {
    $('#submit-message').click(function() {
        var content = $('#message-area').val();
        $.post('/ajax/', {action: 'add_message', content: content}, function() {
            $('#message-area').val("");
            window.location.replace(window.location); // refresh
        });
    });
    if($('#message-area').length) {
        $('#message-area').bind('keyup', function(e) {
            var colon_key = 186; // the ":" key
            if(e.which != colon_key) {
                return true;
            }
            var latest_three = $(this).val().slice(-3);
            if(latest_three == ":::") {
                $('#task-create').dialog({modal: true});
            }
        }).autocomplete({
            minLength: 2,
            delay: 0,
            source: function(request, response) {
                $.post('/ajax/', {action: 'task_autosuggest_list'}, function(tags) {
                    // auto suggest based on last 2 chars
                    response($.ui.autocomplete.filter(tags, request.term.slice(-2))); 
                }, "json");
            },
            select: function(event, ui) {
                var current_val = $('#message-area').val();
                var val = current_val.replace(/:*$/, '') + ui.item.value + ' ';
                $('#message-area').val(val);
                return false;
            },
            focus: function(event, ui) {
                return false;       
            }
        }).data("autocomplete")._renderItem = function(ul, item) {
            return $('<li>').data("item.autocomplete", item) 
                .append("<a>" + item.desc + "</a>").appendTo(ul);
        };
    }
    $('#create-task').click(function() {
        data = {
            action: 'add_task',
            title: $('#task-title').val(),
            content: $('#task-description').val(),
            deadline: $('#task-deadline').val(),
            assigned_to: $('#task-assigned-to').val()
        };
        $.post('/ajax/', data, function(response) {
            var original_value = $('#message-area').val();
            $('#message-area').val(original_value.slice(0, -3) 
                                   + '::' + response + '::');
            $('#task-create').dialog('close');
        });
    });
    $('.task-label').on('hover', function(e) {
        var preview = $(this).next().next();
        preview.toggle();
        preview.offset({
            'top': e.pageY+10,
            'left': e.pageX-10
        });
    })
    $('.task-label').on('click', function() {
        var details = $(this).next();
        var show = !details.is(':visible');
        $('.task-details').stop().hide('fast', 'easeInCirc');
        if(show) {
            details.show('fast', 'easeOutCirc');
            details.find('textarea').focus();
        }
    });
    $('.change-status .status').on('change', function() {
        var data = {
            'action': 'change_status',
        }
        var data = $(this).parents('.change-status:first').serialize();
        data = data + '&action=change_status';
        $.post('/ajax/', data, function() {
            window.location.replace(window.location);
        });
    });
    $('.add-comment').submit(function() {
        var data = $(this).serialize() + "&action=add_comment";
        $.post('/ajax/', data, function() {
            window.location.replace(window.location);
        });
    });

    // task view page
    $('.task-view-page .task .banner').click(function() {
        var data = $(this).siblings('.data');
        data.find('.change-status').toggle();
        if(data.height() == 0) {
            data.height('100%');
            data.find('textarea').focus();
        } else {
            data.animate({height: 0}, 'fast');
        }
    });
})
