
Tables = {
    qr : new Meteor.Collection("qr")
};
Tables.qr.find().forEach(function(table) {
    // only executed on server initally
    Tables[table.collection] = new Meteor.Collection(table.collection);
});

if (Meteor.isClient) {

    Template.nav.tables = function () {
        // Read the collections specified in qr
        Tables.qr.find({}, {}).forEach(function(table) {
            var coll = table.collection;
            if (!Tables[coll]) Tables[coll] = new Meteor.Collection(coll);
        });

        return Tables.qr.find({}, { sort : { pos : 1 } });
    };

    Template.sections.selected = function() {
        if ( !Session.get('selected_table') ) {
            Session.set('selected_table', this.collection);
        }
        return Session.equals("selected_table", this.collection) ? "active" : '';
    };

    Template.sections.table = function() {
        return this.collection;
    };

    Template.sections.events({
        'click' : function() {
            Session.set("selected_table", this.collection);
            Session.set("selected_label", null);
        }
    });

    Template.sidebar.labels = function(a) {
        var collection = Session.get('selected_table');
        if ( !Tables || !collection )
            return;

        var data = Tables.qr.find( { collection : collection } );
        data.forEach(function(d) { data = d });
        return data.sections;
    };

    Template.label.selected = function() {
        if ( !Session.get('selected_label') ) {
            Session.set('selected_label', this.name);
        }
        return Session.equals("selected_label", this.name) ? "active" : '';
    };

    Template.label.events({
        'click' : function() {
            Session.set("selected_label", this.name);
        }
    });

    Template.data.data_heads = function() {
        if ( !Tables || !Session.get('selected_table') || !Tables[Session.get('selected_table')])
            return;

        var found = Tables.qr.findOne({ collection : Session.get('selected_table') });

        console.log('found ');
        if (found) {
            found = _.find(
                found.sections,
                function(section) {
                    return section.name == Session.set('selected_label')
                }
            );
            console.log('found ', found );
            return found.labels;
        }
    };

    Template.data.values = function() {
        if ( !Tables || !Session.get('selected_table') || !Tables[Session.get('selected_table')])
            return;

        var found = Tables[Session.get('selected_table')]
            .findOne(Session.get('selected_label'));

        if (found) {
            console.log(Session.get('selected_table') + ' found values : ', found.values);
            return found.values;
        }
        console.log('nothing found for ', Session.get('selected_table'));
    };

    Template.value.value_cols = function() {
        console.log('val cols');
        if ( !Session.get('selected_table') ) return;

        return Tables[Session.get('selected_table')]
            .find({ type : Session.get('selected_label') });

        var cols = [];
        for ( var lable in found.labels ) {
            cols.push(this[ found.labels[lable].name ]);
        }
        return cols;
    };

    Template.col.attribute = function() {
        console.log('attribute ', this);
    };

}

if (Meteor.isServer) {
for (var key in Tables) console.log(key);
    Meteor.startup(function () {
    });
}
