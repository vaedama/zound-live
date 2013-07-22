
zound.ui.Slot = Backbone.View.extend({
  tagName: "li",
  className: "slot",
  tmpl: _.template('<span class="note"><%= note %></span>&nbsp;<span class="module"><%= module %></span>'),
  initialize: function () {
    this.listenTo(this.model, "change", this.render);
    this.render(this.model);
  },
  events: {
    "click": "onClick"
  },
  TONE_SYMBOLS: "CcDdEFfGgAaB",
  noteToText: function (note) {
    var octave = Math.floor(note / 12);
    var tone = note % 12;
    return this.TONE_SYMBOLS[tone]+octave;
  },
  moduleToText: function (module) {
    var name = ""+module.id;
    if (name.length>2) name=name.substring(name.length-2);
    else if (name.length==1) name = "0"+name;
    return name;
  },
  render: function (model) {
    if (model.get("note")) {
      var note = this.noteToText(model.get("note"));
      var module = this.moduleToText(model.get("module"));
      this.$el.html(this.tmpl({
        note: note,
        module: module
      }));
    }
    else {
      this.$el.empty();
    }
  },
  onClick: function () {
    CURRENT_USER.selectTrackerSlot(this);
  }
});

zound.ui.Track = Backbone.View.extend({
  tagName: "ul",
  className: "track",
  options: {
    title: "Track"
  },
  events: {
    "click .off-mode": "onClickOffMode"
  },
  initialize: function (attrs, options) {
    _.extend(this.options, options);
    this.listenTo(this.model, "change:offmode", this.onChangeOffmode);
    this.render();
    this.onChangeOffmode();
  },
  headerTmpl: _.template('<li class="head"><%= title %></li>'),
  footerTmpl: _.template('<li class="foot"><a href="#" class="off-mode"><i class="icon-bullhorn"></i></a></li>'),
  onClickOffMode: function (e) {
    var enabled = !!this.model.get("offmode");
    this.model.set("offmode", !enabled);
  },
  onChangeOffmode: function () {
    this.$el.find(".off-mode").toggleClass("enabled", !!this.model.get("offmode"));
  },
  render: function () {
    var $header = $(this.headerTmpl(this.options));
    this.$el.append($header);
    this.slots = this.model.slots.map(function (slot) {
      var slotUI = new zound.ui.Slot({
        model: slot
      });
      slotUI.track = this;
      this.$el.append(slotUI.el);
      return slotUI;
    }, this);
    var $footer = $(this.footerTmpl(this.options));
    this.$el.append($footer);
  }
});

zound.ui.Tracker = Backbone.View.extend({
  tagName: "div",
  className: "tracker",
  initialize: function () {
    this.render();
    this.listenTo(this.model, "change", this.onChange);
  },
  render: function () {
    var $lineNumbers = $('<ul class="lineNumbers"><li class="head"></li><ul>');
    $lineNumbers.append(_.map(_.range(0, this.model.get("length")), function (i) {
      var text = (i<=9 ? "0" : "")+i;
      return $('<li class="lineNumber">'+text+'</li>');
    }));
    this.$el.append($lineNumbers);

    this.tracks = this.model.tracks.map(function (track, i) {
      var trackUI = new zound.ui.Track({
        model: track
      }, {
        title: ""+i
      });
      trackUI.tracker = this;
      this.$el.append(trackUI.el);
      return trackUI;
    }, this);
  },

  onChange: function () {
    console.log("ui.Tracker.onChange not implemented:", arguments);
  }
});
