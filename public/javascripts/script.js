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
