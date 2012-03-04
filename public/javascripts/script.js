$(function() {
    $('#submit-message').click(function() {
        var content = $('#message-area').text();
        $.post('/ajax/', {action: 'add_message', content: content}, function() {
            $('#message-area').html("");
            window.location.replace(window.location.pathname); // refresh
        });
        return false;
    });
    if($('#message-area').length) {
        var show_suggestion = (function() {
            var suggest_data = null;
            var suggest = function() {
                var selection = window.getSelection();
                var range = selection.getRangeAt(0);
                var node = $('<span>');
                range.insertNode(node[0]);
                var offset = node.offset();
                offset.left += 3;
                $('#autosuggest').show();
                $('#autosuggest').offset(offset);
                node.remove();
            };
            return function() {
                if(!suggest_data) {
                    $.post('/ajax/', {action: 'task_autosuggest_list'}, function(tags) {
                        $('#autosuggest').html($('<ul>'));
                        suggest_data = tags;
                        $.each(tags, function(idx, tag) {
                            $('#autosuggest ul').append($('<li>').html(tag.desc).data('val', tag.value));
                        });
                        $("#autosuggest ul li:first").addClass('selected');
                        suggest();
                    }, 'json');
                } else {
                    suggest();
                }
            };
        })();
        var hide_suggestion = function() {
            $('#autosuggest').hide();
        }
        $('#message-area').bind('keyup', function(e) {
            var keycode = e.keyCode || e.which;
            if(keycode >= 37 && keycode <= 40) { // i.e. is arrow key
                return; // ignore the action
            }
            var selection = window.getSelection();
            var offset = selection.focusOffset;
            var latest_three = selection.focusNode.textContent.slice(Math.max(0, offset-3), offset);
            if(latest_three == ":::") {
                hide_suggestion();
                $('#task-create').dialog({modal: true});
            } else if(latest_three.slice(-2) == '::') {
                show_suggestion();
            } else {
                hide_suggestion();
            }
        });
        $('#message-area').bind('keydown', function(e) {
            var keycode = e.keyCode || e.which;
            var backspace = 8;
            var del = 46;
            if(keycode != 8 && keycode != 46) {
                return;
            }
            var selection = rangy.getSelection();
            console.log(selection);
            if((selection.anchorOffset || !selection.anchorNode.nodeValue) == 0 && keycode == backspace) {
                console.debug(selection.anchorNode);
                var previous = selection.anchorNode.previousSibling;
                console.debug(previous);
                previous.parentNode.removeChild(previous);
            }
        });
        $('#message-area').bind('keydown', function(e) {
            if($('#autosuggest').is(':hidden')) {
                return;
            }
            var keycode = e.keyCode || e.which;
            var up_key = 38;
            var down_key = 40;
            var enter_key = 13;
            if(keycode != up_key && keycode != down_key && keycode != enter_key) {
                return;
            } else {
                e.preventDefault();
                if(keycode == enter_key) {
                    var value = $('#autosuggest ul li.selected').data('val').replace(/:/g, '');
                    var selection = rangy.getSelection();
                    var offset = selection.anchorOffset;
                    var node = $('#message-area')[0];
                    var new_element = $('<span contenteditable="false" class="task-label active">').html('#' + value);
                    var text_before = document.createTextNode(selection.anchorNode.nodeValue.slice(0, offset-2));
                    var text_after = document.createTextNode(selection.anchorNode.nodeValue.slice(offset));
                    if(!text_after.nodeValue) {
                        text_after = document.createTextNode(" ");
                    }
                    node.insertBefore(text_after, selection.anchorNode);
                    node.insertBefore(text_before, text_after);
                    node.insertBefore(new_element[0], text_after);
                    node.removeChild(selection.anchorNode);
                    var range = rangy.createRange();
                    range.setStart(text_after, 0);
                    range.setEnd(text_after, 0);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    return;
                }
                if(keycode == up_key) {
                    var changed = $('#autosuggest ul li.selected').prev();
                } else {
                    var changed = $('#autosuggest ul li.selected').next();
                }
                if(changed.length) {
                    $('#autosuggest ul li.selected').removeClass('selected');
                    changed.addClass('selected');
                }
            }
        });
        /*.autocomplete({
            minLength: 2,
            delay: 0,
            source: function(request, response) {
                $.post('/ajax/', {action: 'task_autosuggest_list'}, function(tags) {
                    // auto suggest based on last 2 chars
                    response($.ui.autocomplete.filter(tags, request.term.slice(-2))); 
                }, "json");
            },
            select: function(event, ui) {
                var current_val = $('#message-area').text();
                var val = current_val.replace(/:*$/, '') + ui.item.value + ' ';
                $('#message-area').html(val);
                return false;
            },
            focus: function(event, ui) {
                return false;       
            }
        }).data("autocomplete")._renderItem = function(ul, item) {
            return $('<li>').data("item.autocomplete", item) 
                .append("<a>" + item.desc + "</a>").appendTo(ul);
        };*/
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
            var original_value = $('#message-area').text();
            $('#message-area').html(original_value.slice(0, -3) 
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
            window.location.replace(window.location.pathname);
        });
        return false;
    });
    $('.add-comment').submit(function() {
        var data = $(this).serialize() + "&action=add_comment";
        $.post('/ajax/', data, function() {
            window.location.replace(window.location.pathname);
        });
        return false;
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
