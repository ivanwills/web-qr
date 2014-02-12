
Tables = {
    qr : new Meteor.Collection("qr")
};
Tables.qr.find().forEach(function(table) {
    // only executed on server initally
    Tables[table.collection] = new Meteor.Collection(table.collection);

    console.log(table.collection, ' = ', Tables[table.collection].find().count());
    Tables[table.collection].find().forEach(function(table) {
        if (!table.collection)
            return;

        console.log(table.collection);
        Tables[table.collection] = new Meteor.Collection(table.collection);
    });
    console.info('Tables = ', Object.keys(Tables).length);
});

Meteor.startup(function () {
    console.info('------ Tables = ', Object.keys(Tables).length);
    for ( var table in Tables ) {
        console.log(1, table);
        (function(table) {
        console.log(2, table);
            Meteor.publish(table, function() {
                console.log(3, table, Tables[table].find().count());
                return Tables[table].find();
            });
        })(table);
    }

});
