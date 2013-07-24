
Tables = {
    qr : new Meteor.Collection("qr")
};
Tables.qr.find().forEach(function(table) {
    // only executed on server initally
    Tables[table.collection] = new Meteor.Collection(table.collection);
});

for ( var table in Tables ) {
    console.log(table);
    (function(table) {
        Meteor.publish(table, function() {
            return Tables[table].find();
        });
    })(table);
}

Meteor.startup(function () {
});
