
Meteor.Router.add({
    '/' : function() {
        if ( !Session.get('qr') ||!Tables || !Tables.qr || !Tables.qr.find().count() ) return 'blank';
        setTimeout(function(){ Meteor.Router.to('/' + Session.get('selected_table') ) }, 100);
        return 'loading';
    },
    '/:table' : function(table) {
        var current_table = Session.get('selected_table');
        if ( current_table != table ) {
            Session.set('selected_table', table);
            Session.set("selected_label", null);
        }
        return 'qr';
    },
    '/:table/:label' : function(table, label) {
        var current_table = Session.get('selected_table');
        var current_label = Session.get('selected_label');
        if ( current_table != table ) {
            Session.set('selected_table', table);
            Session.set("selected_label", label);
        }
        else if ( current_label != label ) {
            Session.set("selected_label", label);
        }
        return 'qr';
    },
});

Deps.autorun(function () {
    Meteor.subscribe('qr', Session.get('qr'));
});
Tables = {
    qr : new Meteor.Collection("qr")
};

Deps.autorun(function () {
    Tables.qr.find().forEach(function(table) {
        // only executed on server initally
        Tables[table.collection] = null;
    });

    for ( var table in Tables ) {
        if ( Tables[table] ) continue;

        Deps.autorun(function () {
            Meteor.subscribe(table, Session.get(table));
        });
        Tables[table] = new Meteor.Collection(table);;
    }
    Session.set('qr', true);
});

