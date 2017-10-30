


jQuery(document).ready(function($) {

    $('.rrssb-buttons').rrssb({
        // required:
        title: 'This is the email subject and/or tweet text',
        url: 'http://rrssb.ml/',

        // optional:
        description: 'Longer description used with some providers',
        emailBody: 'Usually email body is just the description + url, but you can customize it if you want'
    });
});
