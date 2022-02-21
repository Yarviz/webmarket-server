const MAX_USERS = 3;
const MAX_POSTINGS = 3;

const test_users = {
    emails: ["erkki@email.com", "pertti@email.com", "heikki@email.com"],
    passwords: ["password_erkki", "password_pertti", "password_heikki"],
    contactInfo: {
        names: ["erkki", "pertti", "heikki"],
        emails: ["erkki@email.com", "pertti@email.com", "heikki@email.com"],
        phones: ["123456", "321432", "987654"]
    }
}

const test_postings = {
    titles: ["great book", "great magazine", "great car"],
    descriptions: ["great book", "great magazine", "great car"],
    categorys: ["books", "books", "cars"],
    locations: ["Helsinki", "Oulu", "Oulu"],
    prices: [10, 20, 30],
    deliveryTypes: ["shipping", "shipping", "pickup"]
};

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

    get_new_test_posting(index) {
        const example_posting = {
            title: test_postings.titles[index],
            description: test_postings.descriptions[index],
            category: test_postings.categorys[index],
            location: test_postings.locations[index],
            price: test_postings.prices[index],
            deliveryType: test_postings.deliveryTypes[index]
        }
        return example_posting;
    }
}

module.exports = {
    MAX_USERS,
    MAX_POSTINGS,
    TestData
}