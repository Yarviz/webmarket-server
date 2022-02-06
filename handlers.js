
class DataHandler {
    constructor() {
        this.users = [];
        this.postings = [];
        this.user_index = 0;
        this.posting_index = 0;
    }

    save_user(user) {
        user._id = this.user_index++;
        this.users.push(user);
        console.log(this.users);
    }
}

module.exports = {
    DataHandler
}