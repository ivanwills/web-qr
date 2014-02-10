
for ( var table in Tables ) {
    (function(table) {
        Meteor.publish(table, function() {
            console.log(table, Tables[table].find().count());
            return Tables[table].find();
        });
    })(table);
}

Meteor.startup(function () {
});
