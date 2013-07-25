Meteor.Router.add({
    '/' : function() {
        console.log('root');
        if ( !Session.get('qr') ||!Tables || !Tables.qr || !Tables.qr.find().count() ) return 'blank';
        setTimeout(function(){ Meteor.Router.to('/' + Session.get('selected_table') ) }, 100);
        return 'loading';
    },
    '/:table' : function(table) {
        console.log('table');
        var current_table = Session.get('selected_table');
        if ( current_table != table ) {
            Session.set('selected_table', table);
            Session.set("selected_label", null);
        }
        return 'qr';
    },
    '/:table/:label' : function(table, label) {
        console.log('label');
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
