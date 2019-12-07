'use strict';

module.exports = {
    generateRandomData
};

// Make sure to "npm install faker" first.
const Faker = require('faker');

function generateRandomData(userContext, events, done) {
    // generate data with Faker:
    const name = `${Faker.name.firstName()} ${Faker.name.lastName()}`;
    const date = Faker.date.future();
    const price = Faker.random.number();
    const type = Faker.helpers.randomize(['sedan', 'suv', 'van', 'bus']);

    // add variables to virtual user's context:
    userContext.vars.name = name;
    userContext.vars.start_date = date;
    userContext.vars.end_date = Faker.date.future(0,date);
    userContext.vars.price = price;
    userContext.vars.type = type;

    // continue with executing the scenario:
    return done();
}