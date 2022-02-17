
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
        return user._id;
    }

    save_posting(posting, user_id) {
        posting._id = this.posting_index++;
        posting.contactInfo._id = user_id;
        this.postings.push(posting);
        console.log(this.postings);
        return posting._id;
    }

    find_user(id) {
        for(const user of this.users) {
            if (user._id == id) {
                return user;
            }
        }
        return null;
    }

    patch_user(id, patch_data) {
        for(const user of this.users) {
            if (user._id == id) {
                Object.keys(patch_data).forEach((key) => {
                    user[key] = patch_data[key];
                });
                return user;
            }
        }
        return null;
    }
}

module.exports = {
    DataHandler
}