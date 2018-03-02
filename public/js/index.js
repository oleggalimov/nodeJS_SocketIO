function scrollToBottom() {
    let messages = $('#messages');
    let newMessage = messages.children('li:last-child');
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scroHeight = messages.prop('scroHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();
    if (clientHeight+scrollTop + newMessageHeight+lastMessageHeight>= scroHeight) {

    }
}

let socket = io();
socket.on('connect', function () {
    
    console.log('connected');

});
socket.on('ServiceMessage', function(message) {
    let li = document.createElement('li');
    li.setAttribute("style", "color:green; font-style:italic;");
    li.textContent=`${message}`;
    $('#messages').append(li);
    scrollToBottom();
});
socket.on('message', function(message) {
    // let li = document.createElement('li');
    // li.innerHTML=`<text style="color:blue; font-style:italic;">${message.from}: </text> ${message.text}`;
    // $('#messages').append(li);

    let template = $("#message-template").html();
    let html = Mustache.render(template,{message});
    $('#messages').append(html);
    scrollToBottom();

});

socket.on('disconnect', function () { 
    console.log('Disconnected from server');
     
});


$('#UserName').on('keypress', function (key) {
    if(key.which===13) {
        $(this).attr("disabled", "disabled");
        socket.emit('newUser', $(this).val());//передаем имя пользователя
        $('#userMessage').removeAttr("disabled");
        $('#submitButton').removeAttr("disabled");
    }
})

$('#message-form').on('submit', function (event) {
    event.preventDefault();
    socket.emit('sendMessage', {
        from: $('#UserName').val(),
        text: $('[name=userMessage]').val(),
        date:moment().format("DD.MM.YYYY h:mm:ss")
    }, function() {
        $("#userMessage").val('');
    });
    

});
$('#message-form').on('keypress', function (key) {
    if(key.which===13) {
        key.preventDefault();
    }
});