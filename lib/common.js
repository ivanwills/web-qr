
Tables = {
    qr : new Meteor.Collection("qr")
};
Tables.qr.find().forEach(function(table) {
    // only executed on server initally
    Tables[table.collection] = new Meteor.Collection(table.collection);

    Tables[table.collection].find().forEach(function(table) {
        Tables[table.name] = new Meteor.Collection(table.name);
    });
});

