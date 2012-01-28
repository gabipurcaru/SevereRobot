$(function() {
    $('button').button();
    $('#submit-message').click(function() {
        var content = $('#message-area').val();
        $.post('/ajax/', {action: 'add_message', content: content}, function() {
            $('#message-area').val("");
            window.location.replace(window.location); // refresh
        });
    });
    var tags = [
        {label: '::1::', value: "::1::"}, 
        {label: '::2::', value: "::2::"}
    ];
    $('#message-area').bind('keyup', function(e) {
        var colon_key = 186; // the ":" key
        if(e.which != colon_key) {
            return true;
        }
        var latest_three = $(this).val().slice(-3);
        var latest_two = latest_three.slice(-2);
        if(latest_three == ":::") {
            $('#task-create').dialog({modal: true});
        } else if(latest_two == "::") {
            
        }
    }).autocomplete({
        minLength: 2,
        delay: 0,
        source: function(request, response) {
            response($.ui.autocomplete.filter(tags, request.term.slice(-2))); // auto suggest based on last 2 chars
        },
        select: function(event, ui) {
            var current_val = $('#message-area').val();
            console.log(current_val);
            var val = current_val.replace(/:*$/, '') + ui.item.value + ' ';
            $('#message-area').val(val);
            return false;
        },
        focus: function(event, ui) {
            return false;       
        }
    });
    $('#create-task').click(function() {
        data = {
            action: 'add_task',
            content: $('#task-description').val(),
            deadline: $('#task-deadline').val(),
            assigned_to: $('#task-assigned-to').val()
        };
        $.post('/ajax/', data, function(response) {
            console.debug(response);
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
})
