const express =require ('express')
const app = express(); //creates the express app
const http = require('http').Server(app); //app is an http server
const io = require('socket.io')(http);

const PORT = process.env.PORT || 7000;

http.listen(PORT,()=>{
  console.log("listening on port"+PORT)
});


app.get('/',(req,res)=>{
  res.sendFile(__dirname +"/index.html")
})

app.use(express.static('public'))

io.on('connection', function(socket){
  console.log("client is connected"+socket.id)

  socket.on('userMessage',(data)=>{
     io.sockets.emit("userMessage",data)
   })

      socket.on('userTyping',(data)=>{
      socket.broadcast.emit('userTyping',data)
  });

})




// io.on('connection', (socket)=>{
//     // callback function after connection is made to the client
//
//     // recieves a chat event, then sends the data to other sockets
//     socket.on('chat', (data)=>{
//         io.sockets.emit('chat', data)
//     });
//
// });
