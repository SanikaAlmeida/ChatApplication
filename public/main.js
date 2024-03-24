const socket = io();

const clienttotal = document.getElementById('client-total')
const messagecontainer = document.getElementById('message-container')
const nameinput = document.getElementById('name-input')
const messageform = document.getElementById('message-form')
const messageinput = document.getElementById('message-input')

messageform.addEventListener('submit', (e) => {
    e.preventDefault()           //prevent refreshing
    sendText()
})

socket.on('clients-total', (data) => {
    clienttotal.innerHTML = `Total Clients: ${data}`
})

function sendText() {
    if (messageinput.value=='')
    {return}
    const data = {
        name: nameinput.value,
        message: messageinput.value,
        datetime: new Date()
    }
    socket.emit('message', data)
    addmessage(true,data)
    messageinput.value='';
}

socket.on('chat-message', (data) => {
    addmessage(false,data)
})

function addmessage(own, data) {
    clearstatus()
    const element = `
    <li class="${own ? 'message-right' : 'message-left'}">
        <p class="message">
            ${data.message}
            <span>${data.name} ● ${moment(data.datetime).format('MMMM Do YYYY, h:mm a')}</span>
        </p>
    </li>
    `;
    messagecontainer.innerHTML +=element;
    scroll();
}

function scroll(){
    messagecontainer.scrollTo(0,messagecontainer.scrollHeight)
}

messageinput.addEventListener('focus',(e)=>{
    socket.emit('status',{
        status:`${nameinput.value} is typing a message`
    })
})
messageinput.addEventListener('keypress',(e)=>{
    socket.emit('status',{
        status:`${nameinput.value} is typing a message`
    })
})
messageinput.addEventListener('blur',(e)=>{
    socket.emit('status',{
        status:''
    })
})
socket.on('status', (data) => {
    clearstatus();
    const element = `
        <li class="message-feedback">
            <p class="feedback" id="feedback">${data.status}</p>
        </li>`
        messagecontainer.insertAdjacentHTML('afterbegin', element);
});

function clearstatus(){
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element); 
    });
}
