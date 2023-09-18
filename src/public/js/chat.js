const socket = io()

const btn = document.getElementById('enviarmsg')

btn.addEventListener('click', () => {
const email = document.getElementById('mail').value
const message = document.getElementById('msj').value

const data = {email,
    message}


fetch('/api/messages',{method: 'POST',
                      body: JSON.stringify(data),
                      headers: {'Content-type': 'application/json; charset=UTF-8'}
}  )
.then(res=>res.json()  )
    .then(resjson => {
        if(resjson.respuesta !== 'OK'){
           alert(resjson.mensaje.message    ) 
        }
    else  {socket.emit('mensajes')}

})
    

})


socket.on("respuestamensajes", (mensajes) => {
    const bloque = mensajes.map(m =>{
         return(
             `<tr>
             <td>${m.email}</td>
             <td>${m.message}</td>
             <td>${m.postTime}</td>
             </tr>`
         )
 })//limpio hijo si existe
 const cuerpotable = document.getElementById('tablamensajes')
 const eliminardatosanterior = document.getElementById('bloqueainsertar')
 eliminardatosanterior?cuerpotable.removeChild(eliminardatosanterior):''
 
 //limpio bloque (las comas) y creo el elemento
 const bloquelimpio = bloque.join('')
 const bloqueainsertar = document.createElement('TBODY')
 bloqueainsertar.id='bloqueainsertar'
 bloqueainsertar.innerHTML= bloquelimpio
 //agrego hijo
 cuerpotable.appendChild(bloqueainsertar)
 
 })