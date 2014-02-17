/*global Backbone,Session,Tables,Deps,Meteor */

var WebRouter = Backbone.Router.extend({
    routes: {
        '' : 'default',
        ':table' : 'table',
        ':table/:label(/:filter)' : 'label',
    },
    'default' : function() {
        if ( !Session.get('qr') || !Tables || !Tables.qr || !Tables.qr.find().count() ) return 'blank';
        setTimeout(function(){ this.navigate('/' + Session.get('selected_table') ); }, 100);
        return 'loading';
    },
    'table' : function(table) {
        console.info('routing table');
        if ( !Session.equals('selected_table', table) ) {
            console.info('selected routing table');
            Session.set('selected_table', table);
            Session.set("selected_data", null);
            Session.set('label_group', null);
        }
        return 'qr';
    },
    'label' : function(table, label, filter) {
        console.info('routing data');
        if ( !Session.equals('selected_table', table) ) {
            console.info('selected routing table data');
            Session.set('selected_table', table);
            Session.set("selected_data", label);
            Session.set('label_group', false);
            Session.set('groups', []);
        }
        else if ( !Session.equals('selected_data', label) ) {
            console.info('selected routing data');
            Session.set("selected_data", label);
            Session.set('label_group', false);
            Session.set('groups', []);
        }
        return 'qr';
    },
});
window.router = new WebRouter();

Backbone.history.start({pushState: true});

window.Tables = [];

function loadTable(name) {

    Deps.autorun( function() {
        Meteor.subscribe(name, Session.get(name) );
    });

    if ( !Tables[name] )
        Tables[name] = new Meteor.Collection(name);

    Deps.autorun(function() {
        if ( !Tables[name].find().count() )
            return;

        // only process sub collections if they exist
        if ( Tables[name].findOne().collection ) {
            Tables[name].find().forEach( function(row) {

                var load = (function(childName){
                    Session.set(name, 2);
                    return function(){ loadTable(childName); };
                })(row.collection);

                Deps.autorun(load);
            });
        }

        var val = Tables[name].find().count() + 1;
        Session.set(name, val);
    });

    if ( !Session.get(name) )
        Session.set(name, false);
}

loadTable('qr');
