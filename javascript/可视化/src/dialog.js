function dialog(opts) {
  var slot = opts.slot || '';
  var id = "dialog_" + (new Date()).getTime();
  var msVersion = navigator.userAgent.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/);
  var msie = !!msVersion;
  var ie6 = msie && parseFloat(msVersion[1]) < 7;
  var isMobile = navigator.userAgent.match(/iPad|iPhone|Android|IEMobile|BlackBerry/i);
  var wheelSupport =  'onwheel' in window ? 'wheel' : // Modern browsers support "wheel"
                    'onmousewheel' in document ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
                    "MouseScrollEvent" in window && 'DOMMouseScroll MozMousePixelScroll'; // legacy non-standard event for older Firefox
  var template = '<div class="dialog-wrapper" id="' + id + '">' +
        '<div class="dialog-inner">' +
          '<div class="dialog-header">' +
            '<div class="dialog-header-inner">' +
              '<span class="close-dialog">&times;</span>' +
            '</div>' +
          '</div>' +
          '<div class="dialog-body">' +
            '<div class="dialog-body-inner">' +slot + '</div>' +
          '</div>' +
          '<div class="dialog-footer">' +
            '<div class="dialog-footer-inner">' +
              '<span class="success-dialog">确定</span>' +
              '<span class="close-dialog">取消</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="dialog-overlayer close-dialog"></div>' +
        '</div>';
    $('body').append(template);
    $(document).on('click', '.close-dialog', function () {
      $('#' + id).hide().remove()
    })
    $(document).on(wheelSupport, '.dialog-body-inner', function (event) {
      var e = event || window.event;
      var delta = e.originalEvent.wheelDelta || -e.originalEvent.deltaY || -e.originalEvent.detail; // Gets scroll ammount
          if (msie) {
            this.scrollTop -= Math.round(delta/10);
            return false;
          } // Normalize IE behaviour
      return (delta > 0 && this.scrollTop <= 0 ) || (delta < 0 && this.scrollTop >= this.scrollHeight - this.offsetHeight ) ? false : true; // Finally cancels page scroll when nedded
    })
}
