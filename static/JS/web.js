const socket = io('http://localhost:3001');
const form = document.getElementById('sendContainer');
const messageInp = document.getElementById('messageInp');
const messageContainer = document.querySelector('.messages');

const name = prompt("Enter your name to join the chat"); 

let ting = new Audio('ping.mp3');

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    let message = messageInp.value;
    append(message,'right');
    socket.emit('send',message);
    messageInp.value = '';
})

socket.emit('new-user-joined',name);

const append = (message,position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<p>${message}</p>`;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    
    if(position === 'left')
    {
        ting.play();
    }
}



socket.on('user-joined',name=>{
    append(`${name} joined the chat`,'right');
})
socket.on('left',name=>{
    append(`${name} left the chat`,'left');
})
socket.on('receive',data=>{
    append(`${data.name}: ${data.message}`,'left');
})