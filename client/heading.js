Template.nav.tables = function () {
    // Read the collections specified in qr
    Tables.qr.find({}, {}).forEach(function(table) {
        var coll = table.collection;
        if (!Tables[coll]) Tables[coll] = new Meteor.Collection(coll);
    });

    return Tables.qr.find({}, { sort : { pos : 1 } });
};
