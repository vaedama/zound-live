
zound.models.User = Backbone.Model.extend({

  defaults: {
    trackerIncrement: 1
  },

  getSelectedSlot: function () {
    return this.currentTrackerSlot;
  },

  modulo: function (n, l) {
    return (n+l)%l;
  },

  moveTrackerSelection: function (incrX, incrY) {
    var slot = this.getSelectedSlot();
    if (slot && (incrX || incrY)) {
      var track = slot.track;
      var slotNumber = track.slots.indexOf(slot);
      var tracker = track.tracker;
      var trackNumber = tracker.tracks.indexOf(track);
      trackNumber = this.modulo(trackNumber+incrX, tracker.tracks.length);
      var newTrack = tracker.tracks[trackNumber] || track;
      slotNumber = this.modulo(slotNumber+incrY, newTrack.slots.length);
      var newSlot = newTrack.slots[slotNumber] || slot;
      if (newTrack !== track || newSlot !== slot) {
        CURRENT_USER.selectTrackerSlot(newSlot);
      }
    }
  },

  selectTrackerSlot: function (view) {
    if (this.currentTrackerSlot) {
      this.unselectCurrentTrackerSlot();
    }
    var name = this.get("name");
    view.model.trigger("user-select", name);
    view.$el.attr("user-select", name);
    this.currentTrackerSlot = view;
  },

  unselectCurrentTrackerSlot: function () {
    var view = this.currentTrackerSlot;
    if (view) {
      var name = this.get("name");
      view.model.trigger("user-unselect", name);
      view.$el.removeAttr("user-select");
      this.currentTrackerSlot = null;
    }
  },

  getCurrentModule: function () {
    return this.currentModule;
  },

  selectModule: function (model) {
    if (this.currentModule) {
      this.unselectModule();
    }
    model.trigger("user-select", this.get("name"));
    this.currentModule = model;
  },

  unselectModule: function () {
    var view = this.currentModule;
    if (view) {
      model.trigger("user-unselect", this.get("name"));
      this.currentModule = null;
    }
  }

});

zound.models.Users = Backbone.Collection.extend({
  model: zound.models.User
});