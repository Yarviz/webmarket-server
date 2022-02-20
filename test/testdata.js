const MAX_USERS = 3;
const test_users = {
    emails: ["erkki@email.com", "pertti@email.com", "heikki@email.com"],
    passwords: ["password_erkki", "password_pertti", "password_heikki"],
    contactInfo: {
        names: ["erkki", "pertti", "heikki"],
        emails: ["erkki@email.com", "pertti@email.com", "heikki@email.com"],
        phones: ["123456", "321432", "987654"]
    }
}

class TestData {
    get_new_test_user(index) {
        const example_new_user = {
            email: test_users.emails[index],
            password: test_users.passwords[index],
            contactInfo: {
                name: test_users.contactInfo.names[index],
                email: test_users.contactInfo.emails[index],
                phone: test_users.contactInfo.phones[index]
            }
        }
        return example_new_user;
    }

    get_test_login(index) {
        const example_login = {
            email: test_users.emails[index],
            password: test_users.passwords[index]
        }
        return example_login;
    }
}

module.exports = {
    MAX_USERS,
    TestData
}