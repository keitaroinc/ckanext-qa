this.ckan.module('openness-info', function (jQuery, _) {

  // Add support for repeat() method in older browsers
  if (!String.prototype.repeat) {
    String.prototype.repeat = function (count) {
      'use strict';
      if (this == null) {
        throw new TypeError('can\'t convert ' + this + ' to object');
      }
      var str = '' + this;
      count = +count;
      if (count != count) {
        count = 0;
      }
      if (count < 0) {
        throw new RangeError('repeat count must be non-negative');
      }
      if (count == Infinity) {
        throw new RangeError('repeat count must be less than infinity');
      }
      count = Math.floor(count);
      if (str.length == 0 || count == 0) {
        return '';
      }
      // Ensuring count is a 31-bit integer allows us to heavily optimize the
      // main part. But anyway, most current (August 2014) browsers can't handle
      // strings 1 << 28 chars or longer, so:
      if (str.length * count >= 1 << 28) {
        throw new RangeError('repeat count must not overflow maximum string size');
      }
      var rpt = '';
      for (var i = 0; i < count; i++) {
        rpt += str;
      }
      return rpt;
    }
  }

  return {
    /* An object of module options */
    options: {
      // data-module-description - set multilingual text that prepends the star rating table
      description: '',
      // data-module-one_star - set multilingual text for the one star rating description
      one_star: '',
      // data-module-two_stars - set multilingual text for the two star rating description
      two_stars: '',
      // data-module-three_stars - set multilingual text for the three star rating description
      three_stars: '',
      // data-module-four_stars - set multilingual text for the four star rating description
      four_stars: '',
      // data-module-five_stars - set multilingual text for the five star rating description
      five_stars: '',

      template: [
        '<div class="modal modal-evaluation fade">',
        '<div class="modal-dialog modal-lg">',
        '<div class="modal-content">',
        '<div class="modal-header">',
        '<button type="button" class="close" data-dismiss="modal">×</button>',
        '<h3 class="modal-title"></h3>',
        '</div>',
        '<div class="modal-body">',
        '<p class="openness-description"></p>',
        '<table class="table table-compact table-bordered">',
        '<colgroup>',
        '<col class="col-sm-4 col-md-3">',
        '<col class="col-sm-8 col-md-9">',
        '</colgroup>',
        '<tbody class="openness-scores">',
        '</tbody>',
        '</table>',
        '</div>',
        '<div class="modal-footer">',
        '<button class="btn btn-default"></button>',
        '</div>',
        '</div>',
        '</div>',
        '</div>'
      ].join('\n')

    },

    /* Sets up the event listeners for the object. Called internally by
     * module.createInstance().
     *
     * Returns nothing.
     */
    initialize: function () {
      jQuery.proxyAll(this, /_on/);
      this.el.on('click', this._onClick);
    },

    /* Presents the user with a confirm dialogue to ensure that they wish to
     * continue with the current action.
     *
     * Examples
     *
     *   jQuery('.delete').click(function () {
     *     module.confirm();
     *   });
     *
     * Returns nothing.
     */
    confirm: function () {
      this.sandbox.body.append(this.createModal());
      this.modal.modal('show');

      // Center the modal in the middle of the screen.
      this.modal.css({
        'margin-top': this.modal.height() * -0.5,
        'top': '50%'
      });
    },

    /* Performs the action for the current item.
     *
     * Returns nothing.
     */
    performAction: function () {
      // create a form and submit it to confirm the deletion
      var form = jQuery('<form/>', {
        action: this.el.attr('href'),
        method: 'POST'
      });
      form.appendTo('body').submit();
    },

    /* Creates the modal dialog, attaches event listeners and localised
     * strings.
     *
     * Returns the newly created element.
     */
    createModal: function () {
      var stars = [];
      if (!this.modal) {
        var element = this.modal = jQuery(this.options.template);
        element.on('click', '.btn-default', this._onConfirmCancel);
        element.modal({
          show: false
        });

        var scores = [this.options.one_star || '', this.options.two_stars || '', this.options.three_stars || '', this.options.four_stars || '', this.options.five_stars || ''];

        element.find('.modal-title').text(this._('Openness'));
        element.find('.modal-body .openness-description').text(this.options.description || '');

        scores.forEach(function (el, index) {
          var scores_table = element.find('.openness-scores');
          var stars = "<span class='fa fa-2x fa-star'></span>";
          scores_table.append('<tr><td class="text-right">' + stars.repeat(index + 1) + '</td><td>' + el + '</td></tr>');
        })

        element.find('.btn-default').text(this._('OK'));
      }
      return this.modal;
    },

    /* Event handler that displays the confirm dialog */
    _onClick: function (event) {
      event.preventDefault();
      this.confirm();
    },

    /* Event handler for the success event */
    _onConfirmSuccess: function (event) {
      this.performAction();
    },

    /* Event handler for the cancel event */
    _onConfirmCancel: function (event) {
      this.modal.modal('hide');
    }
  };
});
