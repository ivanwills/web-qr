
Tables = {
    qr : new Meteor.Collection("qr")
};
Tables.qr.find().forEach(function(table) {
    // only executed on server initally
    Tables[table.collection] = new Meteor.Collection(table.collection);

    console.log(table.collection, ' = ', Tables[table.collection].find().count());
    Tables[table.collection].find().forEach(function(table) {
        console.log(table.name);
        Tables[table.name] = new Meteor.Collection(table.name);
    });
    console.info('Tables = ', Object.keys(Tables).length);
});

