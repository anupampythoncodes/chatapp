const users = [];

const adduser =({id,name,room})=>{
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    
    const existinguser = users.find((user)=> user.room === room && user.room === name);
    if(existinguser){
        return {error: 'username already taken'};
    } 

    const user = {id,name,room};
    users.push(user);
    return {user};
}
const remuser = (id) =>{
    const index = users.findIndex((user)=> user.id === id );

    if(index !== -1){
        return users.splice(index ,1)[0];
    }
}

const getuser =(id)=> users.find((user)=> user.id === id);
const getuserinrooms = (room) =>users.filter((user)=>user.room ===room);

module.exports = {adduser, remuser ,getuser, getuserinrooms};
