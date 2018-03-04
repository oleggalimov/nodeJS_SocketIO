function scrollToBottom() {
    let messages = $('#messages');
    let newMessage = messages.children('li:last-child');
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scroHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();
    if (clientHeight+scrollTop + newMessageHeight+lastMessageHeight>= scroHeight) {
        messages.scrollTop(scroHeight);
    }
}

let socket = io();
socket.on('connect', function () {
    let params = $.deparam(window.location.search);
    socket.emit('join', params, function(error){
        if (error) {
            alert (error);
            window.location.href='/';
        } else {
            console.log('No error');
        }
    });
});
socket.on('ServiceMessage', function(message) {
    let li = document.createElement('li');
    li.setAttribute("style", "color:green; font-style:italic;");
    li.textContent=`${message}`;
    $('#messages').append(li);
    scrollToBottom();
});
socket.on('message', function(userName, text, date) {
    // let li = document.createElement('li');
    // li.innerHTML=`<text style="color:blue; font-style:italic;">${message.from}: </text> ${message.text}`;
    // $('#messages').append(li);

    let template = $("#message-template").html();
    let html = Mustache.render(template,{from:userName, message:text,when:date});
    $('#messages').append(html);
    scrollToBottom();

});

socket.on ('updateUserList', function (usersArray) {
    let ol = $('<ol></ol>');
    usersArray.forEach(function(usr) {
        ol.append($('<li></li>').text(usr));
    });
    $('#users').html(ol);
    console.log(usersArray);
});


socket.on('disconnect', function () { 
    console.log('Disconnected from server');
     
});


// $('#UserName').on('keypress', function (key) {
//     if(key.which===13) {
//         $(this).attr("disabled", "disabled");
//         socket.emit('newUser', $(this).val());//передаем имя пользователя
//         $('#userMessage').removeAttr("disabled");
//         $('#submitButton').removeAttr("disabled");
//     }
// })

$('#message-form').on('submit', function (event) {
    event.preventDefault();
    socket.emit('sendMessage', {
        
        text: $('[name=userMessage]').val(),
        date:moment().format("DD.MM.YYYY h:mm:ss")
    }, function() {
        $("#userMessage").val('');
    });
    

});
// $('#message-form').on('keypress', function (key) {
//     if(key.which===13) {
//         key.preventDefault();
//     }
// });