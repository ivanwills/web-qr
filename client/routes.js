
var WebRouter = Backbone.Router.extend({
    routes: {
        '' : 'default',
        ':table' : 'table',
        ':table/:label' : 'label',
    },
    'default' : function() {
        if ( !Session.get('qr') ||!Tables || !Tables.qr || !Tables.qr.find().count() ) return 'blank';
        setTimeout(function(){ Meteor.Router.to('/' + Session.get('selected_table') ) }, 100);
        return 'loading';
    },
    'table' : function(table) {
        var current_table = Session.get('selected_table');
        if ( current_table != table ) {
            Session.set('selected_table', table);
            Session.set("selected_label", null);
            Session.set('label_group', null);
        }
        return 'qr';
    },
    'label' : function(table, label) {
        var current_table = Session.get('selected_table');
        var current_label = Session.get('selected_label');
        if ( current_table != table ) {
            Session.set('selected_table', table);
            Session.set("selected_label", label);
            Session.set('label_group', false);
            Session.set('groups', []);
        }
        else if ( current_label != label ) {
            Session.set("selected_label", label);
            Session.set('label_group', false);
            Session.set('groups', []);
        }
        return 'qr';
    },
});
var router = new WebRouter();

Backbone.history.start({pushState: true});

Deps.autorun(function () {
    Meteor.subscribe('qr', Session.get('qr'));
});

Deps.autorun(function () {
    Tables.qr.find().forEach(function(table) {
        // only executed on server initially
        Tables[table.collection] = null;
    });

    for ( var table in Tables ) {
        //if ( Tables[table] ) continue;

        Deps.autorun(function () {
            Meteor.subscribe(table, Session.get(table));
        });
        //Tables[table] = new Meteor.Collection(table);;
    }
    Session.set('qr', true);
});

