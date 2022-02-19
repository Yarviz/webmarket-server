const update_json = (js_a, js_b) => {
    Object.keys(js_b).forEach((key) => {
        if (typeof js_b[key] === "object") {
            update_json(js_a[key], js_b[key]);
        } else {
            js_a[key] = js_b[key];
        }
    });
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
        console.log(posting);
        for (const user of this.#users) {
            if (user._id == posting.user_id) {
                posting.contactInfo = user.contactInfo;
                return;
            }
        }
        posting.contactInfo = {};
    }

    save_user(user) {
        user._id = this.#user_index++;
        this.#users.push(user);
        console.log(this.#users);
        return user._id;
    }

    save_posting(posting, user_id) {
        posting._id = this.#posting_index++;
        posting.user_id = user_id;
        this.#postings.push(posting);
        console.log(this.#postings);
        return posting._id;
    }

    find_user(id) {
        for(const user of this.#users) {
            if (user._id == id) {
                return user;
            }
        }
        return null;
    }

    find_postings(id, user_id, category, location) {
        let result = [];
        let i = 0;
        console.log("thas");
        do {
            if (id != null && this.#postings[i].id != id) continue;
            if (user_id != null && this.#postings[i].user_id != user_id) continue;
            if (category != null && this.#postings[i].category != category) continue;
            if (location != null && this.#postings[i].loctaion != location) continue;
            console.log("this");
            this.#fill_posting_contact(this.#postings[i]);
            result.push(this.#postings[i]);
        } while (++i < this.#postings.lenght);
        /*for (const posting of this.#postings) {
            if (id != null && posting.id != id) continue;
            if (user_id != null && posting.user_id != user_id) continue;
            if (category != null && posting.category != category) continue;
            if (location != null && posting.loctaion != location) continue;
            this.#fill_posting_contact(posting);
            result.push(posting);
        }*/
        return result;
    }

    patch_user(id, patch_data) {
        for(const user of this.#users) {
            if (user._id == id) {
                update_json(user, patch_data);
                return user;
            }
        }
        return null;
    }

    patch_posting(id, patch_data) {
        for(const posting of this.#postings) {
            if (posting._id == id) {
                update_json(posting, patch_data);
                this.#fill_posting_contact(posting);
                return posting;
            }
        }
        return null;
    }

    delete_posting(id, user_id) {
        for (let i = 0; i < this.#postings.length; ++i) {
            if (this.#postings[i].id != id) continue;
            if (this.#postings[i].user_id != user_id) continue;
            this.#postings.splice(i, 1);
            return true;
        }
        return false;
    }
}

module.exports = {
    DataHandler
}