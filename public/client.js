const socket=io();

const message= document.getElementById('message'),
      handle=document.getElementById('handle'),
      output=document.getElementById('output'),
      typing=document.getElementById('typing'),
      button=document.getElementById('button');


//send typing message
   message.addEventListener('keypress',()=>{
   socket.emit('userTyping',handle.value)
  })

//send messages to client
    button.addEventListener('click',()=>{
    socket.emit('userMessage',{
    handle:handle.value,
    message:message.value
  })

  document.getElementById('message').value="";
})

// listen for the events from the server
  socket.on("userMessage",(data)=>{
    typing.innerHTML="";
    output.innerHTML+='<p><strong>'+data.handle+':</strong>'+data.message+'<p>'
  })

  socket.on('userTyping', (data)=>{
    typing.innerHTML='<p><em>'+data+'is typing...</em></p>'
  })

  // video Chat
  //get the local video and display it with permission
  function getLVideo(callbacks){
    navigator.getUserMedia= navigator.getUserMedia|| navigator.webkitGetUserMedia|| navigator.mozGetUserMedia
    var constraints={
      audio:true,
      video:true
    }
    navigator.getUserMedia(constraints,callbacks.success,callbacks.error)

  }

  function recStream(stream,elemid){
    var video=document.getElementById(elemid);
    video.srcObject=stream;
    window.peer_stream=stream;
  }
  getLVideo({
    success: function(stream){
      window.localstream=stream;
      recStream(stream,'lVideo');
    },
    error:function(err){
      alert("cannot access your camera");
      console.log(err);
    }
  })
  var conn;
  var peer_id;

  // create a peer coonection with apeer object
  var peer = new Peer();

  // display peer id on the DOM
  peer.on('open',function(){
    document.getElementById("displayId").innerHTML=peer.id
  })

  peer.on('connection',function(connection){
    conn=connection;
    peer_id=connection.peer

    document.getElementById('connId').value=peer_id;
  });

  peer.on('error',function(err){
    alert("an error has happened:"+err);
    console.log(err);
  })

  // onclick with the connection button expose our ice information to each other

  document.getElementById('conn_button').addEventListener('click',function(){
    peer_id=document.getElementById("connId").value;

    if(peer_id){
      conn=peer.connect(peer_id)
    }else{
      alert("enter an id");
      return false;
    }
  })

  // call on click (offers and answers is exchanged )
//
peer.on('call',function(call){
  var acceptCall=confirm("DO YOu want to answer this call?");
  if(acceptCall){
    call.answer(window.localstream);
    
    call.on('stream',function(stream){
      window.peer_stream=stream;
      recStream(stream,'rVideo')
    });
    call.on('close',function(){
      alert('the call has behind');
    })
  }else{
    console.log("call denied")
  }
});
// ask to call//

document.getElementById('call_button').addEventListener('click',function(){
  console.log("calling a peer:"+peer_id);
  console.log(peer);
  var call=peer.call(peer_id,window.localstream);
  call.on('stream',function(stream){
    window.peer_stream=stream;
    recStream(stream,'rVideo');
  })
})
// accept the callback
// display the remote video nad local video onn the clients
