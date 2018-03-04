class Users {
    constructor() {
        this.users = [];
    }
    addUser(userId, userName, roomName) {
        let user = { userId, userName, roomName };
        this.users.push(user);
        return user;
    }
    getUser(Id) {
       return this.users.filter((user) => user.userId === Id)[0];
        
    }
    removeUser(Id) {
        let user = this.getUser(Id);//плохая практика, переписать!
        if (user) {
            this.users=this.users.filter(user => user.userId!== Id);
        }
        return user;
    }
    getUserList(roomName) {
        let users = this.users.filter(user => user.roomName === roomName);
        let names = users.map(user => user.userName);
        return names;
    }



}
module.exports = {
    Users
};