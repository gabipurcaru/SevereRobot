$(function() {
    $('button').button();
    $('#submit-task').click(function() {
        var content = $('#task-area').val();
        $.post('/ajax/', {action: 'add', content: content}, function() {
            $('#task-area').val("");
            window.location.replace(window.location); // refresh
        });
    });
    $('#task-area').bind('keyup', function(e) {
        var colon_key = 186; // the ":" key
        if(e.which != colon_key) {
            return true;
        }
        var latest_three = $(this).val().slice(-3);
        if(latest_three == ":::") {
            $('#task-create').dialog({modal: true});
        }
    });
})
