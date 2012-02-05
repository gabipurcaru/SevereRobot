$(function() {
    $('#submit-message').click(function() {
        var content = $('#message-area').val();
        $.post('/ajax/', {action: 'add_message', content: content}, function() {
            $('#message-area').val("");
            window.location.replace(window.location); // refresh
        });
    });
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
                response($.ui.autocomplete.filter(tags, request.term.slice(-2))); // auto suggest based on last 2 chars
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
        return $('<li>').data("item.autocomplete", item).append("<a>" + item.desc + "</a>").appendTo(ul);
    };
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
            $('#message-area').val(original_value.slice(0, -3) + '::' + response + '::');
            $('#task-create').dialog('close');
        });
    });
    $('.task-label').on('click', function() {
        $(console.log(this));
        window.debug = this;
        $(this).next().toggle();
    });
    $('.add-comment').submit(function() {
        var data = $(this).serialize() + "&action=add_comment";
        $.post('/ajax/', data, function() {
            window.location.replace(window.location);
        });
    });
})
