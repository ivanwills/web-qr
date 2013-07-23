
Tables = {
    qr : new Meteor.Collection("qr")
};
Tables.qr.find().forEach(function(table) {
    // only executed on server initally
    Tables[table.collection] = new Meteor.Collection(table.collection);
});


for (var key in Tables) console.log(key);

Meteor.startup(function () {
});
