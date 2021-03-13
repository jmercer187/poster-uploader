exports.getSuccess = (req, res) => {
    res.render('success', { pageTitle: 'great success'});
}

exports.getFail = (req, res) => {
    res.render('fail', { pageTitle: 'ejs is correctly'});
}
