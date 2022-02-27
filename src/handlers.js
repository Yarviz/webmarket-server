require('dotenv').config();
const fs = require('fs');

const update_json = (js_a, js_b) => {
    Object.keys(js_b).forEach((key) => {
        if (typeof js_b[key] === "object") {
            update_json(js_a[key], js_b[key]);
        } else {
            js_a[key] = js_b[key];
        }
    });
}

const log = (item) => {
    if (process.env.NODE_ENV === "test") return;
    console.log(item);
}

class DataHandler {
    #users;
    #postings;
    #user_index;
    #posting_index;

    constructor() {
        this.#users = [];
        this.#postings = [];
        this.#user_index = 0;
        this.#posting_index = 0;
    }

    #fill_posting_contact(posting) {
        // fill posting contactInfo with current contactInfo of user who owns posting
        for (const user of this.#users) {
            if (user._id === posting.user_id) {
                posting.contactInfo = user.contactInfo;
                return;
            }
        }
        posting.contactInfo = {};
    }

    count_users() {
        return this.#users.length;
    }

    count_postings() {
        return this.#postings.length;
    }

    save_user(user) {
        user._id = this.#user_index++;
        this.#users.push(user);
        //log(this.#users);
        return {...this.#users[this.#users.length - 1]._doc};
    }

    save_posting(posting, user_id) {
        posting._id = this.#posting_index++;
        posting.user_id = user_id;
        this.#postings.push(posting);
        //log(this.#postings);
        const new_posting = {...this.#postings[this.#postings.length - 1]._doc}
        this.#fill_posting_contact(new_posting);
        return new_posting;
    }

    find_user(id, email, password) {
        for(const user of this.#users) {
            if (id != null && user._id != id) continue;
            if (email != null && user.email != email) continue;
            if (password != null && user.password != password) continue;
            return {...user._doc};
        }
        return null;
    }

    find_postings(id, user_id, category, location, create_date) {
        let result = [];
        log(`find posting: id=${id} user_id=${user_id} category=${category} location=${location} createDate=${create_date}`)
        for (const posting of this.#postings) {
            if (id != null && posting._id != id) continue;
            if (user_id != null && posting.user_id != user_id) continue;
            if (category != null && posting.postingInfo.category != category) continue;
            if (location != null && posting.postingInfo.location != location) continue;
            if (create_date != null && posting.createDate != create_date) continue;
            this.#fill_posting_contact(posting);
            result.push(posting);
        }
        return result;
    }

    patch_user(id, patch_data) {
        for(const user of this.#users) {
            if (user._id == id) {
                update_json(user, patch_data);
                return {...user._doc};
            }
        }
        return null;
    }

    patch_posting_info(id, patch_data) {
        for(const posting of this.#postings) {
            if (posting._id == id) {
                update_json(posting.postingInfo, patch_data);
                this.#fill_posting_contact(posting);
                return posting;
            }
        }
        return null;
    }

    upload_posting_image(id, filename) {
        for(const posting of this.#postings) {
            if (posting._id == id) {
                posting.images.push(filename);
                return true;
            }
        }
        return false;
    }

    delete_posting(id, user_id) {
        for (let i = 0; i < this.#postings.length; ++i) {
            if (this.#postings[i].id != id) continue;
            if (this.#postings[i].user_id != user_id) continue;
            // delete posting images from filesystem
            this.#postings[i].images.forEach((image) => {
                try {
                    fs.unlinkSync("./public/" + image);
                } catch(err) {
                    console.log(err)
                }
            });
            this.#postings.splice(i, 1);
            return true;
        }
        return false;
    }

    delete_all_data() {
        if (this.#users.length == 0) return false;
        // first delete all posting images from filesystem
        this.#postings.forEach((posting) => {
            posting.images.forEach((image) => {
                try {
                    fs.unlinkSync("./public/" + image);
                } catch(err) {
                    console.log(err)
                }
            });
        })
        // then clear postings and users and set indexes to zero
        this.#postings = [];
        this.#users = [];
        this.#user_index = 0;
        this.#posting_index = 0;
        return true;
    }
}

module.exports = {
    DataHandler,
    log
}