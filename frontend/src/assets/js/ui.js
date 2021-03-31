(function($){
    var $startY;
    var $endY;
    // var $currentHeight;
    // var $targetItem = $(".layout-fixed-bottom");
    // var $targetArea = $targetItem.children(".section-target");

    var $document = $(document);

    $document.on("touchstart", '.layout-fixed-bottom .section-target', function (e) {
        var $targetItem = $(".layout-fixed-bottom");
        $startY = e.originalEvent.touches[0].pageY;
        //$currentHeight = $this.height();
        $targetItem.removeClass("is-animate");
    });
    $document.on("touchend", '.layout-fixed-bottom .section-target', function (e) {
        var $targetItem = $(".layout-fixed-bottom");
        $endY = e.originalEvent.changedTouches[0].pageY;

        if($startY > $endY) {
            $targetItem.attr("aria-expanded", "true");
            $targetItem.removeAttr("style");
            $targetItem.addClass("is-animate");
        } else {
            $targetItem.attr("aria-expanded", "false");
            $targetItem.removeAttr("style");
            $targetItem.addClass("is-animate");
        }
    });
    $document.on("touchmove", '.layout-fixed-bottom .section-target', function (e) {
        var $targetItem = $(".layout-fixed-bottom");
        var screenHeight = $(window).innerHeight();
        var moveY = Math.floor(e.originalEvent.changedTouches[0].pageY);
        var result = (screenHeight - moveY);

        $targetItem.css({height : result});
    });
    $document.on("click", '.layout-fixed-bottom .section-target', function (e) {
        var $targetItem = $(".layout-fixed-bottom");
        if($targetItem.attr("aria-expanded") == "true") {
            $targetItem.attr("aria-expanded", "false");
            $targetItem.addClass("is-animate");
        } else {
            $targetItem.attr("aria-expanded", "true");
            $targetItem.addClass("is-animate");
        }
    });
}(jQuery));
