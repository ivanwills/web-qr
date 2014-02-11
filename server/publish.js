
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
