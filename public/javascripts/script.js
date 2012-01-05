$(function() {
    $('button').button();
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
    });
    $('#task-create').click(function() {
        $.post('/ajax/', {action: 'add_task'}, function(response) {
            console.debug(response);
        });
    });
})
