
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
    console.log(Tables);
    Session.set('qr', true);
});

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

Template.label.table = function(a) {
    return Session.get('selected_table');
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
                return Session.equals('selected_label', section.name)
            }
        );
        if (!found) return;

        console.log( 'headings ', found);
        Session.set('labels', found.labels);
        return found.labels;
    }
};

Template.data.values = function() {
    var selected_table = Session.get('selected_table');
    var selected_label = Session.get('selected_label');
    console.log('table ', selected_table, ' - ', selected_label);

    if ( !Tables || !selected_table || !Tables[selected_table])
        return;

    console.log('finding ', selected_table, ' - ', selected_label);
    var found = Tables[selected_table]
        .find({ type : selected_label}, {limit : 299} );

    if (found) {
        console.log(selected_table + ' found values : ', found);
        return found;
    }
    console.log('nothing found for ', selected_table, ' - ', selected_label);
};

Template.value.events({
    'mouseenter tr' : function() {
        console.log('this', this.examples, ' last ', Session.get('example'));
        Session.set('example', this.examples);
    }
});

Template.value.value_cols = function() {
    if ( !Session.get('selected_table') ) return;

    var columns = Session.get('labels');
    var values = [];
    for ( var i in columns ) {
        values.push( this[ columns[i].name ] );
    }
    return values;
};

Template.col.attribute = function() {
    console.log('attribute ', this);
};

Template.sidebar.hover = function() {
    console.log('hover', Session.get('example') );
    return Session.get('example');
};

Template.example.examples = function() {
    return Session.get('example');
};
