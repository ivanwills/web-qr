
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
        if ( !Session.equals("selected_table", this.collection) ) {
            Session.set("selected_table", this.collection);
            Session.set("selected_label", null);
            Session.set("labels", null);
        }
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

Template.sidebar.hover = function() {
    return Session.get('example');
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
        if ( !Session.equals("selected_label", this.name) ) {
            Session.set("selected_label", this.name);
            Session.set('label_group', false);
            Session.set('groups', []);
        }
        return false;
    }
});

