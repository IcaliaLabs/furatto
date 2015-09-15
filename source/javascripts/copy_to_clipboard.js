$(document).ready(function() {
    var copy_sel = $('a.code-copy');

    // Disables other default handlers on click (avoid issues)
    copy_sel.on('click', function(e) {
        e.preventDefault();
    });

    // Apply clipboard click event
    copy_sel.clipboard({
        path: '/javascripts/vendor/jquery.clipboard.swf',

        copy: function() {
            var this_sel = $(this);

            this_sel.text('Copied!');

            setTimeout(function(){
              this_sel.text('Copy');
            }, 3000);
            // Hide "Copy" and show "Copied, copy again?" message in link
            //this_sel.find('.code-copy-first').hide();
            //this_sel.find('.code-copy-done').show();

            // Return text in closest element (useful when you have multiple boxes that can be copied)
            return this_sel.next('.language-markup').text().trim();
        }
    });
});
