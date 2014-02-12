
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
            Session.set("selected_data", null);
            Session.set("labels", null);
        }
    }
});

Template.sidebar.labels = function(a) {
    var collection = Session.get('selected_table');
    if ( !Session.get(collection) || !Tables[collection] ) {
        console.warn('not loaded ', collection, ' yet');
        return;
    }

    var table = Tables[collection];
    return table ? table.find() : [];
};

Template.sidebar.hover = function() {
    return Session.get('example');
};

Template.label.table = function(a) {
    return Session.get('selected_table');
};

Template.label.selected = function() {
    if ( !Session.get('selected_data') ) {
        Session.set('selected_data', this.collection);
    }
    return Session.equals("selected_data", this.collection) ? "active" : '';
};

Template.label.events({
    'click' : function() {
        if ( !Session.equals("selected_data", this.collection) ) {
            Session.set("selected_data", this.collection);
            Session.set('label_group', false);
            Session.set('groups', []);
        }
        router.navigate(this.href, { trigger: false });
        return false;
    }
});

